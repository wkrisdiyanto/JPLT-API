const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { getExamLocations } = require('./examLocations');
const { getFAQs } = require('./faq');
const { getNews } = require('./news');
const { getContactInfo } = require('./contact');

// Inisialisasi Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di JLPT Indonesia Scraper API',
    endpoints: [
      { path: '/api/locations', description: 'Mendapatkan informasi lokasi ujian' },
      { path: '/api/faq', description: 'Mendapatkan informasi tanya jawab (FAQ)' },
      { path: '/api/news', description: 'Mendapatkan informasi berita' },
      { path: '/api/contact', description: 'Mendapatkan informasi kontak' },
      { path: '/api/all', description: 'Mendapatkan semua informasi' }
    ]
  });
});

// API Endpoints
app.get('/api/locations', async (req, res) => {
  try {
    const locations = await getExamLocations();
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/faq', async (req, res) => {
  try {
    const faq = await getFAQs();
    res.json({ success: true, data: faq });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const news = await getNews();
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const contact = await getContactInfo();
    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/all', async (req, res) => {
  try {
    const [locations, faq, news, contact] = await Promise.all([
      getExamLocations(),
      getFAQs(),
      getNews(),
      getContactInfo()
    ]);
    
    res.json({
      success: true,
      data: {
        locations,
        faq,
        news,
        contact,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint tidak ditemukan'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Terjadi kesalahan pada server'
  });
});

// Mulai server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
