export enum Collections {
  WIDGETS = 'widgets',
  USERS = 'users',
}

export interface IWidget {
  name: string
  description: string
  active: boolean
}

export interface IUser {
  username: string
  hash: string
}
