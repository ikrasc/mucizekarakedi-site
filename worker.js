const API_KEY = "AIzaSyDF0m00tIPqW5hVkKLOJeOBe96oSbc_SuQ"; // Senin API key
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw"; // Senin kanal ID

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.items) {
      return new Response("Videolar alınamadı.", { status: 500 });
    }

    let videosHtml = data.items
      .filter(item => item.id.videoId) // sadece video olanları al
      .map(item => {
        const title = item.snippet.title;
        const videoId = item.id.videoId;
        const thumb = item.snippet.thumbnails.medium.url;
        return `
          <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="video-card">
            <img src="${thumb}" alt="${title}" />
            <h3>${title}</h3>
          </a>
        `;
      })
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8" />
        <title>Mucize Karakedi Videoları</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
          }
          header {
            background-color: #7b2cbf;
            color: white;
            padding: 1rem;
            text-align: center;
            font-size: 2rem;
          }
          .logo {
            max-height: 50px;
            vertical-align: middle;
          }
          main {
            padding: 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          .video-card {
            display: block;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            text-decoration: none;
            color: black;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .video-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
          }
          .video-card img {
            width: 100%;
            display: block;
          }
          .video-card h3 {
            padding: 0.5rem;
            font-size: 1rem;
          }
          footer {
            background-color: #7b2cbf;
            color: white;
            text-align: center;
            padding: 1rem;
            margin-top: 2rem;
          }
        </style>
      </head>
      <body>
        <header>
          <img src="https://mucizekarakedi.com/logo.png" alt="Logo" class="logo" />
          En Güncel Videolar
        </header>
        <main>
          ${videosHtml}
        </main>
        <footer>
          © 2026 Mucize Karakedi. Tüm hakları saklıdır.
        </footer>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  } catch (err) {
    return new Response("Bir hata oluştu: " + err.message, { status: 500 });
  }
}
