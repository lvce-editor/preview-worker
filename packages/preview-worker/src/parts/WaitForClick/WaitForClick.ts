import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as WaitForClickState from '../WaitForClickState/WaitForClickState.ts'

export const waitForClick = async (state: PreviewState): Promise<PreviewState> => {
  const { uid } = state
  const { promise, resolve } = Promise.withResolvers<void>()
  WaitForClickState.register('click', uid, resolve)
  await promise
  return state
}
