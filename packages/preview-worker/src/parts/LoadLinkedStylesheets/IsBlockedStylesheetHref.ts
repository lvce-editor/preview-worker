import { isAbsoluteFileSystemPath } from './IsAbsoluteFileSystemPath'

export const isBlockedStylesheetHref = (href: string): boolean => {
  if (/^\/\//.test(href)) {
    return true
  }
  if (isAbsoluteFileSystemPath(href)) {
    return true
  }
  if (/^(?:data|javascript|blob):/i.test(href)) {
    return true
  }
  if (/^(?:http|https|file):/i.test(href)) {
    return true
  }
  return false
}

export default isBlockedStylesheetHref
