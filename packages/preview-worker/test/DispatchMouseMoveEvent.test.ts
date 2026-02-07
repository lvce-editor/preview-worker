import { expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as DispatchMouseMoveEvent from '../src/parts/DispatchMouseMoveEvent/DispatchMouseMoveEvent.ts'

const createWindow = (): any => {
  return new Window({ url: 'https://localhost:3000' })
}

test('dispatchMouseMoveEvent fires addEventListener listener', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="area">Hover here</div>'
  const area = document.querySelector('#area')
  let moved = false
  area.addEventListener('mousemove', () => {
    moved = true
  })
  DispatchMouseMoveEvent.dispatchMouseMoveEvent(area, window, 100, 200)
  expect(moved).toBe(true)
})

test('dispatchMouseMoveEvent fires direct onmousemove handler', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="area">Hover here</div>'
  const area = document.querySelector('#area')
  let moved = false
  area.onmousemove = (): void => {
    moved = true
  }
  DispatchMouseMoveEvent.dispatchMouseMoveEvent(area, window, 100, 200)
  expect(moved).toBe(true)
})

test('dispatchMouseMoveEvent fires both addEventListener and onmousemove', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="area">Hover here</div>'
  const area = document.querySelector('#area')
  const calls: string[] = []
  area.addEventListener('mousemove', (): void => {
    calls.push('addEventListener')
  })
  area.onmousemove = (): void => {
    calls.push('onmousemove')
  }
  DispatchMouseMoveEvent.dispatchMouseMoveEvent(area, window, 100, 200)
  expect(calls).toContain('addEventListener')
  expect(calls).toContain('onmousemove')
})

test('dispatchMouseMoveEvent does not throw when element has no listeners', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="area">Hover here</div>'
  const area = document.querySelector('#area')
  expect(() => {
    DispatchMouseMoveEvent.dispatchMouseMoveEvent(area, window, 100, 200)
  }).not.toThrow()
})

test('dispatchMouseMoveEvent passes clientX and clientY to event', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="area">Hover here</div>'
  const area = document.querySelector('#area')
  let receivedEvent: any = null
  area.onmousemove = (event: any): void => {
    receivedEvent = event
  }
  DispatchMouseMoveEvent.dispatchMouseMoveEvent(area, window, 150, 250)
  expect(receivedEvent).toBeDefined()
  expect(receivedEvent.clientX).toBe(150)
  expect(receivedEvent.clientY).toBe(250)
  expect(receivedEvent.type).toBe('mousemove')
})

test('dispatchMouseMoveEvent event bubbles to parent', () => {
  const window = createWindow()
  const { document } = window
  document.body.innerHTML = '<div id="parent"><div id="child">Hover</div></div>'
  const parent = document.querySelector('#parent')
  const child = document.querySelector('#child')
  let bubbled = false
  parent.addEventListener('mousemove', () => {
    bubbled = true
  })
  DispatchMouseMoveEvent.dispatchMouseMoveEvent(child, window, 100, 200)
  expect(bubbled).toBe(true)
})
