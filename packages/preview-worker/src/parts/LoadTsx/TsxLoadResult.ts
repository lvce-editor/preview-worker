import type { PreviewState } from '../PreviewState/PreviewState.ts'

export interface TsxLoadResult {
  readonly content: string
  readonly css: readonly string[]
  readonly errorMessage: string
  readonly parsedDom: PreviewState['parsedDom']
  readonly parsedNodesChildNodeCount: number
  readonly scripts: readonly string[]
  readonly styleSheets: PreviewState['styleSheets']
}
