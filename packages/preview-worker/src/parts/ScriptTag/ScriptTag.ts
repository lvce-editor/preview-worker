interface InlineScriptTag {
  readonly content: string
  readonly type: 'inline'
}

interface ExternalScriptTag {
  readonly src: string
  readonly type: 'external'
}

export type ScriptTag = InlineScriptTag | ExternalScriptTag
