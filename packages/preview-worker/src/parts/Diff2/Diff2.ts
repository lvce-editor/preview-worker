import * as Diff from '../Diff/Diff.ts'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'

export const diff2 = (uid: number): readonly number[] => {
  const state = PreviewStates.get(uid)
  if (!state) {
    return []
  }
  const { newState, oldState } = state
  const result = Diff.diff(oldState, newState)
  return result
}
