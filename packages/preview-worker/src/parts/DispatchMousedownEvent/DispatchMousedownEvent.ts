import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchMousedownEvent = (element: any, window: any): void => {
  const mousedownEvent = new window.MouseEvent('mousedown', { bubbles: true })
  DispatchEvent.dispatchEvent(element, mousedownEvent)
}
