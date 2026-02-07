import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMousemoveEvent = (element: any, window: any, clientX: number, clientY: number): void => {
  const mousemoveEvent = new window.MouseEvent('mousemove', {
    bubbles: true,
    clientX,
    clientY,
    screenX: clientX,
    screenY: clientY,
  })
  DispatchEvent.dispatchEvent(element, mousemoveEvent)
}
