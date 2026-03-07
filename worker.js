const API_KEY = "AIzaSyDF0m00tIPqW5hVkKLOJeOBe96oSbc_SuQ";
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw";
const VIDEOS_PER_PAGE = 10;

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

  const url = new URL(request.url);
  const pageToken = url.searchParams.get("pageToken") || "";

  // önce kanal detayını alıyoruz
  const channelRes = await fetch(
`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
  );

  const channelData = await channelRes.json();

  const uploadsPlaylist =
    channelData.items[0].contentDetails.relatedPlaylists.uploads;

  // sonra uploads playlist'ten videoları çekiyoruz
  const videoRes = await fetch(
`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${VIDEOS_PER_PAGE}&playlistId=${uploadsPlaylist}&pageToken=${pageToken}&key=${API_KEY}`
  );

  const videoData = await videoRes.json();

  const videos = videoData.items.filter(v => {
    const title = v.snippet.title.toLowerCase();
    return !title.includes("shorts");
  });

  const nextPageToken = videoData.nextPageToken || null;
  const prevPageToken = videoData.prevPageToken || null;

  const html = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">
<title>Mucize Karakedi</title>

<style>

body{
background:#1e1e1e;
color:white;
font-family:Arial, sans-serif;
margin:0;
}

header{
display:flex;
align-items:center;
padding:20px;
}

header img{
height:50px;
margin-right:20px;
}

h1{
font-size:26px;
margin:0;
}

.grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(260px,1fr));
gap:20px;
padding:20px;
}

.card{
background:#2b2b2b;
border-radius:10px;
overflow:hidden;
transition:0.2s;
}

.card:hover{
transform:scale(1.03);
}

.card img{
width:100%;
display:block;
}

.card p{
padding:10px;
font-size:14px;
}

a{
text-decoration:none;
color:white;
}

.pagination{
display:flex;
justify-content:center;
gap:15px;
padding:20px;
}

.pagination a{
background:#4b0082;
padding:10px 15px;
border-radius:6px;
}

</style>
</head>

<body>

<header>

<img src="https://mucizekarakedi.com/logo.png">

<h1>En Güncel Videolar</h1>

</header>

<div class="grid">

${videos
  .map(
    v => `
<a href="https://youtube.com/watch?v=${v.snippet.resourceId.videoId}" target="_blank">

<div class="card">

<img src="${v.snippet.thumbnails.medium.url}">

<p>${v.snippet.title}</p>

</div>

</a>
`
  )
  .join("")}

</div>

<div class="pagination">

${
  prevPageToken
    ? `<a href="?pageToken=${prevPageToken}">← Önceki</a>`
    : ""
}

${
  nextPageToken
    ? `<a href="?pageToken=${nextPageToken}">Sonraki →</a>`
    : ""
}

</div>

</body>
</html>
`;

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" }
  });
}
