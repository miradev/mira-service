export enum Collections {
  SESSIONS = 'sessions',
  WIDGETS = 'widgets',
  USERS = 'users',
}

export interface IWidget {
  name: string
  description: string
  active: boolean
  author?: string
  filename: string
}

export enum UserTags {
  DEVELOPER = 'dev',
}

export interface IUser {
  username: string
  email: string
  tags: UserTags[]
  hash: string
}
