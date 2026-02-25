import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const triggerRerender = async (state: PreviewState): Promise<PreviewState> => {
  await RendererWorker.invoke('Preview.rerender')
  return state
}
