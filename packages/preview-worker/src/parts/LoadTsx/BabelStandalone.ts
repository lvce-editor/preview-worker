export interface BabelStandalone {
  transform: (code: string, options: object) => { readonly code?: string | null }
}
