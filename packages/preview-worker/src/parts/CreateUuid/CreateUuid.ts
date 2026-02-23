export const createUuid = (): string => {
  return globalThis.crypto.randomUUID()
}
