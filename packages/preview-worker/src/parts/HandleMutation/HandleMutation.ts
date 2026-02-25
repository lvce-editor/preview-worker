import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { triggerRerender } from '../TriggerRerender/TriggerRerender.ts'
import * as WaitForClickState from '../WaitForClickState/WaitForClickState.ts'

export const handleMutation = async (state: PreviewState): Promise<PreviewState> => {
  const { uid } = state
  await triggerRerender(state)
  if (WaitForClickState.has('mutation', uid)) {
    WaitForClickState.resolve('mutation', uid)
  }
  return state
}
