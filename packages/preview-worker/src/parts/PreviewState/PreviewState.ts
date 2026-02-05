import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'

export interface PreviewState {
  readonly assetDir: string
  readonly content: string
  readonly errorCount: number
  readonly errorMessage: string
  readonly initial: boolean
  readonly parsedDom: readonly VirtualDomNode[]
  readonly parsedNodesChildNodeCount: number
  readonly platform: number
  readonly uid: number
  readonly uri: string
  readonly warningCount: number
}
