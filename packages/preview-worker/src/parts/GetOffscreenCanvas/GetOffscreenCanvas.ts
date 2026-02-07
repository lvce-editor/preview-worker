/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { RendererWorker } from '@lvce-editor/rpc-registry'

const callBacks = Object.create(null)

let id = 0

const registerCallback = (): any => {
  const nextId = id++
  const { promise, resolve } = Promise.withResolvers<OffscreenCanvas>()
  callBacks[nextId] = resolve
  return {
    id: nextId,
    promise,
  }
}

export const executeCallback = (id: number, offscreenCanvas: OffscreenCanvas): void => {
  const callback = callBacks[id]
  if (callback) {
    callback(offscreenCanvas)
    delete callBacks[id]
  } else {
    console.warn(`[preview-worker] No callback found for id ${id}`)
  }
}

export const getOffscreenCanvas = async (canvasId: number): Promise<OffscreenCanvas> => {
  const { id, promise } = registerCallback()
  await RendererWorker.invoke('OffscreenCanvas.createForPreview', canvasId, id)
  const offscreenCanvas = await promise
  return offscreenCanvas
}
