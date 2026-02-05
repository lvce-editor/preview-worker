import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const createDefaultState = (): PreviewState => {
  return {
    assetDir: '',
    errorCount: 0,
    initial: true,
    platform: 0,
    uid: 0,
    uri: '',
    warningCount: 0,
  }
}
