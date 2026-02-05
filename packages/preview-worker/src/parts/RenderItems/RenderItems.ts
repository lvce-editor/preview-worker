import { ViewletCommand } from '@lvce-editor/constants'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { getPreviewDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

export const renderItems = (oldState: PreviewState, newState: PreviewState): any => {
  const { uid } = newState
  const dom = getPreviewDom()
  return [ViewletCommand.SetDom2, uid, dom]
}
