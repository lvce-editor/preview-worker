import { RendererWorker } from '@lvce-editor/rpc-registry'
import { resolveStylesheetUri } from './resolveStylesheetUri/resolveStylesheetUri'

export const loadLinkedStylesheets = async (documentUri: string, hrefs: readonly string[]): Promise<readonly string[]> => {
  const css: string[] = []
  for (const href of hrefs) {
    const stylesheetUri = resolveStylesheetUri(documentUri, href)
    if (!stylesheetUri) {
      continue
    }
    try {
      const stylesheetContent = await RendererWorker.readFile(stylesheetUri)
      css.push(stylesheetContent)
    } catch (error) {
      console.error(error)
      // Ignore missing or unreadable stylesheets so preview still renders
    }
  }
  return css
}
