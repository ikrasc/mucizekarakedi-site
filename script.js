async function fetchVideos() {
  const res = await fetch('https://mucizekarakedi.com/worker'); // Worker route
  const data = await res.json();

  const container = document.getElementById('video-container');
  container.innerHTML = '';

  data.forEach(video => {
    const el = document.createElement('div');
    el.className = 'video-item';
    el.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
        <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
      </a>
      <h3>${video.snippet.title}</h3>
    `;
    container.appendChild(el);
  });
}

window.addEventListener('DOMContentLoaded', fetchVideos);
