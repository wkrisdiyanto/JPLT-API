const axios = require('axios');
const cheerio = require('cheerio');

// URL untuk halaman FAQ
const FAQ_URL = 'https://jlptonline.or.id/faq';

/**
 * Fungsi untuk mengekstrak informasi tanya jawab (FAQ) dari website JLPT Indonesia
 * @returns {Promise<Array>} Array berisi informasi tanya jawab
 */
async function getFAQs() {
  try {
    console.log('Mengambil data tanya jawab...');
    
    // Mengambil HTML dari halaman FAQ
    const response = await axios.get(FAQ_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const faqCategories = [];
    const faqItems = [];
    
    // Mengekstrak kategori FAQ
    // Berdasarkan analisis struktur halaman, kategori FAQ berada di sebelah kiri
    $('button.category-button, button.accordion-button').each((index, element) => {
      const categoryName = $(element).text().trim();
      if (categoryName) {
        faqCategories.push(categoryName);
      }
    });
    
    // Jika tidak bisa menemukan dengan class spesifik, coba dengan selector yang lebih umum
    if (faqCategories.length === 0) {
      // Mencari elemen kategori berdasarkan struktur DOM dan konten
      $('button:contains("Perihal Pendaftaran"), button:contains("Terkait Pembayaran"), button:contains("Perihal Ujian"), button:contains("Level"), button:contains("Sesi"), button:contains("Persiapan Ujian"), button:contains("Nilai")').each((index, element) => {
        const categoryName = $(element).text().trim();
        if (categoryName) {
          faqCategories.push(categoryName);
        }
      });
    }
    
    // Mengekstrak pertanyaan dan jawaban FAQ
    // Berdasarkan analisis struktur halaman, pertanyaan dan jawaban berada di sebelah kanan
    $('.faq-item, .accordion-item').each((index, element) => {
      const question = $(element).find('.question, .accordion-header').text().trim();
      const answer = $(element).find('.answer, .accordion-body').text().trim();
      
      if (question && answer) {
        faqItems.push({
          question,
          answer
        });
      }
    });
    
    // Jika tidak bisa menemukan dengan class spesifik, coba dengan selector yang lebih umum
    if (faqItems.length === 0) {
      // Mencari elemen pertanyaan berdasarkan struktur DOM
      $('button:contains("Apakah saya bisa registrasi"), button:contains("Apa yang harus saya lakukan"), button:contains("Bagaimana cara")').each((index, element) => {
        const question = $(element).text().trim();
        
        // Mencari jawaban yang terkait dengan pertanyaan
        // Biasanya jawaban berada di elemen setelah pertanyaan atau di dalam elemen yang sama
        let answer = '';
        const nextElement = $(element).next();
        if (nextElement.length) {
          answer = nextElement.text().trim();
        }
        
        // Jika tidak menemukan jawaban di elemen berikutnya, coba cari di dalam elemen yang sama
        if (!answer) {
          const parentElement = $(element).parent();
          if (parentElement.length) {
            const answerElement = parentElement.find('div').not($(element));
            if (answerElement.length) {
              answer = answerElement.text().trim();
            }
          }
        }
        
        if (question && answer) {
          faqItems.push({
            question,
            answer
          });
        } else if (question) {
          // Jika tidak menemukan jawaban, tambahkan pertanyaan saja
          faqItems.push({
            question,
            answer: 'Jawaban tidak tersedia'
          });
        }
      });
    }
    
    // Mengelompokkan FAQ berdasarkan kategori jika memungkinkan
    const result = {
      categories: faqCategories,
      items: faqItems
    };
    
    console.log(`Berhasil mengambil ${faqItems.length} item FAQ dalam ${faqCategories.length} kategori`);
    return result;
  } catch (error) {
    console.error('Error saat mengambil data tanya jawab:', error.message);
    return { categories: [], items: [] };
  }
}

module.exports = { getFAQs };
