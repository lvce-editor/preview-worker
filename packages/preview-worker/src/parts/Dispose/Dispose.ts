import { EditorWorker } from '@lvce-editor/rpc-registry'
import * as PreviewStates from '../PreviewStates/PreviewStates.ts'

const EditorChange = 1
const rpcId = 9112

export const dispose = async (uid: number): Promise<void> => {
  const { newState: state } = PreviewStates.get(uid)
  const { sandboxRpc } = state
  PreviewStates.dispose(uid)
  const disposals = [sandboxRpc.dispose()]
  if (PreviewStates.getKeys().length === 0) {
    disposals.push(EditorWorker.invoke('Listener.unregister', EditorChange, rpcId))
  }
  await Promise.all(disposals)
}
