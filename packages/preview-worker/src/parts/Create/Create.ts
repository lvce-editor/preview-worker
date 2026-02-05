import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { set } from '../PreviewStates/PreviewStates.ts'

export const create = (uid: number, uri: string, x: number, y: number, width: number, height: number, platform: number, assetDir: string): void => {
  const state: PreviewState = {
    assetDir,
    content: '',
    errorCount: 0,
    initial: true,
    parsedDom: [],
    platform,
    uid,
    uri,
    warningCount: 0,
  }
  set(uid, state, state)
}
