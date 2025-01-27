const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());
const port = 3000;

app.post('/fetch-video-details', async (req, res) => {
    const videoUrl = req.body.url;

    try {
        const response = await fetch(videoUrl, { method: 'GET' });
        const contentType = response.headers.get('Content-Type');
        const contentLength = response.headers.get('Content-Length');
        const fileSizeInMB = (contentLength / (1024 * 1024)).toFixed(2);
        const videoBlob = await response.blob();
        const videoBase64 = await videoBlobToBase64(videoBlob);
        const videoSrc = `data:${contentType};base64,${videoBase64}`;

        // Extract metadata (title and thumbnail can be customized or derived from the video URL)
        const metadata = {
            videoUrl: videoSrc,
            title: 'Telegram Video',
            fileSize: fileSizeInMB,
            thumbnailUrl: 'https://via.placeholder.com/150' // Placeholder thumbnail
        };

        res.json(metadata);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the video' });
    }
});

function videoBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
