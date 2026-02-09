import * as DispatchEvent from '../DispatchEvent/DispatchEvent.ts'

<<<<<<< HEAD
export const dispatchMouseupEvent = (element: any, window: any): void => {
  const mouseupEvent = new window.MouseEvent('mouseup', { bubbles: true })
=======
export const dispatchMouseupEvent = (element: any, window: any, clientX: number = 0, clientY: number = 0): void => {
  const mouseupEvent = new window.MouseEvent('mouseup', { bubbles: true, clientX, clientY })
>>>>>>> origin/main
  DispatchEvent.dispatchEvent(element, mouseupEvent)
}
