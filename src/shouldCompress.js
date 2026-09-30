const MIN_COMPRESS_LENGTH = 1024
const MIN_TRANSPARENT_COMPRESS_LENGTH = MIN_COMPRESS_LENGTH * 100

const IMAGE_FILE_REGEX = /^image\/(jpeg|png|gif|webp)$/i

function shouldCompress({ params }) {
  const { originType, originSize, webp } = params
  // strip parameters such as "; charset=..."
  const type = (originType || '').split(';')[0].trim()

  if (!IMAGE_FILE_REGEX.test(type)) return false
  if (!originSize) return false

  if (
    (webp && originSize < MIN_COMPRESS_LENGTH) ||
    (!webp && originSize < MIN_TRANSPARENT_COMPRESS_LENGTH)
  ) {
    return false
  }

  return true
}

module.exports = shouldCompress
