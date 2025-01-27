document.getElementById("videoForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const videoUrl = document.getElementById("videoUrl").value;

  // Fetch metadata from the backend
  const response = await fetch("/get-metadata", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: videoUrl }),
  });

  const data = await response.json();
  if (data.success) {
    document.getElementById("thumbnail").src = data.thumbnail;
    document.getElementById("title").textContent = data.title;
    document.getElementById("fileSize").textContent = data.fileSize;
    document.getElementById("metadata").style.display = "block";
  } else {
    alert("Failed to fetch video metadata.");
  }
});

document.getElementById("downloadButton").addEventListener("click", () => {
  const videoUrl = document.getElementById("videoUrl").value;
  if (videoUrl) {
    window.location.href = `/download?url=${encodeURIComponent(videoUrl)}`;
  } else {
    alert("No video URL provided.");
  }
});
