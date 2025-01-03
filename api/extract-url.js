const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const targetURL = "https://streamtp2.com/global1.php?stream=espn1"; // Reemplaza con la URL que deseas scrapear

  try {
    // Obtiene el contenido HTML de la página
    const response = await axios.get(targetURL);
    const html = response.data;

    // Usa Cheerio para analizar el HTML
    const $ = cheerio.load(html);
    const scriptContent = $("script").text();

    // Extrae la variable playbackURL con una expresión regular
    const playbackURLMatch = scriptContent.match(/var playbackURL\s*=\s*"([^"]+)"/);
    if (playbackURLMatch) {
      const playbackURL = playbackURLMatch[1];
      return res.json({ playbackURL });
    } else {
      return res.status(404).json({ error: "playbackURL not found" });
    }
  } catch (error) {
    console.error("Error fetching or parsing the page:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
