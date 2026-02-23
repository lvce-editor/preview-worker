import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const dispose = async (state: PreviewState): Promise<PreviewState> => {
  const { listenerId } = state
  if (!listenerId) {
    return state
  }
  try {
    await EditorWorker.invoke('Listener.unregister', listenerId)
  } catch (error) {
    console.error(error)
  }
  return {
    ...state,
    listenerId: '',
  }
}
