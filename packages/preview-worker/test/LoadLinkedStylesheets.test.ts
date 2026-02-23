import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadLinkedStylesheets from '../src/parts/LoadLinkedStylesheets/LoadLinkedStylesheets.ts'

test('loadLinkedStylesheets should load local relative stylesheets', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === '/tmp/app.css') {
        return 'body { color: red; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadLinkedStylesheets.loadLinkedStylesheets('/tmp/index.html', ['./app.css'])

  expect(result).toEqual(['body { color: red; }'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', '/tmp/app.css']])
})

test('loadLinkedStylesheets should ignore external stylesheets', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': () => {
      throw new Error('should not be called')
    },
  })

  const result = await LoadLinkedStylesheets.loadLinkedStylesheets('/tmp/index.html', ['https://example.com/app.css'])

  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('loadLinkedStylesheets should block absolute filesystem stylesheet paths', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': () => {
      throw new Error('should not be called')
    },
  })

  const result = await LoadLinkedStylesheets.loadLinkedStylesheets('/tmp/index.html', ['/tmp/app.css'])

  expect(result).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('loadLinkedStylesheets should continue when stylesheet is missing', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === '/tmp/present.css') {
        return 'h1 { color: blue; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadLinkedStylesheets.loadLinkedStylesheets('/tmp/index.html', ['./missing.css', './present.css'])

  expect(result).toEqual(['h1 { color: blue; }'])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readFile', '/tmp/missing.css'],
    ['FileSystem.readFile', '/tmp/present.css'],
  ])
})

test('loadLinkedStylesheets should resolve relative stylesheets from memfs document uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === 'memfs://workspace/app.css') {
        return 'body { color: green; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadLinkedStylesheets.loadLinkedStylesheets('memfs://workspace/index.html', ['./app.css'])

  expect(result).toEqual(['body { color: green; }'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', 'memfs://workspace/app.css']])
})

test('loadLinkedStylesheets should allow absolute custom scheme stylesheet uris', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === 'memfs://workspace/theme.css') {
        return 'h1 { color: purple; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadLinkedStylesheets.loadLinkedStylesheets('/tmp/index.html', ['memfs://workspace/theme.css'])

  expect(result).toEqual(['h1 { color: purple; }'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', 'memfs://workspace/theme.css']])
})
