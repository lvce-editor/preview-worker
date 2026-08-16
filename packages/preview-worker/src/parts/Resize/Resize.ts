import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const resize = async (state: PreviewState, dimensions: any): Promise<PreviewState> => {
  const { sandboxRpc, uid } = state
  await sandboxRpc.invoke('SandBox.resize', uid, dimensions)
  return {
    ...state,
    ...dimensions,
  }
}
