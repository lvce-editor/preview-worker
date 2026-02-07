import { PlainMessagePortRpc } from '@lvce-editor/rpc'

export const handleMessagePort = async (port: MessagePort): Promise<void> => {
  console.log('got port')
  await PlainMessagePortRpc.create({
    commandMap: {},
    isMessagePortOpen: true,
    messagePort: port,
  })
}
