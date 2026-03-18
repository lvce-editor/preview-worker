import { isAbsoluteFileSystemPath } from '../IsAbsoluteFileSystemPath/IsAbsoluteFileSystemPath.ts'

export const isBlockedScriptSrc = (src: string): boolean => {
  if (/^\/\//.test(src)) {
    return true
  }
  if (isAbsoluteFileSystemPath(src)) {
    return true
  }
  if (/^(?:data|javascript|blob):/i.test(src)) {
    return true
  }
  if (/^(?:file):/i.test(src)) {
    return true
  }
  return false
}