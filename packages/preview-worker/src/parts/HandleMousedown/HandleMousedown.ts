import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleMousedown = async (state: PreviewState, hdId: string, clientX: number, clientY: number): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleMousedown', hdId, clientX, clientY)
}
