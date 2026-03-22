# RemanPedia 📚

RemanPedia adalah proyek sederhana untuk eksplorasi dan pembelajaran integrasi API (Application Programming Interface), khususnya dalam mengelola database Manga, Manhwa, dan Manhua secara real-time.

Proyek ini dibangun menggunakan **Jikan API (v4)** yang merupakan REST API Open Source untuk MyAnimeList.

## 🌐 Live Demo
Buka website secara online di: [**erman4u.github.io/RemanPedia**](https://erman4u.github.io/RemanPedia/)

## 🚀 Fitur Utama
- **Real-time Data:** Mengambil informasi komik terpopuler secara langsung dari database MyAnimeList.
- **Pencarian Cepat:** Mencari ribuan judul komik dengan performa instan.
- **Modern UI:** Desain antarmuka *premium* dengan Dark Mode, Glassmorphism, dan animasi yang responsif.
- **Navigasi Tab:** Memudahkan penyaringan antara Manga (Jepang), Manhwa (Korea), dan Manhua (Cina).
- **Multi-Source Reader Links:** Karena pembatasan ISP terhadap konten gambar, proyek ini menyediakan jalur akses ke MangaPlus, MyAnimeList, dan pencarian Google sebagai alternatif baca.

## 🛠️ Teknologi yang Digunakan
- **HTML5 & CSS3:** Struktur dan styling (Vanilla CSS).
- **JavaScript (ES6):** Logika frontend dan pengambilan data (Fetch API).
- **Jikan API:** Sebagai sumber data utama.

## 📖 Cara Menjalankan Secara Lokal
Proyek ini tidak memerlukan instalasi apapun. Cukup jalankan server statis sederhana untuk menghindari masalah `cors-policy` pada beberapa browser:

1. Clone repositori ini atau download filenya.
2. Buka terminal di dalam folder proyek.
3. Jalankan perintah Python:
   ```bash
   python -m http.server 8080
   ```
4. Buka browser dan akses `http://localhost:8080`.

## 💡 Catatan Pembelajaran
Proyek ini mengajarkan beberapa poin penting dalam pengembangan web:
1. **API Integration:** Cara menggunakan `fetch` untuk mengambil data dari server pihak ketiga.
2. **Asynchronous JS:** Menggunakan `async/await` untuk menangani data yang datang dari internet.
3. **DOM Manipulation:** Mengubah tampilan website secara dinamis berdasarkan data yang diterima.
4. **Handling ISP Blocking:** Memahami batasan teknis (seperti SSL Handshake failure/blokir DNS) dan mencari solusi alternatif yang stabil.

---
*Dibuat untuk tujuan belajar dan koleksi pribadi.*
