export interface PreviewState {
  assetDir: string
  errorCount: number
  initial: boolean
  platform: number
  statusBarItemsLeft: readonly unknown[]
  statusBarItemsRight: readonly unknown[]
  uid: number
  warningCount: number
}
