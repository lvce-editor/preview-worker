import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      capture: true,
      name: DomEventListenersFunctions.HandleChange,
      params: ['handleChange', 'event.target.dataset.id', EventExpression.TargetValue],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', 'event.target.dataset.id', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleInput,
      params: ['handleInput', 'event.target.dataset.id', EventExpression.TargetValue],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleKeydown,
      params: ['handleKeyDown', 'event.target.dataset.id', EventExpression.Key, 'event.code'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleKeyup,
      params: ['handleKeyUp', 'event.target.dataset.id', EventExpression.Key, 'event.code'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleMousedown,
      params: ['handleMousedown', 'event.target.dataset.id', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleMousemove,
      params: ['handleMousemove', 'event.target.dataset.id', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleMouseup,
      params: ['handleMouseup', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandlePointerdown,
      params: ['handlePointerdown', 'event.target.dataset.id', EventExpression.ClientX, EventExpression.ClientY],
    },
  ]
}
