import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchDropEvent from '../src/parts/DispatchDropEvent/DispatchDropEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchDropEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.addEventListener('drop', () => {
    fired = true
  })
  DispatchDropEvent.dispatchDropEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDropEvent fires direct ondrop handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  let fired = false
  div.ondrop = (): void => {
    fired = true
  }
  DispatchDropEvent.dispatchDropEvent(div, window)
  expect(fired).toBe(true)
})

test('dispatchDropEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="dropzone">Drop here</div>'
  const div = document.querySelector('#dropzone')
  expect(() => {
    DispatchDropEvent.dispatchDropEvent(div, window)
  }).not.toThrow()
})

test('dispatchDropEvent event bubbles to parent', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="parent"><div id="child">Drop here</div></div>'
  const parent = document.querySelector('#parent')
  const child = document.querySelector('#child')
  let bubbled = false
  parent.addEventListener('drop', () => {
    bubbled = true
  })
  DispatchDropEvent.dispatchDropEvent(child, window)
  expect(bubbled).toBe(true)
})
