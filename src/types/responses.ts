import { IWidget } from "./definitions"

export interface BaseResponse {
  success: boolean
  description?: string
}

export interface CreateWidgetSuccess extends BaseResponse {
  id: string
}

export interface GetAllWidgetSuccess extends BaseResponse {
  widgets: IWidget[]
}

export type CreateWidgetResponse = CreateWidgetSuccess | BaseResponse
export type GetAllWidgetResponse = GetAllWidgetSuccess | BaseResponse
