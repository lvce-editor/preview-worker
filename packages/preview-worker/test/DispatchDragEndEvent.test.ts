import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchDragEndEvent from '../src/parts/DispatchDragEndEvent/DispatchDragEndEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchDragEndEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="draggable">Drag me</div>'
  const div = document.querySelector('#draggable')
  let fired = false
  div.addEventListener('dragend', () => {
    fired = true
  })
  DispatchDragEndEvent.dispatchDragEndEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragEndEvent fires direct ondragend handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="draggable">Drag me</div>'
  const div = document.querySelector('#draggable')
  let fired = false
  div.ondragend = (): void => {
    fired = true
  }
  DispatchDragEndEvent.dispatchDragEndEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragEndEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="draggable">Drag me</div>'
  const div = document.querySelector('#draggable')
  expect(() => {
    DispatchDragEndEvent.dispatchDragEndEvent(div, window)
  }).not.toThrow()
})
