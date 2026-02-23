export const isAbsoluteFileSystemPath = (href: string): boolean => {
  return href.startsWith('/') || /^[a-zA-Z]:[\\/\\]/.test(href) || /^\\\\/.test(href)
}

export default isAbsoluteFileSystemPath
export const isAbsoluteFileSystemPath = (href: string): boolean => {
  return href.startsWith('/') || /^[a-zA-Z]:[\\/\\]/.test(href) || /^\\\\/.test(href)
}

export default isAbsoluteFileSystemPath
