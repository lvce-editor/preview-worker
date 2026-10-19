import { expect, test } from '@jest/globals'
import { mockWorkerGlobalRpc } from '@lvce-editor/rpc'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as Main from '../src/parts/Main/Main.ts'
import { getCommandIds } from '../src/parts/PreviewStates/PreviewStates.ts'

test('main', async () => {
  const { dispose, start } = mockWorkerGlobalRpc()
  const mainPromise = Main.main()
  start()
  await expect(mainPromise).resolves.toBeUndefined()
  dispose()

  const commandIds = getCommandIds()
  expect(commandIds).toContain('handleInput')
  expect(commandIds).toContain('rerender')
  // Renderer-side view commands must not shadow these worker-to-renderer RPCs.
  expect(commandIds).not.toContain('logWarning')
  expect(commandIds).not.toContain('clearOutput')
  expect(commandIds).not.toContain('handleMessagePort')
  expect(commandMap['Preview.logWarning']).toBeDefined()
  expect(commandMap['Preview.clearOutput']).toBeDefined()
  expect(commandMap['Preview.handleMessagePort']).toBeDefined()
})
