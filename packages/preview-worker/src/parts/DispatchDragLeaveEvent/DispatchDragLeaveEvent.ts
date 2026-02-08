import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchDragLeaveEvent = (element: any, window: any): void => {
  const dragLeaveEvent = new window.DragEvent('dragleave', { bubbles: true })
  DispatchEvent.dispatchEvent(element, dragLeaveEvent)
}
