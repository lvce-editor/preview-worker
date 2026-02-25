import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'
import * as WaitForClickState from '../WaitForClickState/WaitForClickState.ts'

export const handleClick = async (state: PreviewState, hdId: string, clientX: number, clientY: number): Promise<PreviewState> => {
  const { uid } = state
  // TODO race condition: click promise should only be resolved once preview has rerendered
  if (WaitForClickState.has(uid)) {
    WaitForClickState.resolve(uid)
  }
  if (!hdId) {
    return state
  }
  const { x, y } = state
  const adjustedClientX = clientX - x
  const adjustedClientY = clientY - y
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleClick', hdId, adjustedClientX, adjustedClientY)
}
