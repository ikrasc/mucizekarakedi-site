const API_KEY = "AIzaSyDF0m00tIPqW5hVkKLOJeOBe96oSbc_SuQ";
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw";
const VIDEOS_PER_PAGE = 10;

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const startIndex = (page - 1) * VIDEOS_PER_PAGE + 1;

  // Fetch videos from YouTube API
  const apiURL = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${VIDEOS_PER_PAGE}&pageToken=${url.searchParams.get("pageToken") || ""}`;
  
  const res = await fetch(apiURL);
  const data = await res.json();

  // Filter out shorts and only horizontal videos
  const videos = (data.items || []).filter(item => {
    const title = item.snippet.title.toLowerCase();
    return !title.includes("shorts");
  });

  // Pagination token
  const nextPageToken = data.nextPageToken || null;
  const prevPageToken = data.prevPageToken || null;

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>Mucize Karakedi - Videolar</title>
      <link href="https://fonts.googleapis.com/css2?family=Gilroy:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin:0;
          font-family: 'Gilroy', sans-serif;
          background-color:#1e1e1e;
          color:#fff;
        }
        header {
          display:flex;
          align-items:center;
          padding:10px 20px;
        }
        header img {
          height:50px;
          margin-right:20px;
        }
        header h1 {
          font-size:24px;
          color:#fff;
          margin:0;
        }
        .grid {
          display:grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap:15px;
          padding:20px;
        }
        .video-card {
          background:#2e2e2e;
          padding:10px;
          border-radius:8px;
          transition: transform 0.2s;
        }
        .video-card:hover {
          transform: scale(1.03);
        }
        .video-card a {
          text-decoration:none;
          color:#a64ca6; /* mor ton */
        }
        .pagination {
          display:flex;
          justify-content:center;
          gap:10px;
          padding:20px;
        }
        .pagination a {
          padding:8px 12px;
          background:#4b0082;
          border-radius:5px;
          color:#fff;
          text-decoration:none;
        }
        .pagination a.disabled {
          background:#555;
          pointer-events:none;
        }
      </style>
    </head>
    <body>
      <header>
        <img src="https://raw.githubusercontent.com/ikrasc/mucize-karakedi-assets/main/logo.png" alt="Logo">
        <h1>En Güncel Videolar</h1>
      </header>

      <div class="grid">
        ${videos.map(v => `
          <div class="video-card">
            <a href="https://www.youtube.com/watch?v=${v.id.videoId}" target="_blank">
              <img src="${v.snippet.thumbnails.medium.url}" style="width:100%; border-radius:6px;">
              <p>${v.snippet.title}</p>
            </a>
          </div>
        `).join('')}
      </div>

      <div class="pagination">
        ${prevPageToken ? `<a href="?pageToken=${prevPageToken}&page=${page-1}">Önceki</a>` : `<a class="disabled">Önceki</a>`}
        <span style="align-self:center; color:#fff;">${page}</span>
        ${nextPageToken ? `<a href="?pageToken=${nextPageToken}&page=${page+1}">Sonraki</a>` : `<a class="disabled">Sonraki</a>`}
      </div>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" }
  });
}
