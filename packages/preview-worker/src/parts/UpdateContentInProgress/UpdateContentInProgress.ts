/**
 * Tracks which preview UIDs are currently executing updateContent
 * This is used to avoid race conditions when canvas width/height is set
 * before the preview is visible
 */
const updating: Set<number> = new Set()

export const set = (uid: number): void => {
  updating.add(uid)
}

export const remove = (uid: number): void => {
  updating.delete(uid)
}

export const isUpdating = (uid: number): boolean => {
  return updating.has(uid)
}

export const clear = (): void => {
  updating.clear()
}
