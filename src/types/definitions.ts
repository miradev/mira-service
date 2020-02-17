export enum Collections {
  SESSIONS = 'sessions',
  WIDGETS = 'widgets',
  USERS = 'users',
}

export interface IWidget {
  name: string
  description: string
  active: boolean
  userId?: string
}

export interface IUser {
  username: string
  hash: string
}
