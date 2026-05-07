/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const getGeometryBuffer = (state: PreviewState): ArrayBuffer | SharedArrayBuffer | null => {
  return state.geometryBuffer
}
