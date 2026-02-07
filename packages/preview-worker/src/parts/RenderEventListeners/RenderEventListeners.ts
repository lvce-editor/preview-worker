import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      capture: true,
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleInput,
      params: ['handleInput', 'event.target.dataset.id', 'event.target.value'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleKeydown,
      params: ['handleKeyDown', 'event.target.dataset.id', 'event.key', 'event.code'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleMouseMove,
      params: ['handleMouseMove', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
    },
  ]
}
