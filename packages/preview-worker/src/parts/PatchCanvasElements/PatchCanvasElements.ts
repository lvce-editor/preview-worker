import * as CanvasState from '../CanvasState/CanvasState.ts'
import { getOffscreenCanvas } from '../GetOffscreenCanvas/GetOffscreenCanvas.ts'

let nextCanvasId = 1

export const patchCanvasElements = async (document: any, uid: number): Promise<void> => {
  const canvasElements = document.querySelectorAll('canvas')
  if (canvasElements.length === 0) {
    return
  }
  const instances: { element: any; offscreenCanvas: OffscreenCanvas; dataId: string }[] = []
  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const canvasId = nextCanvasId++
    const offscreenCanvas: OffscreenCanvas = await getOffscreenCanvas(canvasId)
    const dataId = String(canvasId)
    element.__canvasId = canvasId
    const context = offscreenCanvas.getContext('2d')
    element.getContext = (contextType: string): any => {
      if (contextType === '2d') {
        return context
      }
      return undefined
    }
    instances.push({ dataId, element, offscreenCanvas })
  }
  CanvasState.set(uid, { animationFrameHandles: [], instances })
}
