interface StatusBarItemBase {
  readonly type: string
}

export interface StatusBarItemText extends StatusBarItemBase {
  readonly type: 'text'
  readonly value: string
}

export interface StatusBarItemIcon extends StatusBarItemBase {
  readonly type: 'icon'
  readonly value: string
}

export type StatusBarItemElement = StatusBarItemText | StatusBarItemIcon
