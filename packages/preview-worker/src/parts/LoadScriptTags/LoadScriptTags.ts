import type { ScriptTag } from '../ScriptTag/ScriptTag.ts'
import { loadLinkedScript } from '../LoadLinkedScript/LoadLinkedScript.ts'

export const loadScriptTags = async (documentUri: string, scriptTags: readonly ScriptTag[]): Promise<readonly string[]> => {
  const scripts: string[] = []
  for (const scriptTag of scriptTags) {
    if (scriptTag.type === 'inline') {
      if (scriptTag.content.trim()) {
        scripts.push(scriptTag.content)
      }
      continue
    }
    const loadedScript = await loadLinkedScript(documentUri, scriptTag.src)
    if (loadedScript.trim()) {
      scripts.push(loadedScript)
    }
  }
  return scripts
}