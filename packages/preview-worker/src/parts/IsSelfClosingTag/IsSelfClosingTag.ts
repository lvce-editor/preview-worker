import * as ElementTags from '../ElementTags/ElementTags.ts'

export const isSelfClosingTag = (tag: string): boolean => {
  switch (tag) {
    case ElementTags.Img:
    case ElementTags.Br:
    case ElementTags.Hr:
      return true
    default:
      return false
  }
}
