import { RendererWorker } from '@lvce-editor/rpc-registry'

export const logWarning = async (message: string): Promise<void> => {
  await RendererWorker.invoke('Preview.logWarning', message)
}

export const clearOutput = async (): Promise<void> => {
  await RendererWorker.invoke('Preview.clearOutput')
}
