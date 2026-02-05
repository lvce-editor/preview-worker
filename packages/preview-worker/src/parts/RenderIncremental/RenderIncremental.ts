import { ViewletCommand } from '@lvce-editor/constants'
import { diffTree } from '@lvce-editor/virtual-dom-worker'
import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { renderItems } from '../RenderItems/RenderItems.ts'

export const renderIcremental = (oldState: StatusBarState, newState: StatusBarState): any => {
  const oldDom = renderItems(oldState, oldState)[2]
  const newDom = renderItems(newState, newState)[2]
  const patches = diffTree(oldDom, newDom)
  return [ViewletCommand.SetPatches, newState.uid, patches]
}
