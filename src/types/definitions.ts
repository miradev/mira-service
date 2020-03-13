export enum Collections {
  SESSIONS = 'sessions',
  WIDGETS = 'widgets',
  USERS = 'users',
  DEVICES = 'devices',
  CONNECTIONS = 'connections',
}

export enum UserTags {
  DEVELOPER = 'dev',
}

export enum WidgetTags {
  ACCESSORY = 'accessory',
  GAME = 'game',
  NEWS = 'news',
  SOCIAL = 'social',
  UTILITY = 'utility',
}

export interface IWidget {
  _id: string
  name: string
  description: string
  active: boolean
  authorId: string
  filename: string
  tags: WidgetTags[]
  images: string[]
  manifest: object
}

export interface IUser {
  username: string
  email: string
  tags: UserTags[]
  hash: string
  devices: string[]
  favorites: string[]
}

export interface IDevice {
  _id: string
  name: string
  config: object
  widgets: {
    [id: string]: WidgetSetting
  }
}

export interface IDeviceConnection {
  deviceId: string
  hash: string
}

export interface WidgetSetting {
  style?: {
    [key: string]: string
  }
  config?: {
    [configKey: string]: string | number | boolean | null
  }
  page: number
}
