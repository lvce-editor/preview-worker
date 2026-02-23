export const hasScheme = (uri: string): boolean => {
  return /^[a-z][a-z\d+.-]*:/i.test(uri)
}

export default hasScheme
