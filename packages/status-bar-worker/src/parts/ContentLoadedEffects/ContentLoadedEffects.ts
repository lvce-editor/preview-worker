import type * as StatusBarState from '../StatusBarState/StatusBarState.ts'
import * as ExtensionHostStatusBarItems from '../ExtensionHost/ExtensionHostStatusBarItems.ts'
import * as UpdateStatusBarItems from '../UpdateStatusBarItems/UpdateStatusBarItems.ts'

type State = StatusBarState.StatusBarState & {
  disposed?: boolean
}

export const contentLoadedEffects = (state: Readonly<State>): void => {
  // TODO dispose listener
  const handleChange = async (): Promise<void> => {
    if (state.disposed) {
      return
    }
    await UpdateStatusBarItems.updateStatusBarItems(state)
  }
  // maybe return cleanup function from here like react hooks
  void ExtensionHostStatusBarItems.onChange(handleChange)
}
