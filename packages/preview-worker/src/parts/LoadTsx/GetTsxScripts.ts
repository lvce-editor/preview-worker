import { createTsxBootstrapScript } from './CreateTsxBootstrapScript.ts'
import { transpileTsx } from './TranspileTsx.ts'

export const getTsxScripts = async (source: string): Promise<readonly string[]> => {
  const transpiledSource = await transpileTsx(source)
  const bootstrapSource = createTsxBootstrapScript(transpiledSource)
  return [bootstrapSource]
}
