import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleInput = async (state: PreviewState, hdId: string, value: string): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleInput', hdId, value)
}
