import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as CallAndUpdate from '../CallAndUpdate/CallAndUpdate.ts'

export const handleKeydown = async (state: PreviewState, hdId: string, key: string, code: string): Promise<PreviewState> => {
  return CallAndUpdate.callAndUpdate(state, 'SandBox.handleKeyDown', hdId, key, code)
}
