const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const { url } = req.body;
    try {
        // 正则表达式，用以匹配URL中的歌曲ID
        const regexPattern = /\/song\/([a-z0-9\-]+)(\/)?$/;
        const match = url.match(regexPattern);

        if (!match) {
            res.status(400).json({message: '无效的URL格式。'});
            return;
        }

        const audioId = match[1]; // 歌曲ID是正则表达式的第一个捕获组
        const audioUrl = `https://cdn1.suno.ai/${audioId}.mp3`;

        // 发起对提供的URL的请求
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // 获取返回的HTML并加载到cheerio中
        const body = await response.text();
        const $ = cheerio.load(body);

        // 解析HTML以获取所需信息
        const image = $('img[alt="Song Image"]').attr('src');
        const title = $('h2').first().text(); // 假设标题是第一个h2标签
        const style = $('p').first().text(); // 假设风格是页面上第一个p标签的内容

        res.json({ audio: audioUrl, image: image, title: title, style: style });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: '服务器错误'});
    }
};