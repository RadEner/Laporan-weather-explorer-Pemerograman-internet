Weather Explorer

Aplikasi pencarian cuaca live berbasis React + Vite, dibuat untuk memenuhi tugas praktikum Hands-On Class Challenge: Live Weather / Country Explorer — Pertemuan 4: Side Effects & Fetching REST API.

Identitas
Nama: I Gusti Agung Aditya Laksana
NIM: 2505551145
Mata Kuliah: Pemrograman Internet
Program Studi: Teknologi Informasi, Universitas Udayana
Deskripsi

Aplikasi ini memungkinkan pengguna mencari cuaca kota mana pun secara real-time. Data diambil dari Open-Meteo API (geocoding + forecast), tanpa memerlukan API key.

Fitur
Pencarian live — ketik nama kota dan cuaca langsung diambil dari API
Debounced fetching — request API baru dikirim 600ms setelah user berhenti mengetik, menghindari spam request
useEffect hooks — satu untuk debounce input, satu lagi untuk memicu fetch data setiap query berubah
3 state wajib:
Loading — spinner saat data sedang dimuat
Error — alert saat kota tidak ditemukan atau API gagal
Data Card — kartu cuaca berisi suhu, "terasa seperti", kelembapan, dan kecepatan angin
Abort controller — membatalkan request lama secara otomatis jika user mengetik ulang sebelum request selesai
Teknologi
React 19
Vite
Open-Meteo API (Geocoding & Forecast, gratis tanpa API key)
Cara Menjalankan
bash

# cara penggunaan 
cd weather-explorer # masuk directory nya terlebih dahulu

# Install dependencies
npm install

# Jalankan development server
npm run dev

Buka http://localhost:5173 di browser.

Cara Build
bash
npm run build

Hasil build akan berada di folder dist/.

Struktur Proyek
weather-explorer/
├── src/
│   ├── App.jsx       # Komponen utama: search, fetch, dan 3 state
│   ├── App.css        # Styling komponen
│   ├── index.css      # Styling global
│   └── main.jsx        # Entry point React
├── index.html
├── package.json
└── vite.config.js