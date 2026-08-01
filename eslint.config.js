import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'

export default defineConfig([
  {
    ignores: ['**/coverage/**'],
  },
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  ...tsconfig.default,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: [
      'packages/preview-worker/src/parts/GetGeometryBuffer/GetGeometryBuffer.ts',
      'packages/preview-worker/src/parts/GetOffscreenCanvas/GetOffscreenCanvas.ts',
      'packages/preview-worker/src/parts/HandleEditorChanged/HandleEditorChanged.ts',
      'packages/preview-worker/src/parts/HandleFileEdited/HandleFileEdited.ts',
      'packages/preview-worker/src/parts/Id/Id.ts',
      'packages/preview-worker/src/parts/InitializeGeometryBuffer/InitializeGeometryBuffer.ts',
      'packages/preview-worker/src/parts/LoadContent/LoadContent.ts',
      'packages/preview-worker/src/parts/LoadTsx/GetBabel.ts',
      'packages/preview-worker/src/parts/LoadTsx/LoadTsx.ts',
      'packages/preview-worker/src/parts/Rerender/Rerender.ts',
    ],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: ['packages/preview-worker/test/**/*.ts'],
    rules: {
      'virtual-dom/no-inline-style': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
      'virtual-dom/prefer-state-destructuring': 'off',
      'virtual-dom/valid-child-count': 'off',
    },
  },
])
