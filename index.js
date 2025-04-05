const { getExamLocations } = require('./examLocations');
const { getFAQs } = require('./faq');
const { getNews } = require('./news');
const { getContactInfo } = require('./contact');
const fs = require('fs');

// Fungsi utama untuk menjalankan scraper
async function main() {
  try {
    console.log('Memulai scraping website JLPT Indonesia...');
    
    // Mengambil data dari semua bagian
    console.log('\n=== Mengambil data lokasi ujian ===');
    const lokasiUjian = await getExamLocations();
    
    console.log('\n=== Mengambil data tanya jawab ===');
    const tanyaJawab = await getFAQs();
    
    console.log('\n=== Mengambil data berita ===');
    const berita = await getNews();
    
    console.log('\n=== Mengambil data kontak ===');
    const kontak = await getContactInfo();
    
    // Menyimpan hasil scraping ke file JSON
    const result = {
      lokasiUjian,
      tanyaJawab,
      berita,
      kontak,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('jlpt-data.json', JSON.stringify(result, null, 2));
    console.log('\nScraping selesai! Data tersimpan di jlpt-data.json');
    
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
  }
}

// Jalankan fungsi utama jika file ini dijalankan langsung
if (require.main === module) {
  main();
}

// Export fungsi untuk penggunaan di file lain
module.exports = { main };
