/**
 * Tracks which preview UIDs are currently executing updateContent
 * This is used to avoid race conditions when canvas width/height is set
 * before the preview is visible
 */
const updating: Set<number> = new Set()

/**
 * Tracks dynamic CSS rules generated during updateContent execution
 * These are canvas width/height CSS rules that are generated when canvas dimensions change
 * They need to be returned from updateContent so they're included in the initial render
 */
const pendingCssRules: Map<number, string[]> = new Map()

export const set = (uid: number): void => {
  updating.add(uid)
  pendingCssRules.set(uid, [])
}

export const remove = (uid: number): void => {
  updating.delete(uid)
  pendingCssRules.delete(uid)
}

export const isUpdating = (uid: number): boolean => {
  return updating.has(uid)
}

export const addCssRule = (uid: number, cssRule: string): void => {
  const rules = pendingCssRules.get(uid)
  if (rules) {
    rules.push(cssRule)
  }
}

export const getCssRules = (uid: number): readonly string[] => {
  return pendingCssRules.get(uid) || []
}

export const clear = (): void => {
  updating.clear()
  pendingCssRules.clear()
}
