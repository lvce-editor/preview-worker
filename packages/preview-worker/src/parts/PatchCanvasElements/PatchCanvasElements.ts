import * as CanvasState from '../CanvasState/CanvasState.ts'

export const patchCanvasElements = (document: any, uid: number): void => {
  const canvasElements = document.querySelectorAll('canvas')
  if (canvasElements.length === 0) {
    return
  }
  const instances: { element: any; offscreenCanvas: OffscreenCanvas; dataId: string }[] = []
  for (let i = 0; i < canvasElements.length; i++) {
    const element = canvasElements[i]
    const width = Number.parseInt(element.getAttribute('width') || '300', 10)
    const height = Number.parseInt(element.getAttribute('height') || '150', 10)
    const offscreenCanvas = new OffscreenCanvas(width, height)
    const dataId = String(i)
    const context = offscreenCanvas.getContext('2d')
    element.getContext = (contextType: string): any => {
      if (contextType === '2d') {
        return context
      }
      return undefined
    }
    instances.push({ element, offscreenCanvas, dataId })
  }
  CanvasState.set(uid, { instances, animationFrameHandles: [] })
}
