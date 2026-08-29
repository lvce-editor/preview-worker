import { expect, test } from '@jest/globals'
import * as DomEventListenersFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners should return the expected event listeners', () => {
  const result = RenderEventListeners.renderEventListeners()
  expect(result).toEqual([
    {
      capture: true,
      name: DomEventListenersFunctions.HandleChange,
      params: ['handleChange', 'event.target.dataset.id', 'event.target.value'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleClick,
      params: ['handleClick', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
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
      name: DomEventListenersFunctions.HandleMousedown,
      params: ['handleMousedown', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleMousemove,
      params: ['handleMousemove', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandleMouseup,
      params: ['handleMouseup', 'event.target.dataset.id'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandlePointerdown,
      params: ['handlePointerdown', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
      trackPointerEvents: [DomEventListenersFunctions.HandlePointermove, DomEventListenersFunctions.HandlePointerup],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandlePointermove,
      params: ['handlePointermove', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
    },
    {
      capture: true,
      name: DomEventListenersFunctions.HandlePointerup,
      params: ['handlePointerup', 'event.target.dataset.id', 'event.clientX', 'event.clientY'],
    },
  ])
})
