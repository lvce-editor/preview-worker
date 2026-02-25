import { fetchText } from './FetchText.ts'

const PREVIEW_CDN_CACHE_NAME = 'preview-cdn-cache-v1'

export const getCachedText = async (url: string): Promise<string> => {
  if (typeof caches === 'undefined') {
    return fetchText(url)
  }

  const cache = await caches.open(PREVIEW_CDN_CACHE_NAME)
  const cached = await cache.match(url)
  if (cached) {
    return cached.text()
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }
  await cache.put(url, response.clone())
  return response.text()
}
