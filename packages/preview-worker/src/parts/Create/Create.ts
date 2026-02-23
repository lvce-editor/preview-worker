import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { createSandboxRpc } from '../CreateSandboxRpc/CreateSandboxRpc.ts'
import { set } from '../PreviewStates/PreviewStates.ts'

interface PreviewFeatureOptions {
  readonly loadExternalStyleSheets?: boolean
  readonly loadJavaScript?: boolean
  readonly loadStyleElements?: boolean
}

export const create = async (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  platform: number,
  assetDir: string,
  options: PreviewFeatureOptions = {},
): Promise<void> => {
  const { loadExternalStyleSheets = true, loadJavaScript = true, loadStyleElements = true } = options
  const sandboxRpc = await createSandboxRpc()
  const state: PreviewState = {
    assetDir,
    content: '',
    css: [],
    errorCount: 0,
    errorMessage: '',
    height,
    initial: true,
    listenerId: '',
    loadExternalStyleSheets,
    loadJavaScript,
    loadStyleElements,
    parsedDom: [],
    parsedNodesChildNodeCount: 0,
    platform,
    sandboxRpc,
    scripts: [],
    uid,
    uri,
    warningCount: 0,
    width,
    x,
    y,
  }
  set(uid, state, state)
}
