import { expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { waitForMutation } from '../src/parts/WaitForMutation/WaitForMutation.ts'

test('waitForMutation should resolve when selector is found in sandbox serialized dom', async () => {
  const sandboxRpc = {
    invoke: jest
      .fn()
      .mockResolvedValueOnce({ dom: [{ type: 1 }] })
      .mockResolvedValueOnce({ dom: [{ id: 'jsx-heading', type: 1 }] }),
  }

  const state = {
    ...createDefaultState(),
    sandboxRpc: sandboxRpc as any,
    uid: 7,
  }

  const result = await waitForMutation(state, { selector: '#jsx-heading', timeout: 100 })

  expect(result).toBe(state)
  expect(sandboxRpc.invoke).toHaveBeenCalledWith('SandBox.getSerializedDom', 7)
})

test('waitForMutation should throw for unsupported selector syntax', async () => {
  const sandboxRpc = {
    invoke: jest.fn().mockResolvedValue({ dom: [] }),
  }

  const state = {
    ...createDefaultState(),
    sandboxRpc: sandboxRpc as any,
    uid: 7,
  }

  await expect(waitForMutation(state, { selector: '[data-id="1"]', timeout: 10 })).rejects.toThrow(
    'Unsupported selector "[data-id="1"]". Supported selectors: #id, .class, tag',
  )
})
