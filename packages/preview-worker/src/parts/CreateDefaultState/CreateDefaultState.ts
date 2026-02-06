import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const createDefaultState = (): PreviewState => {
  return {
    assetDir: '',
    content: '',
    css: [],
    errorCount: 0,
    errorMessage: '',
    initial: true,
    parsedDom: [],
    parsedNodesChildNodeCount: 0,
    platform: 0,
    uid: 0,
    uri: '',
    warningCount: 0,
  }
}
