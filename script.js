// API Key direkt eklendi (geçici test + site çalışması için)
const API_KEY = "AIzaSyACi0bE7w5vWXnwnEGocmpD6ao9dE-Y584";
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw";
const MAX_RESULTS = 50;

async function fetchVideos() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;
  const res = await fetch(url);
  const data = await res.json();

  // Sadece yatay videolar
  const videos = data.items.filter(video => {
    const thumbnails = video.snippet.thumbnails;
    if(!thumbnails) return false;
    const width = thumbnails.medium.width;
    const height = thumbnails.medium.height;
    return width >= height; // yatay olanlar
  });

  displayVideos(videos);
}

function displayVideos(videos) {
  const container = document.getElementById("video-container");
  container.innerHTML = "";
  videos.forEach(video => {
    const el = document.createElement("div");
    el.className = "video-item";
    el.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
      </a>
      <h3>${video.snippet.title}</h3>
    `;
    container.appendChild(el);
  });
}

// Sayfa yüklenince çalıştır
window.addEventListener("DOMContentLoaded", fetchVideos);
