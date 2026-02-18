import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const rerender = (state: PreviewState): PreviewState => {
  // Create a new copy of parsedDom array to trigger diff
  const parsedDom = [...state.parsedDom]

  // Return a new state object with the copied parsedDom
  // This will cause DiffItems.isEqual to return false since parsedDom reference changed
  return {
    ...state,
    parsedDom,
  }
}

export const triggerRerender = async (state: PreviewState): Promise<PreviewState> => {
  await RendererWorker.invoke('Preview.rerender')
  return state
}
