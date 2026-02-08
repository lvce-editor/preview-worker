import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchDragStartEvent = (element: any, window: any): void => {
  const dragStartEvent = new window.DragEvent('dragstart', { bubbles: true })
  DispatchEvent.dispatchEvent(element, dragStartEvent)
}
