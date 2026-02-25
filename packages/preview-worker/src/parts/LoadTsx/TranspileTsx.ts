import { ensureComponentExport } from './EnsureComponentExport.ts'
import { getBabel } from './GetBabel.ts'

export const transpileTsx = async (source: string): Promise<string> => {
  const normalizedSource = ensureComponentExport(source)
  const babel = await getBabel()
  const result = babel.transform(normalizedSource, {
    presets: [
      ['typescript', { allExtensions: true, isTSX: true }],
      ['react', { runtime: 'classic' }],
    ],
    sourceType: 'script',
  })
  if (!result.code) {
    throw new Error('Failed to transpile TSX preview source')
  }
  return result.code
}
