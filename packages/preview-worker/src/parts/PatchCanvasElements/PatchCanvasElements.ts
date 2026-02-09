import * as CanvasState from '../CanvasState/CanvasState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'

interface CanvasCanvasDimensions {
  width: number
  height: number
}

const toNumber = (value: number | string): number => {
  if (typeof value === 'number') {
    return value
  }
  const num = parseInt(value, 10)
  return Number.isNaN(num) ? 0 : num
}

export const patchCanvasElements = async (
  document: any,
  uid: number,
  onCanvasDimensionsChange?: (element: any, width: number, height: number) => Promise<void>,
): Promise<void> => {
  const canvasElements = document.querySelectorAll('canvas')
  if (canvasElements.length === 0) {
    return
  }
  const instances: { element: any; offscreenCanvas: OffscreenCanvas; dataId: string; dimensions: CanvasCanvasDimensions }[] = []

  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const width = toNumber(element.getAttribute('width') || 300)
    const height = toNumber(element.getAttribute('height') || 300)
    element.width = width
    element.height = height
    const { canvasId, offscreenCanvas } = await getOffscreenCanvas(width, height)
    const dataId = String(canvasId)
    element.__canvasId = canvasId
    const context = offscreenCanvas.getContext('2d')
    element.getContext = (contextType: string): any => {
      if (contextType === '2d') {
        return context
      }
      return undefined
    }

    // Store dimension tracking
    const dimensions: CanvasCanvasDimensions = { width, height }

    // Override width property to detect changes
    let widthValue = width
    Object.defineProperty(element, 'width', {
      get: () => widthValue,
      set: (newWidth: number | string) => {
        widthValue = toNumber(newWidth)
        dimensions.width = widthValue
        createNewOffscreenCanvas(widthValue, dimensions.height)
      },
      configurable: true,
      enumerable: true,
    })

    // Override height property to detect changes
    let heightValue = height
    Object.defineProperty(element, 'height', {
      get: () => heightValue,
      set: (newHeight: number | string) => {
        heightValue = toNumber(newHeight)
        dimensions.height = heightValue
        createNewOffscreenCanvas(dimensions.width, heightValue)
      },
      configurable: true,
      enumerable: true,
    })

    const createNewOffscreenCanvas = async (w: number, h: number): Promise<void> => {
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
        const instanceIndex = state.instances.findIndex((inst) => inst.element === element)
        if (instanceIndex !== -1) {
          ;(state.instances[instanceIndex] as any).offscreenCanvas = newOffscreenCanvas
        }
      }

      // Notify if callback is provided
      if (onCanvasDimensionsChange) {
        await onCanvasDimensionsChange(element, w, h)
      }
    }

    instances.push({ dataId, element, offscreenCanvas, dimensions })
  }
  CanvasState.set(uid, { animationFrameHandles: [], instances })
}
