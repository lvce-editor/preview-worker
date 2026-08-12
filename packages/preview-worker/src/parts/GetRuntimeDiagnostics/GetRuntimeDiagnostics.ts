import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const getRuntimeDiagnostics = (state: PreviewState): Promise<unknown> => {
  const { sandboxRpc, scripts, uid } = state
  if (scripts.length === 0) {
    return Promise.resolve({ entries: [], errorCount: 0 })
  }
  return sandboxRpc.invoke('SandBox.getRuntimeDiagnostics', uid)
}
