import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { ScriptTag } from '../ScriptTag/ScriptTag.ts'
import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'

export interface ParseResult {
  readonly css: readonly string[]
  readonly dom: readonly VirtualDomNode[]
  readonly scripts: readonly string[]
  readonly scriptTags: readonly ScriptTag[]
  readonly styleSheets: readonly StyleSheet[]
  readonly stylesheets: readonly string[]
}
