export interface LinkStyleSheet {
  readonly href: string
  readonly type: 'link'
}

export interface StyleElementStyleSheet {
  readonly content: string
  readonly type: 'style'
}

export type StyleSheet = LinkStyleSheet | StyleElementStyleSheet
