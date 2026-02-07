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
      name: DomEventListenersFunctions.HandleKeyup,
      params: ['handleKeyUp', 'event.target.dataset.id', 'event.key', 'event.code'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleDragStart,
      params: ['handleDragStart', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleDragOver,
      preventDefault: true,
      params: ['handleDragOver', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleDrop,
      preventDefault: true,
      params: ['handleDrop', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleDragEnd,
      params: ['handleDragEnd', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleDragEnter,
      params: ['handleDragEnter', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleDragLeave,
      params: ['handleDragLeave', 'event.target.dataset.id'],
    },
  ]
}
