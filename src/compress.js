const sharp = require('sharp')

async function compress(req, res, input) {
  const format = req.params.webp ? 'webp' : 'jpeg'

  const compressed = await sharp(input)
    .grayscale(req.params.grayscale)
    .toFormat(format, {
      quality: req.params.quality,
      ...(format === 'jpeg' ? { progressive: true, optimizeScans: true } : {})
    })
    .toBuffer()

  res.setHeader('content-type', `image/${format}`)
  res.setHeader('content-length', compressed.length)
  res.setHeader('x-original-size', req.params.originSize)
  res.setHeader('x-bytes-saved', req.params.originSize - compressed.length)
  res.status(200)
  res.write(compressed)
  res.end()
}

module.exports = compress
