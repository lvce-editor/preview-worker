import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'

type State = StatusBarState.StatusBarState & {
  disposed?: boolean
}

export const updateStatusBarItems = async (state: Readonly<State>): Promise<State> => {
  const newState = await LoadContent.loadContent(state)
  return newState
}
