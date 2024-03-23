const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const { url } = req.body;
    
    try {
        const regexPattern = /\/song\/([a-z0-9\-]+)(\/)?$/;
        const match = url.match(regexPattern);

        if (!match) {
            res.status(400).send('无效的URL格式。');
            return;
        }

        const audioId = match[1];
        const audioUrl = `https://cdn1.suno.ai/${audioId}.mp3`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const body = await response.text();
        const $ = cheerio.load(body);

        const image = $('img[alt="Song Image"]').attr('src');
        const title = $('h2').first().text();
        const style = $('p').first().text();

        res.json({ audio: audioUrl, image: image, title: title, style: style });
    } catch (error) {
        console.error(error);
        res.status(500).send('服务器错误');
    }
};
