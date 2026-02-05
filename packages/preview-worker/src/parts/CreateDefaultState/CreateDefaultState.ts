import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const createDefaultState = (): PreviewState => {
  return {
    assetDir: '',
    content: '',
    errorCount: 0,
    initial: true,
    parsedDom: [],
    platform: 0,
    uid: 0,
    uri: '',
    warningCount: 0,
  }
}
