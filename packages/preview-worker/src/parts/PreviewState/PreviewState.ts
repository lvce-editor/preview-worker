import type { Rpc } from '@lvce-editor/rpc'
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'

export interface PreviewState {
  readonly assetDir: string
  readonly content: string
  readonly css: readonly string[]
  readonly errorCount: number
  readonly errorMessage: string
  readonly height: number
  readonly initial: boolean
  readonly listenerId: string
  readonly loadExternalStyleSheets: boolean
  readonly loadJavaScript: boolean
  readonly loadStyleElements: boolean
  readonly parsedDom: readonly VirtualDomNode[]
  readonly parsedNodesChildNodeCount: number
  readonly platform: number
  readonly sandboxRpc: Rpc
  readonly scripts: readonly string[]
  readonly styleSheets: readonly StyleSheet[]
  readonly uid: number
  readonly uri: string
  readonly warningCount: number
  readonly width: number
  readonly x: number
  readonly y: number
}
