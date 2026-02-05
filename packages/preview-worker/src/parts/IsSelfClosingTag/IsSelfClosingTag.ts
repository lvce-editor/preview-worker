import * as ElementTags from '../ElementTags/ElementTags.ts'

export const isSelfClosingTag = (tag: string): boolean => {
  switch (tag) {
    case ElementTags.Img:
      return true
    default:
      return false
  }
}
