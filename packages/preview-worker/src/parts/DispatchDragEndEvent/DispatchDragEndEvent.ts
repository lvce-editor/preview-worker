import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchDragEndEvent = (element: any, window: any): void => {
  const dragEndEvent = new window.DragEvent('dragend', { bubbles: true })
  DispatchEvent.dispatchEvent(element, dragEndEvent)
}
