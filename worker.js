// worker.js
const API_KEY = "AIzaSyACi0bE7w5vWXnwnEGocmpD6ao9dE-Y584";
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw"; // Senin kanal ID'n
const MAX_RESULTS = 10; // Kaç video göstermek istediğini ayarlayabilirsin

export default {
  async fetch(request, env) {
    try {
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;

      const res = await fetch(apiUrl);
      const data = await res.json();

      const videosHtml = data.items
        .filter(item => item.id.kind === "youtube#video")
        .map(item => {
          const videoId = item.id.videoId;
          return `
            <div style="margin-bottom:20px;">
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        })
        .join("");

      const html = `
        <html>
          <head>
            <title>Mucize Karakedi Videolar</title>
          </head>
          <body style="background-color:#000;color:#fff;text-align:center;font-family:sans-serif;">
            <h1>Mucize Karakedi En Güncel Videolar</h1>
            ${videosHtml}
          </body>
        </html>
      `;

      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } catch (error) {
      return new Response(`Hata oluştu: ${error}`, { status: 500 });
    }
  }
};
