const API_KEY = "AIzaSyACi0bE7w5vWXnwnEGocmpD6ao9dE-Y584";
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw";

export default {
  async fetch(request, env, ctx) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
    const res = await fetch(url);
    const data = await res.json();

    const videos = data.items
      .filter(item => item.id.videoId)
      .map(item => `<li><a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">${item.snippet.title}</a></li>`).join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Mucize Karakedi Videoları</title>
          <style>
            body { font-family: sans-serif; background: #f7f7f7; padding: 2rem; }
            ul { list-style-type: none; padding: 0; }
            li { margin: 1rem 0; }
          </style>
        </head>
        <body>
          <h1>Son Videolar</h1>
          <ul>${videos}</ul>
        </body>
      </html>
    `;
    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  }
};
