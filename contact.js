const axios = require('axios');
const cheerio = require('cheerio');

// URL untuk halaman kontak
const CONTACT_URL = 'https://jlptonline.or.id/contact';

/**
 * Fungsi untuk mengekstrak informasi kontak dari website JLPT Indonesia
 * @returns {Promise<Object>} Object berisi informasi kontak
 */
async function getContactInfo() {
  try {
    console.log('Mengambil data kontak...');
    
    // Mengambil HTML dari halaman kontak
    const response = await axios.get(CONTACT_URL);
    const html = response.data;
    const $ = cheerio.load(html);
    
    const contactInfo = {
      organization: 'The Japan Foundation Jakarta',
      address: '',
      email: '',
      phone: '',
      socialMedia: []
    };
    
    // Mengekstrak alamat
    const addressElements = $('div:contains("The Japan Foundation Jakarta")').find('p, div');
    if (addressElements.length) {
      contactInfo.address = addressElements.text().trim();
    } else {
      // Alternatif: cari teks alamat berdasarkan pola
      $('p, div').each((index, element) => {
        const text = $(element).text().trim();
        if (text.includes('Summitmas') || text.includes('Jl.') || text.includes('Jakarta')) {
          contactInfo.address += text + ' ';
        }
      });
      contactInfo.address = contactInfo.address.trim();
    }
    
    // Jika alamat masih kosong, coba ekstrak dari footer
    if (!contactInfo.address) {
      const footerText = $('footer').text().trim();
      const addressMatch = footerText.match(/Summitmas.+?12190/);
      if (addressMatch) {
        contactInfo.address = addressMatch[0].trim();
      }
    }
    
    // Mengekstrak email
    const emailElement = $('a[href^="mailto:"], a:contains("@jpf.go.jp")');
    if (emailElement.length) {
      contactInfo.email = emailElement.text().trim() || emailElement.attr('href').replace('mailto:', '');
    }
    
    // Jika email masih kosong, coba cari dengan regex
    if (!contactInfo.email) {
      const pageText = $('body').text();
      const emailMatch = pageText.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) {
        contactInfo.email = emailMatch[0];
      }
    }
    
    // Mengekstrak media sosial
    $('.social-media a, .social a').each((index, element) => {
      const href = $(element).attr('href');
      if (href) {
        contactInfo.socialMedia.push(href);
      }
    });
    
    // Mengekstrak informasi tambahan
    const additionalInfo = [];
    $('div:contains("Kontak Panitia"), div:contains("Hubungi Kami"), div:contains("FAQ")').each((index, element) => {
      additionalInfo.push($(element).text().trim());
    });
    
    if (additionalInfo.length) {
      contactInfo.additionalInfo = additionalInfo;
    }
    
    console.log('Berhasil mengambil data kontak');
    return contactInfo;
  } catch (error) {
    console.error('Error saat mengambil data kontak:', error.message);
    return {
      organization: 'The Japan Foundation Jakarta',
      address: 'Summitmas II, 1-2 Floor, Jl. Jend. Sudirman Kav. 61-62, Jakarta Selatan, 12190',
      email: 'jlpt.indonesia@jpf.go.jp',
      phone: '',
      socialMedia: []
    };
  }
}

module.exports = { getContactInfo };
