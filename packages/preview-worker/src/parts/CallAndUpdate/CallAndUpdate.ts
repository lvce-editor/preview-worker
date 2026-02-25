import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const callAndUpdate = async (state: PreviewState, method: string, ...args: readonly any[]): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke(method, uid, ...args)
  return state
}
