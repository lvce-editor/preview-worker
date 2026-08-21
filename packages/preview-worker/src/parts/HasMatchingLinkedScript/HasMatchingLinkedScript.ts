import { isSameUri } from '../HasMatchingLinkedStyleSheet/HasMatchingLinkedStyleSheet.ts'
import { resolveScriptUri } from '../ResolveScriptUri/ResolveScriptUri.ts'
import type { ScriptTag } from '../ScriptTag/ScriptTag.ts'

export const hasMatchingLinkedScript = (documentUri: string, scriptTags: readonly ScriptTag[], changedEditorUri: string): boolean => {
  for (const scriptTag of scriptTags) {
    if (scriptTag.type !== 'external') {
      continue
    }
    const scriptUri = resolveScriptUri(documentUri, scriptTag.src)
    if (scriptUri && isSameUri(scriptUri, changedEditorUri)) {
      return true
    }
  }
  return false
}
