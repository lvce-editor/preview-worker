import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchDragOverEvent = (element: any, window: any): void => {
  const dragOverEvent = new window.DragEvent('dragover', { bubbles: true })
  DispatchEvent.dispatchEvent(element, dragOverEvent)
}
