import type { StatusBarState } from '../StatusBarState/StatusBarState.ts'
import { getMatchingItem } from '../GetMatchingItem/GetMatchingItem.ts'
import { handleClickExtensionStatusBarItem } from '../HandleClickExtensionStatusBarItem/HandleClickExtensionStatusBarItem.ts'
import { handleClickNotification } from '../HandleClickNotification/HandleClickNotification.ts'
import { handleClickProblems } from '../HandleClickProblems/HandleClickProblems.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleClick = async (state: StatusBarState, name: string): Promise<StatusBarState> => {
  if (!name) {
    return state
  }
  const { statusBarItemsLeft, statusBarItemsRight } = state

  const item = getMatchingItem(statusBarItemsLeft, statusBarItemsRight, name)
  if (!item) {
    return state
  }
  if (item.name === InputName.Notifications) {
    await handleClickNotification()
  } else if (item.name === InputName.Problems) {
    await handleClickProblems()
  } else {
    await handleClickExtensionStatusBarItem(name)
  }
  // TODO
  // sendExtensionWorker([/* statusBarItemHandleClick */ 7657, /* name */ name])
  return state
}
