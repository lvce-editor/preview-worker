import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchDragLeaveEvent from '../src/parts/DispatchDragLeaveEvent/DispatchDragLeaveEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchDragLeaveEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.addEventListener('dragleave', () => {
    fired = true
  })
  DispatchDragLeaveEvent.dispatchDragLeaveEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragLeaveEvent fires direct ondragleave handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.ondragleave = (): void => {
    fired = true
  }
  DispatchDragLeaveEvent.dispatchDragLeaveEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDragLeaveEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  expect(() => {
    DispatchDragLeaveEvent.dispatchDragLeaveEvent(div, window)
  }).not.toThrow()
})
