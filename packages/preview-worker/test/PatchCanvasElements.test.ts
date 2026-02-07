import { afterEach, beforeAll, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { Window } from 'happy-dom-without-node'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import { executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'
import * as PatchCanvasElements from '../src/parts/PatchCanvasElements/PatchCanvasElements.ts'

// OffscreenCanvas is a Web Worker API not available in Node.js
// Provide a minimal mock for testing
class MockOffscreenCanvas {
  width: number
  height: number
  readonly oncontextlost: ((this: any, ev: readonly Event) => any) | null = null
  readonly oncontextrestored: ((this: any, ev: readonly Event) => any) | null = null

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  getContext(_type: string): any {
    return {
      arc: (): void => {},
      beginPath: (): void => {},
      clearRect: (): void => {},
      closePath: (): void => {},
      fill: (): void => {},
      fillRect: (): void => {},
      fillStyle: '',
      fillText: (): void => {},
      font: '',
      lineTo: (): void => {},
      moveTo: (): void => {},
      stroke: (): void => {},
      strokeStyle: '',
    }
  }

  transferToImageBitmap(): any {
    return {}
  }

  async convertToBlob(): Promise<Blob> {
    return new Blob()
  }

  addEventListener(_type: readonly string, _listener: any, _options?: boolean | AddEventListenerOptions): void {}

  removeEventListener(_type: readonly string, _listener: any, _options?: boolean | EventListenerOptions): void {}

  dispatchEvent(_event: readonly Event): boolean {
    return true
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

test('patchCanvasElements should do nothing when no canvas elements exist', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><div>hello</div></body>'
  await PatchCanvasElements.patchCanvasElements(document, 1)
  expect(CanvasState.get(1)).toBeUndefined()
})

test('patchCanvasElements should create OffscreenCanvas for canvas element', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(320, 480)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state).toBeDefined()
  expect(state?.instances.length).toBe(1)
  expect(state?.instances[0].offscreenCanvas).toBe(mockOffscreenCanvas)
})

test('patchCanvasElements should make getContext return a real 2d context', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(320, 480)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const ctx = canvas.getContext('2d')
  expect(ctx).toBeDefined()
  expect(typeof ctx.fillRect).toBe('function')
  expect(typeof ctx.clearRect).toBe('function')
  expect(typeof ctx.arc).toBe('function')
  expect(typeof ctx.beginPath).toBe('function')
  expect(typeof ctx.fillText).toBe('function')
})

test('patchCanvasElements should return undefined for non-2d context', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas id="game" width="320" height="480"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(320, 480)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 1)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  const ctx = canvas.getContext('webgl')
  expect(ctx).toBeUndefined()
})

test('patchCanvasElements should handle multiple canvas elements', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas><canvas width="200" height="200"></canvas></body>'
  const mockOffscreenCanvas1 = new MockOffscreenCanvas(100, 100)
  const mockOffscreenCanvas2 = new MockOffscreenCanvas(200, 200)
  const canvases = [mockOffscreenCanvas1, mockOffscreenCanvas2]
  let callIndex = 0
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, canvases[callIndex], callIndex)
      callIndex++
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const state = CanvasState.get(1)
  expect(state?.instances.length).toBe(2)
  expect(state?.instances[0].offscreenCanvas).toBe(mockOffscreenCanvas1)
  expect(state?.instances[1].offscreenCanvas).toBe(mockOffscreenCanvas2)
})

test('patchCanvasElements should set __canvasId on canvas elements', async () => {
  const window = new Window({ url: 'https://localhost:3000' })
  const { document } = window
  document.documentElement.innerHTML = '<body><canvas width="100" height="100"></canvas></body>'
  const mockOffscreenCanvas = new MockOffscreenCanvas(100, 100)
  using _mockRpc = RendererWorker.registerMockRpc({
    'OffscreenCanvas.createForPreview': (id: number) => {
      executeCallback(id, mockOffscreenCanvas, 42)
    },
  })
  await PatchCanvasElements.patchCanvasElements(document, 1)
  const canvas = document.querySelector('canvas') as any
  expect(canvas.__canvasId).toBeDefined()
  expect(typeof canvas.__canvasId).toBe('number')
})
