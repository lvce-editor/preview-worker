import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchDragEnterEvent from '../src/parts/DispatchDragEnterEvent/DispatchDragEnterEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchDragEnterEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.addEventListener('dragenter', () => {
    fired = true
  })
  DispatchDragEnterEvent.dispatchDragEnterEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragEnterEvent fires direct ondragenter handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.ondragenter = (): void => {
    fired = true
  }
  DispatchDragEnterEvent.dispatchDragEnterEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragEnterEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  expect(() => {
    DispatchDragEnterEvent.dispatchDragEnterEvent(div, window)
  }).not.toThrow()
})
