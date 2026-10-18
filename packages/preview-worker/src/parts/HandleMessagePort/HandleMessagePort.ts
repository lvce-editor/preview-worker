import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpc.create({
    commandMap: PreviewStates.createDirectEventCommandMap((uid) => RendererWorker.invoke('Viewlet.requestRender', uid)),
    messagePort: port,
  })
  RendererProcess.set(rpc)
}
