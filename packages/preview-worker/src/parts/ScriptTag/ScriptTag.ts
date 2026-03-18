export interface InlineScriptTag {
  readonly content: string
  readonly type: 'inline'
}

export interface ExternalScriptTag {
  readonly src: string
  readonly type: 'external'
}

export type ScriptTag = InlineScriptTag | ExternalScriptTag
