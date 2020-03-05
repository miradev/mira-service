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

export interface IWidget {
  _id: string
  name: string
  description: string
  active: boolean
  authorId: string
  filename: string
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
  deviceWidgets: DeviceWidget[]
}

export interface IDeviceConnection {
  deviceId: string
  hash: string
}

export interface DeviceWidget {
  widgetId: string
  config: object
}
