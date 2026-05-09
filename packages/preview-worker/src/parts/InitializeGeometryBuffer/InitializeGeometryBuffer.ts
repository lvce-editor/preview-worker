import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { createGeometryBuffer } from '../CreateGeometryBuffer/CreateGeometryBuffer.ts'

export const initializeGeometryBuffer = async (state: PreviewState, elementCount: number = 1024): Promise<PreviewState> => {
  const geometryBuffer = createGeometryBuffer(elementCount)
  await state.sandboxRpc.invoke('SandBox.setGeometryBuffer', state.uid, geometryBuffer)
  return {
    ...state,
    geometryBuffer,
  }
}
