export const toNumber = (value: string | number | null): number => {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Math.trunc(Number(value))
    return Number.isNaN(parsed) ? 0 : parsed
  }
  return 0
}
