export enum Collections {
  SESSIONS = 'sessions',
  WIDGETS = 'widgets',
  USERS = 'users',
}

export interface IWidget {
  _id: string
  name: string
  description: string
  active: boolean
  author?: string
  filename: string
  images: string[]
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
