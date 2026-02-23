const callbacks: Record<number, () => void> = Object.create(null)

export const register = (id: number, callback: () => void): void => {
  callbacks[id] = callback
}
export const has = (id: number): boolean => {
  return id in callbacks
}

export const resolve = (id: number): void => {
  const callback = callbacks[id]
  if (callback) {
    callback()
    delete callbacks[id]
  }
}
