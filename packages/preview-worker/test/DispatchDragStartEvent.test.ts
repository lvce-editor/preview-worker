import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchDragStartEvent from '../src/parts/DispatchDragStartEvent/DispatchDragStartEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchDragStartEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="draggable">Drag me</div>'
  const div = document.querySelector('#draggable')
  let fired = false
  div.addEventListener('dragstart', () => {
    fired = true
  })
  DispatchDragStartEvent.dispatchDragStartEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragStartEvent fires direct ondragstart handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="draggable">Drag me</div>'
  const div = document.querySelector('#draggable')
  let fired = false
  div.ondragstart = (): void => {
    fired = true
  }
  DispatchDragStartEvent.dispatchDragStartEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragStartEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="draggable">Drag me</div>'
  const div = document.querySelector('#draggable')
  expect(() => {
    DispatchDragStartEvent.dispatchDragStartEvent(div, window)
  }).not.toThrow()
})

test('dispatchDragStartEvent event bubbles to parent', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="parent"><div id="child">Drag me</div></div>'
  const parent = document.querySelector('#parent')
  const child = document.querySelector('#child')
  let bubbled = false
  parent.addEventListener('dragstart', () => {
    bubbled = true
  })
  DispatchDragStartEvent.dispatchDragStartEvent(child, window)
  expect(bubbled).toBe(true)
})
