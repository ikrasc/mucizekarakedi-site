addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

const API_KEY = "AIzaSyDF0m00tIPqW5hVkKLOJeOBe96oSbc_SuQ"
const CHANNEL_ID = "UCwxsT94yU2CgkJv-1Ptqpnw"

async function handleRequest(request) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`
  const response = await fetch(url)
  const data = await response.json()

  if (!data.items) {
    return new Response("Videolar alınamadı.", { status: 500 })
  }

  let html = `<h1>En Güncel Videolar</h1>`

  data.items.forEach(item => {
    if (item.id.videoId) {
      html += `<h3>${item.snippet.title}</h3>`
      html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>`
    }
  })

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" }
  })
}
