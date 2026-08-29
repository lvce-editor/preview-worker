import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'

const getCommandId = (index: number): string => {
  const command = Object.keys(commandMap)[index]
  const dotIndex = command.indexOf('.')
  return command.slice(dotIndex + 1)
}

test('event listener indices resolve to their commands', () => {
  expect(getCommandId(DomEventListenerFunctions.HandleChange)).toBe('handleChange')
  expect(getCommandId(DomEventListenerFunctions.HandleClick)).toBe('handleClick')
  expect(getCommandId(DomEventListenerFunctions.HandleInput)).toBe('handleInput')
  expect(getCommandId(DomEventListenerFunctions.HandleKeydown)).toBe('handleKeyDown')
  expect(getCommandId(DomEventListenerFunctions.HandleKeyup)).toBe('handleKeyUp')
  expect(getCommandId(DomEventListenerFunctions.HandleMousedown)).toBe('handleMousedown')
  expect(getCommandId(DomEventListenerFunctions.HandleMousemove)).toBe('handleMousemove')
  expect(getCommandId(DomEventListenerFunctions.HandleMouseup)).toBe('handleMouseup')
  expect(getCommandId(DomEventListenerFunctions.HandlePointerdown)).toBe('handlePointerdown')
  expect(getCommandId(DomEventListenerFunctions.HandlePointermove)).toBe('handlePointermove')
  expect(getCommandId(DomEventListenerFunctions.HandlePointerup)).toBe('handlePointerup')
})
