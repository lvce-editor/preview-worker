import { LazyTransferMessagePortRpcParent, WebWorkerRpcClient } from '@lvce-editor/rpc'
import { DialogWorker, EditorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { registerCommands } from '../PreviewStates/PreviewStates.ts'

export const listen = async (): Promise<void> => {
  registerCommands(CommandMap.commandMap)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RendererWorker.set(rpc)

  const editorRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: (port: any) => RendererWorker.sendMessagePortToEditorWorker(port, 9112),
  })
  EditorWorker.set(editorRpc)

  const dialogRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: RendererWorker.sendMessagePortToDialogWorker,
  })
  DialogWorker.set(dialogRpc)
}
