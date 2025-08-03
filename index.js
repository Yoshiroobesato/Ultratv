const express = require('express');
const puppeteer = require('puppeteer');
const app = express();

app.get('/m3u8', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL faltante' });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    let foundUrl = null;

    page.on('request', request => {
      const reqUrl = request.url();
      if (reqUrl.includes('.m3u8') && !foundUrl) {
        foundUrl = reqUrl;
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(7000);

    if (foundUrl) {
      res.json({ m3u8: foundUrl });
    } else {
      res.status(404).json({ error: 'No se encontró archivo M3U8' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error interno', details: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.get('/', (req, res) => {
  res.send('API de extracción de M3U8 funcionando.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));