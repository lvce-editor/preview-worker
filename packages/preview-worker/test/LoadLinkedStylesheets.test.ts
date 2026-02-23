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
