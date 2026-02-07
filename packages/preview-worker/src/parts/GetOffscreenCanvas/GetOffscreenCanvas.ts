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

export const executeCallback = (id: number, ...args: [OffscreenCanvas, number]): void => {
  const callback = callBacks[id]
  if (callback) {
    callback(...args)
    delete callBacks[id]
  } else {
    console.warn(`[preview-worker] No callback found for id ${id}`)
  }
}

interface OffscreenCanvasResult {
  readonly canvasId: number
  readonly offscreenCanvas: OffscreenCanvas
}

export const getOffscreenCanvas = async (): Promise<OffscreenCanvasResult> => {
  const { id, promise } = registerCallback()
  await RendererWorker.invoke('OffscreenCanvas.createForPreview', id)
  const [offscreenCanvas, canvasId] = await promise
  return { canvasId, offscreenCanvas }
}
