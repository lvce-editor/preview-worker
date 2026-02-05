import type { StatusBarItemElement } from '../StatusBarItemElement/StatusBarItemElement.ts'

export type StatusBarItem = {
  readonly ariaLabel: string
  readonly command?: string
  readonly elements: readonly StatusBarItemElement[]
  readonly name: string
  readonly tooltip: string
}
