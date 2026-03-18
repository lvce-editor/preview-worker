import { RendererWorker } from '@lvce-editor/rpc-registry'
import { resolveScriptUri } from '../ResolveScriptUri/ResolveScriptUri.ts'

const loadRemoteScript = async (uri: string): Promise<string> => {
  const response = await fetch(uri)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${uri}`)
  }
  return response.text()
}

export const loadLinkedScript = async (documentUri: string, src: string): Promise<string> => {
  const scriptUri = resolveScriptUri(documentUri, src)
  if (!scriptUri) {
    return ''
  }
  try {
    if (/^https?:\/\//i.test(scriptUri)) {
      return loadRemoteScript(scriptUri)
    }
    return await RendererWorker.readFile(scriptUri)
  } catch (error) {
    console.error(error)
    return ''
  }
}