const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public")); // Serve static files from the "public" folder

// Endpoint to fetch video metadata
app.post("/get-metadata", async (req, res) => {
  const { url } = req.body;

  try {
    // Fetch video metadata (e.g., file size, thumbnail, title)
    const response = await axios.head(url); // Use HEAD request to get headers only
    const contentLength = response.headers["content-length"];
    const contentType = response.headers["content-type"];

    // Example metadata (you can enhance this to fetch title and thumbnail)
    const metadata = {
      success: true,
      title: "Video Title", // Replace with actual title extraction logic
      thumbnail: "https://example.com/thumbnail.jpg", // Replace with actual thumbnail URL
      fileSize: `${(contentLength / (1024 * 1024)).toFixed(2)} MB`,
    };

    res.json(metadata);
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Failed to fetch metadata" });
  }
});

// Endpoint to download the video
app.get("/download", async (req, res) => {
  const { url } = req.query;

  try {
    const response = await axios.get(url, { responseType: "stream" });
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    response.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to download video.");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
