export const isDefaultAllowedAttribute = (attributeName: string, defaultAllowedAttributes: readonly string[]): boolean => {
  // Allow data-* attributes
  if (attributeName.startsWith('data-')) {
    return true
  }
  // Allow aria-* attributes
  if (attributeName.startsWith('aria-')) {
    return true
  }
  // Allow role attribute
  if (attributeName === 'role') {
    return true
  }
  // Check if in default list
  return defaultAllowedAttributes.includes(attributeName)
}
