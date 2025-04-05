# JLPT Indonesia Scraper API

REST API untuk mengakses data dari website [JLPT Indonesia](https://jlptonline.or.id).

## Deskripsi

API ini menyediakan akses ke informasi yang di-scrape dari website JLPT Indonesia melalui endpoint REST, termasuk:
- Lokasi Ujian
- Tanya Jawab (FAQ)
- Berita
- Informasi Kontak

## Persyaratan

- Node.js (versi 12 atau lebih baru)
- npm (Node Package Manager)

## Instalasi

1. Clone atau download repository ini
2. Buka terminal dan navigasi ke direktori proyek
3. Jalankan perintah berikut untuk menginstal dependensi:

```bash
npm install
```

## Menjalankan API

Untuk menjalankan API server, gunakan perintah berikut:

```bash
npm start
```

Server akan berjalan di port 3000 secara default (http://localhost:3000).

Anda juga dapat mengatur port melalui variabel lingkungan:

```bash
PORT=8080 npm start
```

## Endpoint API

### Root Endpoint

```
GET /
```

Menampilkan informasi selamat datang dan daftar endpoint yang tersedia.

**Contoh Response:**
```json
{
  "message": "Selamat datang di JLPT Indonesia Scraper API",
  "endpoints": [
    { "path": "/api/locations", "description": "Mendapatkan informasi lokasi ujian" },
    { "path": "/api/faq", "description": "Mendapatkan informasi tanya jawab (FAQ)" },
    { "path": "/api/news", "description": "Mendapatkan informasi berita" },
    { "path": "/api/contact", "description": "Mendapatkan informasi kontak" },
    { "path": "/api/all", "description": "Mendapatkan semua informasi" }
  ]
}
```

### Lokasi Ujian

```
GET /api/locations
```

Menampilkan informasi lokasi ujian JLPT di Indonesia.

**Contoh Response:**
```json
{
  "success": true,
  "data": [
    {
      "city": "Jakarta",
      "registrationInfo": ["Pendaftaran Juli 2025 - Selesai", "Pendaftaran Desember 2025 - TBA"]
    },
    {
      "city": "Bandung",
      "registrationInfo": ["Pendaftaran Juli 2025 - Selesai", "Pendaftaran Desember 2025 - TBA"]
    }
  ]
}
```

### Tanya Jawab (FAQ)

```
GET /api/faq
```

Menampilkan informasi tanya jawab (FAQ) dari website JLPT Indonesia.

**Contoh Response:**
```json
{
  "success": true,
  "data": {
    "categories": ["Perihal Pendaftaran", "Terkait Pembayaran", "Perihal Ujian"],
    "items": [
      {
        "question": "Apakah saya bisa registrasi (mendaftar) secara langsung?",
        "answer": "Tidak bisa. Pendaftaran hanya melalui online di website https://jlptonline.or.id"
      }
    ]
  }
}
```

### Berita

```
GET /api/news
```

Menampilkan informasi berita terbaru dari website JLPT Indonesia.

**Contoh Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "Selasa, 11 Maret 2025",
      "title": "Pengumuman Metode Pembayaran Ujian JLPT 2025 (Juli)",
      "link": "https://jlptonline.or.id/news/pengumuman-metode-pembayaran-ujian-jlpt-2025-juli",
      "imageUrl": "",
      "summary": ""
    }
  ]
}
```

### Kontak

```
GET /api/contact
```

Menampilkan informasi kontak dari website JLPT Indonesia.

**Contoh Response:**
```json
{
  "success": true,
  "data": {
    "organization": "The Japan Foundation Jakarta",
    "address": "Summitmas II, 1-2 Floor, Jl. Jend. Sudirman Kav. 61-62, Jakarta Selatan, 12190",
    "email": "jlpt.indonesia@jpf.go.jp",
    "phone": "",
    "socialMedia": []
  }
}
```

### Semua Informasi

```
GET /api/all
```

Menampilkan semua informasi yang tersedia dari website JLPT Indonesia dalam satu response.

**Contoh Response:**
```json
{
  "success": true,
  "data": {
    "locations": [...],
    "faq": {...},
    "news": [...],
    "contact": {...},
    "timestamp": "2025-04-04T22:40:00.000Z"
  }
}
```

## Penanganan Error

API ini mengembalikan kode status HTTP yang sesuai dan pesan error dalam format JSON:

- 404 Not Found: Endpoint tidak ditemukan
```json
{
  "success": false,
  "error": "Endpoint tidak ditemukan"
}
```

- 500 Internal Server Error: Terjadi kesalahan pada server
```json
{
  "success": false,
  "error": "Terjadi kesalahan pada server"
}
```

## Menggunakan API dengan JavaScript

Contoh penggunaan API dengan JavaScript:

```javascript
// Mengambil data lokasi ujian
fetch('http://localhost:3000/api/locations')
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Lokasi Ujian:', data.data);
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => console.error('Fetch error:', error));
```

## Menggunakan API dengan Python

Contoh penggunaan API dengan Python:

```python
import requests

# Mengambil data berita
response = requests.get('http://localhost:3000/api/news')
data = response.json()

if data['success']:
    print('Berita:')
    for news in data['data']:
        print(f"- {news['date']} - {news['title']}")
else:
    print('Error:', data['error'])
```

## Catatan

- API ini dibuat untuk tujuan pendidikan dan informasi
- Harap gunakan dengan bijak dan hormati kebijakan website yang di-scrape
- Struktur website dapat berubah sewaktu-waktu, yang mungkin memerlukan penyesuaian pada kode scraper
