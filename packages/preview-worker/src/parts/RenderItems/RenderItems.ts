import { ViewletCommand } from '@lvce-editor/constants'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { getStatusBarVirtualDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

export const renderItems = (oldState: PreviewState, newState: PreviewState): any => {
  const { uid } = newState
  const dom = getStatusBarVirtualDom()
  return [ViewletCommand.SetDom2, uid, dom]
}
