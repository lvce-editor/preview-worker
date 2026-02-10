
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'



const callbackRpcs = Object.create(null)

export const executeCallback = async (id: number, ...args: readonly any[]): Promise<void> => {

  const rpc = callbackRpcs[id]
  await rpc.invokeAndTransfer('SandBox.executeCallback', id, ...args)
}


export const getOffscreenCanvas = async (state: PreviewState, id: number, width: number, height: number): Promise<void> => {
  // TODO possible race condition / conflict if multiple
  // previews create offscreen canvases at the same time
  callbackRpcs[id] = state.sandboxRpc
  await RendererWorker.invoke('OffscreenCanvas.createForPreview', id, width, height)
}
