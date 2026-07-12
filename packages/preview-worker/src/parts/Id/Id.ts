const state = { idCounter: 0 }

export const create = (): number => {
  state.idCounter++
  return state.idCounter
}
