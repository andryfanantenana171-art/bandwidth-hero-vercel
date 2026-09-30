function redirect(req, res) {
  if (res.headersSent) return res.end()
  res.removeHeader('cache-control')
  res.removeHeader('expires')
  res.removeHeader('date')
  res.removeHeader('etag')
  res.setHeader('location', encodeURI(req.params.url))
  res.status(302).end()
}

module.exports = redirect
