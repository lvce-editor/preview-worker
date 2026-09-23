import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { clearOutput, logWarning } from '../src/parts/PreviewSandboxOutput/PreviewSandboxOutput.ts'

test('logWarning forwards diagnostics to the renderer worker', async () => {
  const rpc = RendererWorker.registerMockRpc({
    'Preview.logWarning': () => undefined,
  })

  await logWarning('preview warning')

  expect(rpc.invocations).toEqual([['Preview.logWarning', 'preview warning']])
})

test('clearOutput forwards to the renderer worker', async () => {
  const rpc = RendererWorker.registerMockRpc({
    'Preview.clearOutput': () => undefined,
  })

  await clearOutput()

  expect(rpc.invocations).toEqual([['Preview.clearOutput']])
})
