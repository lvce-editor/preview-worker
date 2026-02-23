import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions'
import * as tsconfig from '@lvce-editor/eslint-plugin-tsconfig'

<<<<<<< HEAD
export default [...config.default, ...actions.default, ...tsconfig.default]
=======
export default [
  ...config.default,
  ...actions.default,
  ...tsconfig.default,
  {
    rules: {
      'tsconfig/dont-skip-lib-check': 'off',
      'unicorn/consistent-function-scoping': 'off',
    },
  },
]
>>>>>>> origin/main
