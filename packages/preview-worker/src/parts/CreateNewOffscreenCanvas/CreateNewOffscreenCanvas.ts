import * as CanvasState from '../CanvasState/CanvasState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'

export const toNumber = (value: number | string): number => {
  if (typeof value === 'number') {
    return value
  }
  const num = Number.parseInt(value, 10)
  return Number.isNaN(num) ? 0 : num
}

export const createNewOffscreenCanvas = async (
  w: number,
  h: number,
  element: any,
  uid: number,
  onCanvasDimensionsChange?: (element: any, width: number, height: number) => Promise<void>,
): Promise<void> => {
  if (Number.isNaN(w) || Number.isNaN(h) || w <= 0 || h <= 0) {
    return
  }

  const { offscreenCanvas: newOffscreenCanvas } = await getOffscreenCanvas(w, h)
  const newContext = newOffscreenCanvas.getContext('2d')

  // Update getContext to return the new context
  element.getContext = (contextType: string): any => {
    if (contextType === '2d') {
      return newContext
    }
    return undefined
  }

  // Update the instance in CanvasState
  const state = CanvasState.get(uid)
  if (state) {
    const instanceIndex = state.instances.findIndex((inst: readonly any) => inst.element === element)
    if (instanceIndex !== -1) {
      ;(state.instances[instanceIndex] as any).offscreenCanvas = newOffscreenCanvas
    }
  }

  // Notify if callback is provided
  if (onCanvasDimensionsChange) {
    await onCanvasDimensionsChange(element, w, h)
  }
}
