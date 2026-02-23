import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'
import * as WaitForClickState from '../WaitForClickState/WaitForClickState.ts'

export const handleClick = async (state: PreviewState, hdId: string, clientX: number, clientY: number): Promise<PreviewState> => {
  if (!hdId) {
    return state
  }
  if (WaitForClickState.has(state.uid)) {
    WaitForClickState.resolve(state.uid)
  }
  const { x, y } = state
  const adjustedClientX = clientX - x
  const adjustedClientY = clientY - y
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleClick', hdId, adjustedClientX, adjustedClientY)
}
