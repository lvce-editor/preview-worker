import { WebWorkerRpcClient, LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../PreviewStates/PreviewStates.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)

  try {
    await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      send: (port: any) => RendererWorker.sendMessagePortToEditorWorker(port, 0),
    })
  } catch {
    // ignore
  }
}
