import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const createSandboxRpc = async (): Promise<any> => {
  const sandboxRpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: (port: any) => RendererWorker.invoke('SendMessagePortToSandboxWorker', port),
  })
  return sandboxRpc
}
