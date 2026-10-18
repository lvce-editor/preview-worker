import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'

export const {
  createDirectEventCommandMap,
  dispose,
  get,
  getCommandIds,
  getKeys,
  registerCommands,
  set,
  wrapCommand: wrapObserver,
  wrapGetter,
  wrapSerialCommand: wrapCommand,
} = ViewletRegistry.create<PreviewState>()
