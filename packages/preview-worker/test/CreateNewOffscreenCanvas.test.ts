/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import { afterEach, beforeAll, describe, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CanvasState from '../src/parts/CanvasState/CanvasState.ts'
import { executeCallback } from '../src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts'
import { createNewOffscreenCanvas, toNumber } from '../src/parts/CreateNewOffscreenCanvas/CreateNewOffscreenCanvas.ts'

// OffscreenCanvas is a Web Worker API not available in Node.js
// Provide a minimal mock for testing
class MockOffscreenCanvas {
  width: number
  height: number
  readonly oncontextlost: ((this: any, ev: Readonly<Event>) => any) | null = null
  readonly oncontextrestored: ((this: any, ev: Readonly<Event>) => any) | null = null

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

  addEventListener(_type: string, _listener: any, _options?: Readonly<boolean | AddEventListenerOptions>): void {}

  removeEventListener(_type: string, _listener: any, _options?: Readonly<boolean | EventListenerOptions>): void {}

  dispatchEvent(_event: Readonly<Event>): boolean {
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

describe('toNumber', () => {
  test('should return the same number if input is already a number', () => {
    expect(toNumber(42)).toBe(42)
    expect(toNumber(0)).toBe(0)
    expect(toNumber(3.14)).toBe(3.14)
  })

  test('should parse string numbers correctly', () => {
    expect(toNumber('42')).toBe(42)
    expect(toNumber('100')).toBe(100)
    expect(toNumber('0')).toBe(0)
  })

  test('should return 0 for invalid strings', () => {
    expect(toNumber('abc')).toBe(0)
    expect(toNumber('not a number')).toBe(0)
    expect(toNumber('')).toBe(0)
  })

  test('should handle negative numbers', () => {
    expect(toNumber(-42)).toBe(-42)
    expect(toNumber('-42')).toBe(-42)
  })
})

describe('createNewOffscreenCanvas', () => {
  test('should create a new offscreen canvas with valid dimensions', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element, offscreenCanvas: new MockOffscreenCanvas(100, 100) }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    await createNewOffscreenCanvas(200, 150, element, 1)

    const state = CanvasState.get(1)
    expect(state?.instances[0].offscreenCanvas).toBe(mockOffscreenCanvas)
  })

  test('should update getContext on the element', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element, offscreenCanvas: new MockOffscreenCanvas(100, 100) }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    await createNewOffscreenCanvas(200, 150, element, 1)

    const ctx = element.getContext('2d')
    expect(ctx).toBeDefined()
    expect(typeof ctx.arc).toBe('function')
  })

  test('should return undefined for non-2d context types', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element, offscreenCanvas: new MockOffscreenCanvas(100, 100) }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    await createNewOffscreenCanvas(200, 150, element, 1)

    const ctx = element.getContext('webgl')
    expect(ctx).toBeUndefined()
  })

  test('should call onCanvasDimensionsChange callback if provided', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)
    const element = {} as any
    const callbackSpy: Array<{ width: number; height: number }> = []

    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element, offscreenCanvas: new MockOffscreenCanvas(100, 100) }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    const callback = async (_element: any, width: number, height: number) => {
      callbackSpy.push({ width, height })
    }

    await createNewOffscreenCanvas(200, 150, element, 1, callback)

    expect(callbackSpy.length).toBe(1)
    expect(callbackSpy[0]).toEqual({ width: 200, height: 150 })
  })

  test('should not call callback if not provided', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element, offscreenCanvas: new MockOffscreenCanvas(100, 100) }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    await createNewOffscreenCanvas(200, 150, element, 1)

    expect(element.getContext('2d')).toBeDefined()
  })

  test('should do nothing when width is invalid (NaN)', async () => {
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [] })

    await createNewOffscreenCanvas(Number.NaN, 150, element, 1)

    const ctx = element.getContext?.('2d')
    expect(ctx).toBeUndefined()
  })

  test('should do nothing when height is invalid (NaN)', async () => {
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [] })

    await createNewOffscreenCanvas(200, Number.NaN, element, 1)

    const ctx = element.getContext?.('2d')
    expect(ctx).toBeUndefined()
  })

  test('should do nothing when width is zero or negative', async () => {
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [] })

    await createNewOffscreenCanvas(0, 150, element, 1)

    const ctx = element.getContext?.('2d')
    expect(ctx).toBeUndefined()
  })

  test('should do nothing when height is zero or negative', async () => {
    const element = {} as any

    CanvasState.set(1, { animationFrameHandles: [], instances: [] })

    await createNewOffscreenCanvas(200, -150, element, 1)

    const ctx = element.getContext?.('2d')
    expect(ctx).toBeUndefined()
  })

  test('should update CanvasState instance correctly', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(250, 200)
    const element = {} as any
    const originalCanvas = new MockOffscreenCanvas(100, 100)

    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element, offscreenCanvas: originalCanvas }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    await createNewOffscreenCanvas(250, 200, element, 1)

    const state = CanvasState.get(1)
    expect(state?.instances[0].offscreenCanvas).not.toBe(originalCanvas)
    expect(state?.instances[0].offscreenCanvas).toBe(mockOffscreenCanvas)
  })

  test('should handle element not found in CanvasState', async () => {
    const mockOffscreenCanvas = new MockOffscreenCanvas(200, 150)
    const element = {} as any
    const otherElement = {} as any

    // Create state with a different element
    CanvasState.set(1, { animationFrameHandles: [], instances: [{ element: otherElement, offscreenCanvas: new MockOffscreenCanvas(100, 100) }] })

    using _mockRpc = RendererWorker.registerMockRpc({
      'OffscreenCanvas.createForPreview': (id: number) => {
        executeCallback(id, mockOffscreenCanvas, 1)
      },
    })

    await createNewOffscreenCanvas(200, 150, element, 1)

    // Should still update the element's getContext
    const ctx = element.getContext('2d')
    expect(ctx).toBeDefined()
  })
})
