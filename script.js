// ===================================================
// RemanPedia - Jikan API (MyAnimeList) Implementation
// ===================================================
const JIKAN_API = 'https://api.jikan.moe/v4';

// DOM Elements
const views = {
    home: document.getElementById('home-view'),
    search: document.getElementById('search-view'),
    detail: document.getElementById('detail-view'),
    reader: document.getElementById('reader-view')
};

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const logoLink = document.getElementById('logo-link');
const btnBackDetail = document.getElementById('btn-back-detail');

// State
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    switchView('home');
    fetchManga('all');
    
    // Tab filtering
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.type;
            const title = tab.textContent === 'Semua' ? 'Terpopuler' : `Populer: ${tab.textContent}`;
            document.getElementById('home-section-title').textContent = title;
            switchView('home');
            fetchManga(currentFilter);
        });
    });
});

// Event Listeners
logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('home');
    fetchManga('all');
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        document.getElementById('search-query-display').textContent = `"${query}"`;
        switchView('search');
        fetchSearchManga(query);
    }
});

btnBackDetail.addEventListener('click', () => {
    switchView('detail');
});

// View Management
function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
    window.scrollTo(0, 0);
}

// Helpers
function getGridLoader() {
    return `<div class="loader-container" style="grid-column: 1 / -1;"><div class="spinner"></div><p>Memuat...</p></div>`;
}

// ---- Fetch Manga (Top/Filter) ----
async function fetchManga(type = 'all') {
    const container = document.getElementById('latest-manga-grid');
    container.innerHTML = getGridLoader();

    try {
        let url = `${JIKAN_API}/top/manga?filter=bypopularity&limit=24`;
        if (type !== 'all') {
            url = `${JIKAN_API}/manga?type=${type}&order_by=popularity&sort=asc&limit=24`;
        }
        
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        renderMangaGrid(data.data, container);
    } catch (error) {
        console.error('Error fetchManga:', error);
        container.innerHTML = `<p class="message-state" style="grid-column:1/-1">Gagal memuat data dari MyAnimeList.<br><small>${error.message}</small></p>`;
    }
}

// ---- Fetch Search ----
async function fetchSearchManga(query) {
    const container = document.getElementById('search-manga-grid');
    container.innerHTML = getGridLoader();

    try {
        const url = `${JIKAN_API}/manga?q=${encodeURIComponent(query)}&limit=24`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!data.data || data.data.length === 0) {
            container.innerHTML = `<p class="message-state" style="grid-column:1/-1">Tidak ada hasil untuk "${query}".</p>`;
            return;
        }
        renderMangaGrid(data.data, container);
    } catch (error) {
        console.error('Error search:', error);
        container.innerHTML = `<p class="message-state">Gagal melakukan pencarian.</p>`;
    }
}

// ---- Render Grid ----
function renderMangaGrid(mangas, container) {
    container.innerHTML = '';
    mangas.forEach(manga => {
        if (!manga) return;
        const title = manga.title || 'Unknown';
        const id = manga.mal_id;
        const cover = manga.images?.webp?.image_url || manga.images?.jpg?.image_url || 'https://placehold.co/256x384/161b22/3b82f6?text=No+Cover';
        const type = manga.type || 'Manga';

        const card = document.createElement('div');
        card.className = 'manga-card';
        card.onclick = () => showMangaDetails(id);
        
        card.innerHTML = `
            <img src="${cover}" alt="${title}" class="manga-cover" loading="lazy">
            <div class="manga-info">
                <div class="manga-title">${title}</div>
                <div class="manga-status">${type} • ⭐ ${manga.score || 'N/A'}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ---- Show Detail ----
async function showMangaDetails(id) {
    switchView('detail');
    const detailContent = document.getElementById('detail-content');
    const chapterListContainer = document.getElementById('chapter-list-container');
    const chapterList = document.getElementById('chapter-list');

    detailContent.innerHTML = `<div class="loader-container"><div class="spinner"></div><p>Memuat detail...</p></div>`;
    chapterListContainer.style.display = 'block';
    chapterList.innerHTML = `<div class="loader-container"><div class="spinner"></div></div>`;

    try {
        const res = await fetch(`${JIKAN_API}/manga/${id}/full`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { data } = await res.json();

        const title = data.title || 'Unknown';
        const desc = (data.synopsis || 'Tidak ada deskripsi.').replace(/\n/g, '<br>');
        const cover = data.images?.webp?.large_image_url || data.images?.jpg?.large_image_url || 'https://placehold.co/512x768/161b22/3b82f6?text=No+Cover';
        const authors = (data.authors || []).map(a => a.name).join(', ') || 'Unknown';
        const genres = (data.genres || []).map(g => `<span class="tag">${g.name}</span>`).join('');
        const status = data.status || 'Unknown';
        const type = data.type || 'Manga';

        detailContent.innerHTML = `
            <div class="detail-header">
                <img src="${cover}" alt="${title}" class="detail-cover"
                     onerror="this.src='https://placehold.co/512x768/161b22/3b82f6?text=No+Cover'">
                <div class="detail-info">
                    <h2 class="detail-title">${title}</h2>
                    <div class="detail-author"><i class="fas fa-pen-nib"></i> ${authors} &nbsp;|&nbsp; ${type} • ${status}</div>
                    <div class="detail-tags">${genres}</div>
                    <div class="detail-desc">${desc}</div>
                </div>
            </div>
        `;

        // Create Read Links (Substitution for Chapters)
        chapterList.innerHTML = `
            <div class="read-sources">
                <a href="https://myanimelist.net/manga/${id}" target="_blank" class="read-source-btn">
                    <i class="fas fa-external-link-alt"></i> Lihat di MyAnimeList
                </a>
                <a href="https://mangaplus.shueisha.co.jp/search/result?keyword=${encodeURIComponent(title)}" target="_blank" class="read-source-btn">
                    <i class="fas fa-book-open"></i> Cari di MangaPlus
                </a>
                <a href="https://www.google.com/search?q=baca+manga+${encodeURIComponent(title)}+bahasa+indonesia" target="_blank" class="read-source-btn" style="background:var(--primary); color:white; border-color:var(--primary)">
                    <i class="fas fa-search"></i> Baca di Google (Indo)
                </a>
            </div>
            <p style="margin-top:1.5rem; color:var(--text-muted); font-size:0.9rem; text-align:center;">
                <i class="fas fa-info-circle"></i> Jikan API tidak menyediakan gambar chapter langsung. Gunakan link di atas untuk membaca.
            </p>
        `;

    } catch (error) {
        console.error('Error detail:', error);
        detailContent.innerHTML = `<p class="message-state">Gagal memuat detail.<br><small>${error.message}</small></p>`;
    }
}
