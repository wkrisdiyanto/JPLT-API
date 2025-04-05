const axios = require('axios');
const cheerio = require('cheerio');

// URL untuk halaman berita
const NEWS_URL = 'https://jlptonline.or.id/news';

/**
 * Fungsi untuk mengekstrak informasi berita dari website JLPT Indonesia
 * @returns {Promise<Array>} Array berisi informasi berita
 */
async function getNews() {
  try {
    console.log('Mengambil data berita...');
    
    // Mengambil HTML dari halaman berita
    const response = await axios.get(NEWS_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const newsItems = [];
    
    // Mengekstrak item berita dari halaman daftar berita
    // Berdasarkan analisis struktur halaman, berita ditampilkan dalam card atau elemen dengan class tertentu
    $('.news-item, .card, article').each((index, element) => {
      // Mengekstrak tanggal
      const dateElement = $(element).find('.date, .news-date, time');
      const date = dateElement.length ? dateElement.text().trim() : '';
      
      // Mengekstrak judul
      const titleElement = $(element).find('.title, .news-title, h2, h3');
      const title = titleElement.length ? titleElement.text().trim() : '';
      
      // Mengekstrak URL detail berita
      const linkElement = $(element).find('a');
      const link = linkElement.length ? new URL(linkElement.attr('href'), NEWS_URL).href : '';
      
      // Mengekstrak gambar thumbnail jika ada
      const imageElement = $(element).find('img');
      const imageUrl = imageElement.length ? new URL(imageElement.attr('src'), NEWS_URL).href : '';
      
      // Mengekstrak ringkasan berita jika ada
      const summaryElement = $(element).find('.summary, .excerpt, .news-excerpt, p');
      const summary = summaryElement.length ? summaryElement.text().trim() : '';
      
      if (title) {
        newsItems.push({
          date,
          title,
          link,
          imageUrl,
          summary
        });
      }
    });
    
    // Jika tidak bisa menemukan dengan class spesifik, coba dengan selector yang lebih umum
    if (newsItems.length === 0) {
      // Mencari elemen berita berdasarkan struktur DOM
      $('a:contains("Pengumuman"), a:contains("Pendaftaran"), a:contains("Hasil Ujian"), a:contains("Sertifikat"), a:contains("Lokasi"), a:contains("Jadwal")').each((index, element) => {
        const text = $(element).text().trim();
        
        // Mencoba mengekstrak tanggal dan judul dari teks
        const dateMatch = text.match(/(\w+, \d+ \w+ \d{4})/);
        const date = dateMatch ? dateMatch[1] : '';
        
        // Judul adalah teks setelah tanggal
        let title = '';
        if (date) {
          title = text.replace(date, '').trim();
        } else {
          title = text;
        }
        
        // URL detail berita
        const link = new URL($(element).attr('href') || '', NEWS_URL).href;
        
        if (title) {
          newsItems.push({
            date,
            title,
            link,
            imageUrl: '',
            summary: ''
          });
        }
      });
    }
    
    console.log(`Berhasil mengambil ${newsItems.length} item berita`);
    return newsItems;
  } catch (error) {
    console.error('Error saat mengambil data berita:', error.message);
    return [];
  }
}

module.exports = { getNews };
