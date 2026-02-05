import * as ElementTags from '../ElementTags/ElementTags.ts'

export const isSelfClosingTag = (tag: string): boolean => {
  switch (tag) {
    case ElementTags.Br:
    case ElementTags.Hr:
    case ElementTags.Img:
    case ElementTags.Input:
      return true
    default:
      return false
  }
}
