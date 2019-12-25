export enum Collections {
  WIDGETS = 'widgets'
}

export interface BaseResponse {
  success: boolean
  description?: string
}

export interface IWidget {
  name: string
  description: string
}