import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handlePointerup = async (state: PreviewState, hdId: string, clientX: number, clientY: number): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  const { x, y } = state
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handlePointerup', hdId, clientX - x, clientY - y)
}
