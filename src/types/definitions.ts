export enum Collections {
  SESSIONS = 'sessions',
  WIDGETS = 'widgets',
  USERS = 'users',
  DEVICES = 'devices',
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
}

export interface IUser {
  username: string
  email: string
  tags: UserTags[]
  hash: string
  devices: string[]
}

export interface IDevice {
  _id: string
  name: string
  config: object
  connection?: DeviceConnection
  deviceWidgets: DeviceWidget[]
}

export interface DeviceConnection {
  address: string
  authToken: string
}

export interface DeviceWidget {
  widgetId: string
  config: object
}
