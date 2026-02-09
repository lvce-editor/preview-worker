/* eslint-disable @typescript-eslint/no-floating-promises */
import * as CanvasState from '../CanvasState/CanvasState.ts'
import { toNumber } from '../CreateNewOffscreenCanvas/CreateNewOffscreenCanvas.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'

interface CanvasCanvasDimensions {
  height: number
  width: number
}

const generateCanvasCssRule = (dataUid: string, width: number, height: number): string => {
  return `[data-uid="${dataUid}"] { width: ${width}px; height: ${height}px; }`
}

export const patchCanvasElements = async (
  document: any,
  uid: number,
  onCanvasDimensionsChange?: (element: any, width: number, height: number, cssRule?: string) => Promise<void>,
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
    element.setAttribute('data-uid', dataId)
    const context = offscreenCanvas.getContext('2d')
    element.getContext = (contextType: string): any => {
      if (contextType === '2d') {
        return context
      }
      return undefined
    }

    // Store dimension tracking
    const dimensions: CanvasCanvasDimensions = { height, width }

    // Override width property to detect changes
    let widthValue = width
    Object.defineProperty(element, 'width', {
      configurable: true,
      enumerable: true,
      get: () => widthValue,
      set: (newWidth: number | string) => {
        console.log('set canvas witdh', newWidth)
        widthValue = toNumber(newWidth)
        dimensions.width = widthValue
        const cssRule = generateCanvasCssRule(dataId, widthValue, dimensions.height)
        onCanvasDimensionsChange?.(element, widthValue, dimensions.height, cssRule)
      },
    })

    // Override height property to detect changes
    let heightValue = height
    Object.defineProperty(element, 'height', {
      configurable: true,
      enumerable: true,
      get: () => heightValue,
      set: (newHeight: number | string) => {
        heightValue = toNumber(newHeight)
        dimensions.height = heightValue
        const cssRule = generateCanvasCssRule(dataId, dimensions.width, heightValue)
        onCanvasDimensionsChange?.(element, dimensions.width, heightValue, cssRule)
      },
    })

    instances.push({ dataId, dimensions, element, offscreenCanvas })
  }
  CanvasState.set(uid, { animationFrameHandles: [], instances })
}
