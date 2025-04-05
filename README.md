# JLPT Indonesia Website Scraper

Scraper Node.js untuk mengekstrak informasi dari website [JLPT Indonesia](https://jlptonline.or.id).

## Deskripsi

Scraper ini dapat mengekstrak informasi berikut dari website JLPT Indonesia:
- Lokasi Ujian
- Tanya Jawab (FAQ)
- Berita
- Informasi Kontak

Data yang diekstrak akan disimpan dalam format JSON.

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

## Penggunaan

Untuk menjalankan scraper, gunakan perintah berikut:

```bash
node index.js
```

Scraper akan mengekstrak data dari semua bagian website dan menyimpannya ke file `jlpt-data.json` di direktori yang sama.

## Struktur Proyek

- `index.js` - File utama untuk menjalankan scraper
- `examLocations.js` - Modul untuk mengekstrak informasi lokasi ujian
- `faq.js` - Modul untuk mengekstrak informasi tanya jawab (FAQ)
- `news.js` - Modul untuk mengekstrak informasi berita
- `contact.js` - Modul untuk mengekstrak informasi kontak
- `package.json` - Konfigurasi proyek dan dependensi

## Hasil Ekstraksi

Hasil ekstraksi disimpan dalam format JSON dengan struktur berikut:

```json
{
  "lokasiUjian": [
    {
      "city": "Nama Kota",
      "registrationInfo": ["Informasi Pendaftaran"]
    }
  ],
  "tanyaJawab": {
    "categories": ["Kategori FAQ"],
    "items": [
      {
        "question": "Pertanyaan",
        "answer": "Jawaban"
      }
    ]
  },
  "berita": [
    {
      "date": "Tanggal Berita",
      "title": "Judul Berita",
      "link": "URL Berita",
      "imageUrl": "URL Gambar",
      "summary": "Ringkasan Berita"
    }
  ],
  "kontak": {
    "organization": "Nama Organisasi",
    "address": "Alamat",
    "email": "Email",
    "phone": "Nomor Telepon",
    "socialMedia": ["URL Media Sosial"]
  },
  "timestamp": "Waktu Ekstraksi"
}
```

## Kustomisasi

Anda dapat memodifikasi file-file modul untuk menyesuaikan cara ekstraksi data sesuai kebutuhan Anda. Setiap modul memiliki fungsi utama yang dapat diimpor dan digunakan secara terpisah.

## Dependensi

- [axios](https://github.com/axios/axios) - Untuk melakukan HTTP request
- [cheerio](https://github.com/cheeriojs/cheerio) - Untuk parsing dan manipulasi HTML

## Catatan

- Scraper ini dibuat untuk tujuan pendidikan dan informasi
- Harap gunakan dengan bijak dan hormati kebijakan website yang di-scrape
- Struktur website dapat berubah sewaktu-waktu, yang mungkin memerlukan penyesuaian pada kode scraper
