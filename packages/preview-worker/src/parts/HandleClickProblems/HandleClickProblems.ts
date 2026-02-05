import { RendererWorker } from '@lvce-editor/rpc-registry'

export const handleClickProblems = async (): Promise<void> => {
  // @ts-ignore
  await RendererWorker.invoke('Layout.showPanel')
  // @ts-ignore
  await RendererWorker.invoke('Panel.toggleView', 'Problems')
}
