import * as ElementTags from '../ElementTags/ElementTags.ts'

export const isSelfClosingTag = (tag: string): boolean => {
  switch (tag.toLowerCase()) {
    case ElementTags.Br:
    case ElementTags.Hr:
    case ElementTags.Img:
    case ElementTags.Input:
    case 'meta':
    case 'link':
    case 'base':
    case 'area':
    case 'col':
    case 'embed':
    case 'param':
    case 'source':
    case 'track':
    case 'wbr':
      return true
    default:
      return false
  }
}
