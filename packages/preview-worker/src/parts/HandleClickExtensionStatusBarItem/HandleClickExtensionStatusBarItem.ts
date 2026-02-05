import { ExtensionHost } from '@lvce-editor/rpc-registry'

export const handleClickExtensionStatusBarItem = async (name: string): Promise<void> => {
  // @ts-ignore
  await ExtensionHost.invoke(`ExtensionHostStatusBar.executeCommand`, name)
}
