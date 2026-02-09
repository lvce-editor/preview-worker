import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMousemoveEvent = (element: any, window: any): void => {
  const mousemoveEvent = new window.MouseEvent('mousemove', { bubbles: true })
  DispatchEvent.dispatchEvent(element, mousemoveEvent)
}
