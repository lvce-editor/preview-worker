type CallbackMap = Record<number, () => void>

const callbacks: Record<string, CallbackMap> = Object.create(null)

export const register = (type: string, id: number, callback: () => void): void => {
  callbacks[type] ||= Object.create(null)
  callbacks[type][id] = callback
}
export const has = (type: string, id: number): boolean => {
  return type in callbacks && id in callbacks[type]
}

export const resolve = (type: string, id: number): void => {
  const callback = callbacks[type]?.[id]
  if (callback) {
    callback()
    delete callbacks[id]
  }
}
