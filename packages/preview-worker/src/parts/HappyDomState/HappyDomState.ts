interface HappyDomInstance {
  readonly window: any
  readonly document: any
  readonly elementMap: Map<string, any>
}

const states: Map<number, HappyDomInstance> = new Map()

export const get = (uid: number): HappyDomInstance | undefined => {
  return states.get(uid)
}

export const set = (uid: number, instance: HappyDomInstance): void => {
  states.set(uid, instance)
}

export const remove = (uid: number): void => {
  states.delete(uid)
}
