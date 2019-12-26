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

export interface CreateWidgetSuccess extends BaseResponse {
  id: string
}

export interface GetAllWidgetSuccess extends BaseResponse {
  widgets: Array<IWidget>
}

export type CreateWidgetResponse = CreateWidgetSuccess | BaseResponse
export type GetAllWidgetResponse = GetAllWidgetSuccess | BaseResponse
