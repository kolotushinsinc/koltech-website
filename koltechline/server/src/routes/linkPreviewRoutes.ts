import express from 'express';
import linkPreviewService from '../services/LinkPreviewService';

const router = express.Router();

// Получить метаданные ссылки
router.post('/preview', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const metadata = await linkPreviewService.fetchMetadata(url);
    res.json({ metadata });
  } catch (error: any) {
    console.error('Link preview error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Извлечь все ссылки из текста
router.post('/extract', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const urls = linkPreviewService.extractUrls(text);
    res.json({ urls });
  } catch (error: any) {
    console.error('URL extraction error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
