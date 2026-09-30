const https = require('https')
const axios = require('axios')
const shouldCompress = require('./shouldCompress')
const redirect = require('./redirect')
const compress = require('./compress')
const bypass = require('./bypass')
const copyHeaders = require('./copyHeaders')

async function proxy(req, res) {
  const url = req.params.url
  const headers = {
    ...(req.headers.cookie && { cookie: req.headers.cookie }),
    ...(req.headers.dnt && { dnt: req.headers.dnt }),
    ...(req.headers.referer && { referer: req.headers.referer }),
    'user-agent': 'Bandwidth-Hero Compressor',
    'x-forwarded-for': req.headers['x-forwarded-for'] || req.ip,
    via: '1.1 bandwidth-hero'
  }

  try {
    const response = await axios.get(url, {
      headers,
      timeout: 10000,
      maxRedirects: 5,
      responseType: 'arraybuffer',
      validateStatus: () => true,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })

    if (response.status >= 400) return redirect(req, res)

    copyHeaders(response, res)
    res.setHeader('content-encoding', 'identity')
    req.params.originType = response.headers['content-type'] || ''
    req.params.originSize = response.data.length

    if (shouldCompress(req)) {
      await compress(req, res, response.data)
    } else {
      bypass(req, res, response.data)
    }
  } catch (error) {
    console.error('proxy error:', error.message)
    redirect(req, res)
  }
}

module.exports = proxy
