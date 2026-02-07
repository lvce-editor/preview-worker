import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMouseMoveEvent = (element: any, window: any, clientX: number, clientY: number): void => {
  const mouseMoveEvent = new window.MouseEvent('mousemove', {
    bubbles: true,
    clientX,
    clientY,
    screenX: clientX,
    screenY: clientY,
  })
  DispatchEvent.dispatchEvent(element, mouseMoveEvent)
}
