import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadLinkedStyleSheet from '../src/parts/LoadLinkedStyleSheet/LoadLinkedStyleSheet.ts'

test('loadLinkedStyleSheet should read local relative stylesheet', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === '/tmp/app.css') {
        return 'body { color: red; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadLinkedStyleSheet.loadLinkedStyleSheet('/tmp/index.html', './app.css')
  expect(result).toBe('body { color: red; }')
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', '/tmp/app.css']])
})

test('loadLinkedStyleSheet should return empty for external http href', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': () => {
      throw new Error('should not be called')
    },
  })

  const result = await LoadLinkedStyleSheet.loadLinkedStyleSheet('/tmp/index.html', 'https://example.com/app.css')
  expect(result).toBe('')
  expect(mockRpc.invocations).toEqual([])
})
