import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { rerender } from '../Rerender/Rerender.ts'
import * as WaitForClickState from '../WaitForClickState/WaitForClickState.ts'

export const handleMutation = async (state: PreviewState): Promise<PreviewState> => {
  const { uid } = state
  if (WaitForClickState.has('mutation', uid)) {
    WaitForClickState.resolve('mutation', uid)
  }
  return rerender(state)
}
