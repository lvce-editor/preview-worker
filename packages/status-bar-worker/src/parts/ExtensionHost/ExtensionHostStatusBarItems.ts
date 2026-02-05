import * as ExtensionHostActivationEvent from '../ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as Listener from '../Listener/Listener.ts'
import * as ExtensionHostShared from './ExtensionHostShared.ts'

export const state: {
  changeListeners: any[]
} = {
  changeListeners: [],
}

const combineResults = (results: readonly any[]): any[] => {
  return results.flat()
}

export const getStatusBarItems = (assetDir: string, platform: number): Promise<any[]> => {
  return ExtensionHostShared.executeProviders({
    assetDir,
    combineResults,
    event: ExtensionHostActivationEvent.OnStatusBarItem,
    method: ExtensionHostCommandType.GetStatusBarItems,
    noProviderFoundMessage: 'No status bar item provider found',
    noProviderFoundResult: [],
    params: [],
    platform,
  })
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
type ListenerFunction = (...args: any[]) => any

// TODO add function to dispose listener
export const onChange = (listener: ListenerFunction): Promise<any> => {
  const id = Listener.register(listener)
  return ExtensionHostShared.execute({
    method: ExtensionHostCommandType.RegisterStatusBarChangeListener,
    params: [id],
  })
}
