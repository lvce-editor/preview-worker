import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchDragOverEvent from '../src/parts/DispatchDragOverEvent/DispatchDragOverEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchDragOverEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.addEventListener('dragover', () => {
    fired = true
  })
  DispatchDragOverEvent.dispatchDragOverEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragOverEvent fires direct ondragover handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.ondragover = (): void => {
    fired = true
  }
  DispatchDragOverEvent.dispatchDragOverEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragOverEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  expect(() => {
    DispatchDragOverEvent.dispatchDragOverEvent(div, window)
  }).not.toThrow()
})

test('dispatchDragOverEvent event bubbles to parent', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="parent"><div id="child">Drop here</div></div>'
  const parent = document.querySelector('#parent')
  const child = document.querySelector('#child')
  let bubbled = false
  parent.addEventListener('dragover', () => {
    bubbled = true
  })
  DispatchDragOverEvent.dispatchDragOverEvent(child, window)
  expect(bubbled).toBe(true)
})
