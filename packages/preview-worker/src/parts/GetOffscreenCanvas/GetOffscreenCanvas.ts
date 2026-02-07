import { RendererWorker } from '@lvce-editor/rpc-registry'

export const getOffscreenCanvas = async (canvasId: number): Promise<OffscreenCanvas> => {
  // @ts-ignore
  return await RendererWorker.invoke('OffscreenCanvas.create', canvasId)
}
