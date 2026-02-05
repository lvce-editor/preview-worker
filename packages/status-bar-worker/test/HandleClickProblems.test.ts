import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickProblems from '../src/parts/HandleClickProblems/HandleClickProblems.ts'

test('handleClickProblems should call Layout.showPanel', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toContainEqual(['Layout.showPanel'])
})

test('handleClickProblems should call Panel.toggleView with Problems', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toContainEqual(['Panel.toggleView', 'Problems'])
})

test('handleClickProblems should call Layout.showPanel and Panel.toggleView in order', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.showPanel': async () => {},
    'Panel.toggleView': async () => {},
  })

  await HandleClickProblems.handleClickProblems()

  expect(mockRpc.invocations).toEqual([['Layout.showPanel'], ['Panel.toggleView', 'Problems']])
})
