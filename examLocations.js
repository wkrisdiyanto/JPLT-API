const axios = require('axios');
const cheerio = require('cheerio');

// URL untuk halaman lokasi ujian
const LOCATION_URL = 'https://jlptonline.or.id/location';

/**
 * Fungsi untuk mengekstrak informasi lokasi ujian dari website JLPT Indonesia
 * @returns {Promise<Array>} Array berisi informasi lokasi ujian
 */
async function getExamLocations() {
  try {
    console.log('Mengambil data lokasi ujian...');
    
    // Mengambil HTML dari halaman lokasi ujian
    const response = await axios.get(LOCATION_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const locations = [];
    
    // Mencari semua elemen lokasi ujian
    // Berdasarkan analisis struktur halaman, lokasi ujian berada dalam elemen dengan class tertentu
    // yang berisi nama kota dan informasi pendaftaran
    $('.location-item').each((index, element) => {
      // Mengekstrak nama kota (biasanya dalam heading atau elemen dengan class tertentu)
      const cityName = $(element).find('.location-name').text().trim();
      
      // Mengekstrak informasi pendaftaran
      const registrationInfo = [];
      $(element).find('.registration-info').each((i, regElement) => {
        registrationInfo.push($(regElement).text().trim());
      });
      
      // Jika tidak bisa menemukan dengan class spesifik, coba dengan selector yang lebih umum
      if (!cityName) {
        // Alternatif: cari berdasarkan struktur DOM
        const locationElement = $(element).find('h2, h3, h4, strong').first();
        if (locationElement.length) {
          const cityNameAlt = locationElement.text().trim();
          if (cityNameAlt) {
            locations.push({
              city: cityNameAlt,
              registrationInfo: $(element).text().replace(cityNameAlt, '').trim().split('\n').map(line => line.trim()).filter(line => line)
            });
          }
        }
      } else {
        locations.push({
          city: cityName,
          registrationInfo
        });
      }
    });
    
    // Jika tidak ada hasil dengan pendekatan di atas, gunakan pendekatan alternatif
    // berdasarkan struktur DOM yang terlihat di halaman
    if (locations.length === 0) {
      // Mencari elemen yang berisi ikon lokasi dan nama kota
      $('div:contains("Jakarta"), div:contains("Bandung"), div:contains("Surabaya"), div:contains("Medan"), div:contains("Yogyakarta"), div:contains("Padang"), div:contains("Denpasar"), div:contains("Manado")').each((index, element) => {
        const text = $(element).text().trim();
        
        // Ekstrak nama kota dan informasi pendaftaran
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length > 0) {
          // Cek apakah baris pertama berisi nama kota
          const cityRegex = /(Jakarta|Bandung|Surabaya|Medan|Yogyakarta|Padang|Denpasar|Manado)/;
          const cityMatch = lines[0].match(cityRegex);
          
          if (cityMatch) {
            const city = cityMatch[0];
            const registrationInfo = lines.slice(1);
            
            locations.push({
              city,
              registrationInfo
            });
          }
        }
      });
    }
    
    console.log(`Berhasil mengambil ${locations.length} lokasi ujian`);
    return locations;
  } catch (error) {
    console.error('Error saat mengambil data lokasi ujian:', error.message);
    return [];
  }
}

module.exports = { getExamLocations };
