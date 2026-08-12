import { expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getRuntimeDiagnostics } from '../src/parts/GetRuntimeDiagnostics/GetRuntimeDiagnostics.ts'

test('gets runtime diagnostics from the preview sandbox', async () => {
  const diagnostics = {
    entries: [
      {
        level: 'error',
        message: 'addPipe is not defined',
        type: 'exception',
      },
    ],
    errorCount: 1,
  }
  const invoke = jest.fn(async (..._args: readonly unknown[]) => diagnostics)
  const state = {
    ...createDefaultState(),
    sandboxRpc: { invoke } as any,
    scripts: ['console.log("ready")'],
    uid: 17,
  }

  await expect(getRuntimeDiagnostics(state)).resolves.toBe(diagnostics)
  expect(invoke).toHaveBeenCalledWith('SandBox.getRuntimeDiagnostics', 17)
})

test('returns empty diagnostics when the preview has no scripts', async () => {
  const invoke = jest.fn()
  const state = {
    ...createDefaultState(),
    sandboxRpc: { invoke } as any,
    uid: 18,
  }

  await expect(getRuntimeDiagnostics(state)).resolves.toEqual({
    entries: [],
    errorCount: 0,
  })
  expect(invoke).not.toHaveBeenCalled()
})
