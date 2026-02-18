import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleKeyup = async (state: PreviewState, hdId: string, key: string, code: string): Promise<PreviewState> => {
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleKeyUp', hdId, key, code)
}
