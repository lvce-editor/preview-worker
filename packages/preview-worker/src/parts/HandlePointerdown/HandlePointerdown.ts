import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handlePointerdown = async (
  state: PreviewState,
  hdId: string,
  clientX: number,
  clientY: number,
  button: number = 0,
): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  const { x, y } = state
  const adjustedClientX = clientX - x
  const adjustedClientY = clientY - y
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handlePointerdown', hdId, adjustedClientX, adjustedClientY, 0, 0, button)
}
