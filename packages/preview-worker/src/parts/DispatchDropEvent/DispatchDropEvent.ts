import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

export const dispatchDropEvent = (element: any, window: any): void => {
  const dropEvent = new window.DragEvent('drop', { bubbles: true })
  DispatchEvent.dispatchEvent(element, dropEvent)
}
