import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { set } from '../PreviewStates/PreviewStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: PreviewState = {
    assetDir,
    content: '',
    css: [],
    errorCount: 0,
    errorMessage: '',
    initial: true,
    parsedDom: [],
    parsedNodesChildNodeCount: 0,
    platform,
    scripts: [],
    uid,
    uri,
    warningCount: 0,
  }
  set(uid, state, state)
}
