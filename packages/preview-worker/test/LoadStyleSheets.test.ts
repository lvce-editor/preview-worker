import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadStyleSheets from '../src/parts/LoadStyleSheets/LoadStyleSheets.ts'

test('loadStyleSheets should preserve style and link order', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === '/tmp/app.css') {
        return '#target { color: red; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadStyleSheets.loadStyleSheets(
    '/tmp/index.html',
    [
      { content: '#target { color: blue; }', type: 'style' },
      { href: './app.css', type: 'link' },
      { content: '#target { font-weight: bold; }', type: 'style' },
    ],
    true,
    true,
  )

  expect(result).toEqual(['#target { color: blue; }', '#target { color: red; }', '#target { font-weight: bold; }'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', '/tmp/app.css']])
})

test('loadStyleSheets should skip style entries when style elements are disabled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': (uri: string) => {
      if (uri === '/tmp/app.css') {
        return 'body { color: green; }'
      }
      throw new Error('file not found')
    },
  })

  const result = await LoadStyleSheets.loadStyleSheets(
    '/tmp/index.html',
    [
      { content: 'body { color: red; }', type: 'style' },
      { href: './app.css', type: 'link' },
    ],
    true,
    false,
  )

  expect(result).toEqual(['body { color: green; }'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readFile', '/tmp/app.css']])
})

test('loadStyleSheets should skip link entries when external stylesheets are disabled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': () => {
      throw new Error('should not be called')
    },
  })

  const result = await LoadStyleSheets.loadStyleSheets(
    '/tmp/index.html',
    [
      { content: 'body { color: red; }', type: 'style' },
      { href: './app.css', type: 'link' },
    ],
    false,
    true,
  )

  expect(result).toEqual(['body { color: red; }'])
  expect(mockRpc.invocations).toEqual([])
})

test('loadStyleSheets should block absolute filesystem stylesheet links', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile': () => {
      throw new Error('should not be called')
    },
  })

  const result = await LoadStyleSheets.loadStyleSheets(
    '/tmp/index.html',
    [
      { content: 'body { color: red; }', type: 'style' },
      { href: '/tmp/app.css', type: 'link' },
    ],
    true,
    true,
  )

  expect(result).toEqual(['body { color: red; }'])
  expect(mockRpc.invocations).toEqual([])
})
