import { ViewletCommand } from '@lvce-editor/constants'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getStatusBarVirtualDom } from '../GetStatusBarVirtualDom/GetStatusBarVirtualDom.ts'

export const renderItems = (oldState: StatusBarState, newState: StatusBarState): any => {
  const { uid } = newState
  const dom = getStatusBarVirtualDom()
  return [ViewletCommand.SetDom2, uid, dom]
}
