import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleWheel = async (state: PreviewState, hdId: string, deltaY: number, ctrlKey: boolean): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleWheel', hdId, deltaY, ctrlKey)
}
