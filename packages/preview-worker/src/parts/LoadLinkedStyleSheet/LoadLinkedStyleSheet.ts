import { RendererWorker } from '@lvce-editor/rpc-registry'
import { resolveStylesheetUri } from '../ResolveStylesheetUri/ResolveStylesheetUri'

export const loadLinkedStyleSheet = async (documentUri: string, href: string): Promise<string> => {
  const stylesheetUri = resolveStylesheetUri(documentUri, href)
  if (!stylesheetUri) {
    return ''
  }
  try {
    return await RendererWorker.readFile(stylesheetUri)
  } catch (error) {
    console.error(error)
    return ''
  }
}
