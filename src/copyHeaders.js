// Headers that must not be forwarded from the origin response
const SKIP = new Set([
  'content-length',
  'content-encoding',
  'transfer-encoding',
  'connection',
  'keep-alive',
  'set-cookie'
])

function copyHeaders(source, target) {
  for (const [key, value] of Object.entries(source.headers || {})) {
    if (SKIP.has(key.toLowerCase())) continue
    try {
      target.setHeader(key, value)
    } catch (e) {
      console.log(e.message)
    }
  }
}

module.exports = copyHeaders
