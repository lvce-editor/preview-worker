import { isSameUri } from '../HasMatchingLinkedStyleSheet/HasMatchingLinkedStyleSheet.ts'
import type { ScriptTag } from '../ScriptTag/ScriptTag.ts'
import { loadLinkedScript } from '../LoadLinkedScript/LoadLinkedScript.ts'
import { resolveScriptUri } from '../ResolveScriptUri/ResolveScriptUri.ts'

interface EditorOverride {
  readonly content: string
  readonly uri: string
}

export const loadScriptTags = async (
  documentUri: string,
  scriptTags: readonly ScriptTag[],
  editorOverride?: EditorOverride,
): Promise<readonly string[]> => {
  const scripts: string[] = []
  for (const scriptTag of scriptTags) {
    if (scriptTag.type === 'inline') {
      if (scriptTag.content.trim()) {
        scripts.push(scriptTag.content)
      }
      continue
    }
    const scriptUri = resolveScriptUri(documentUri, scriptTag.src)
    const loadedScript =
      editorOverride && scriptUri && isSameUri(scriptUri, editorOverride.uri)
        ? editorOverride.content
        : await loadLinkedScript(documentUri, scriptTag.src)
    if (loadedScript.trim()) {
      scripts.push(loadedScript)
    }
  }
  return scripts
}
