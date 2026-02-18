import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleMousemove = async (state: PreviewState, hdId: string, clientX: number, clientY: number): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  const { x, y } = state
  const adjustedClientX = clientX - x
  const adjustedClientY = clientY - y
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleMousemove', hdId, adjustedClientX, adjustedClientY)
}
