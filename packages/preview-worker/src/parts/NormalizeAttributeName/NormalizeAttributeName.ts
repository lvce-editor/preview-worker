export const normalizeAttributeName = (attribute: string): string => {
  if (attribute === 'class') {
    return 'className'
  }
  if (attribute === 'type') {
    return 'inputType'
  }
  return attribute
}

