import type { Rpc } from '@lvce-editor/rpc-registry'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const createSandboxRpc = async (): Promise<Rpc> => {
  const sandboxRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: async (port: MessagePort) =>
      await RendererWorker.invokeAndTransfer(
        'SendMessagePortToExtensionHostWorker.sendMessagePortToPreviewSandBoxWorker',
        port,
        'SandBox.handleMessagePort',
      ),
  })
  return sandboxRpc
}
