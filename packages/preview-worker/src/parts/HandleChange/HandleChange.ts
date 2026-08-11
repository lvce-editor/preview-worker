import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleChange = async (state: PreviewState, hdId: string, value: string): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleChange', hdId, value)
}
