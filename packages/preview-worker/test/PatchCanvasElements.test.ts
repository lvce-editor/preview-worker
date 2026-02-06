import { afterEach, beforeAll, expect, test } from '@jest/globals'
import { Window } from 'happy-dom-without-node'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import * as PatchCanvasElements from '../src/parts/PatchCanvasElements/PatchCanvasElements.ts'

// OffscreenCanvas is a Web Worker API not available in Node.js
// Provide a minimal mock for testing
class MockOffscreenCanvas {
  width: number
  height: number
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getContext(_type: string): any {
    return {
      arc: () => {},
      beginPath: () => {},
      clearRect: () => {},
      closePath: () => {},
      fill: () => {},
      fillRect: () => {},
      fillStyle: '',
      fillText: () => {},
      font: '',
      lineTo: () => {},
      moveTo: () => {},
      stroke: () => {},
      strokeStyle: '',
    }
  }

  transferToImageBitmap(): any {
    return {}
  }
}

beforeAll(() => {
  if (globalThis.OffscreenCanvas === undefined) {
    // @ts-ignore
    globalThis.OffscreenCanvas = MockOffscreenCanvas
  }
})

afterEach(() => {
  CanvasState.clear()
})

test('patchCanvasElements should do nothing when no canvas elements exist', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><div>hello</div></body>'
  PatchCanvasElements.patchCanvasElements(document, 1)
  expect(CanvasState.get(1)).toBeUndefined()
})

test('patchCanvasElements should create OffscreenCanvas for canvas element', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state).toBeDefined()
  expect(state?.instances.length).toBe(1)
  expect(state?.instances[0].offscreenCanvas).toBeInstanceOf(OffscreenCanvas)
  expect(state?.instances[0].offscreenCanvas.width).toBe(320)
  expect(state?.instances[0].offscreenCanvas.height).toBe(480)
})

test('patchCanvasElements should make getContext return a real 2d context', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const ctx = canvas.getContext('2d')
  expect(ctx).toBeDefined()
  expect(typeof ctx.fillRect).toBe('function')
  expect(typeof ctx.clearRect).toBe('function')
  expect(typeof ctx.arc).toBe('function')
  expect(typeof ctx.beginPath).toBe('function')
  expect(typeof ctx.fillText).toBe('function')
})

test('patchCanvasElements should return undefined for non-2d context', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const ctx = canvas.getContext('webgl')
  expect(ctx).toBeUndefined()
})

test('patchCanvasElements should handle multiple canvas elements', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas><canvas width="200" height="200"></canvas></body>'
  PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state?.instances.length).toBe(2)
  expect(state?.instances[0].offscreenCanvas.width).toBe(100)
  expect(state?.instances[1].offscreenCanvas.width).toBe(200)
})

test('patchCanvasElements should use default canvas dimensions when attributes not set', () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas></canvas></body>'
  PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state?.instances[0].offscreenCanvas.width).toBe(300)
  expect(state?.instances[0].offscreenCanvas.height).toBe(150)
})
