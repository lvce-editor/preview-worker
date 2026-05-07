import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const createDefaultState = (): PreviewState => {
  return {
    assetDir: '',
    content: '',
    css: [],
    errorCount: 0,
    errorMessage: '',
    geometryBuffer: null,
    height: 0,
    initial: true,
    listenerId: '',
    loadExternalStyleSheets: true,
    loadJavaScript: true,
    loadStyleElements: true,
    parsedDom: [],
    parsedNodesChildNodeCount: 0,
    platform: 0,
    sandboxRpc: null as any,
    scripts: [],
    styleSheets: [],
    uid: 0,
    uri: '',
    warningCount: 0,
    width: 0,
    x: 0,
    y: 0,
  }
}
