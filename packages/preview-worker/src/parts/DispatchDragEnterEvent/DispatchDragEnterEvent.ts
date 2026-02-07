import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchDragEnterEvent = (element: any, window: any): void => {
  const dragEnterEvent = new window.DragEvent('dragenter', { bubbles: true })
  DispatchEvent.dispatchEvent(element, dragEnterEvent)
}
