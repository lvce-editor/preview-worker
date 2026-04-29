import { expect, test } from '@jest/globals'
import type { PreviewState } from '../src/parts/PreviewState/PreviewState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadScripts from '../src/parts/LoadScripts/LoadScripts.ts'

test('loadScripts should load content in sandbox and update dom from serialized result', async () => {
  const invocations: readonly any[][] = []
  const serialized = {
    dom: [
      { childCount: 0, type: 1 },
      { childCount: 0, type: 1 },
    ],
  }
  const sandboxRpc = {
    invoke: async (...args: readonly any[]): Promise<any> => {
      ;(invocations as any[]).push(args)
      if (args[0] === 'SandBox.getSerializedDom') {
        return serialized
      }
      return undefined
    },
  }

  const state: PreviewState = {
    ...createDefaultState(),
    errorMessage: 'previous error',
    height: 480,
    parsedDom: [{ childCount: 1, type: 1 }],
    parsedNodesChildNodeCount: 1,
    sandboxRpc: sandboxRpc as any,
    uid: 7,
    width: 640,
  }

  const content = '<div></div>'
  const css = ['body{color:red;}']
  const scripts = ['console.log(1)']
  const result = await LoadScripts.loadScripts(state, content, css, scripts)

  expect(invocations).toEqual([
    ['SandBox.loadContent', 7, 640, 480, content, scripts],
    ['SandBox.getSerializedDom', 7],
  ])
  expect(result.content).toBe(content)
  expect(result.css).toBe(css)
  expect(result.scripts).toBe(scripts)
  expect(result.errorMessage).toBe('')
  expect(result.parsedDom).toBe(serialized.dom)
  expect(result.parsedNodesChildNodeCount).toBe(2)
})
