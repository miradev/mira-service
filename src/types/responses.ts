import { IDevice, IWidget } from './definitions'

export interface BaseResponse {
  success: boolean
  description?: string
}

export interface UploadWidgetSuccess extends BaseResponse {
  filename: string
}

export interface CreateWidgetSuccess extends BaseResponse {
  id: string
}

export interface GetAllWidgetSuccess extends BaseResponse {
  widgets: IWidget[]
}

export interface GetWidgetSuccess extends BaseResponse {
  widget: IWidget
}

export type UploadWidgetResponse = UploadWidgetSuccess | BaseResponse
export type CreateWidgetResponse = CreateWidgetSuccess | BaseResponse
export type GetAllWidgetResponse = GetAllWidgetSuccess | BaseResponse
export type GetWidgetResponse = GetWidgetSuccess | BaseResponse
export type UpdateWidgetResponse = BaseResponse
export type DeleteWidgetResponse = BaseResponse

export interface CreateUserSuccess extends BaseResponse {
  id: string
}

export type CreateUserResponse = CreateUserSuccess | BaseResponse

export interface CreateDeviceSuccess extends BaseResponse {
  id: string
}

export interface GetDeviceSuccess extends BaseResponse {
  device: IDevice
}

export interface GetDeviceWidgetsSuccess extends BaseResponse {
  widgets: IWidget[]
}

export type CreateDeviceResponse = CreateDeviceSuccess | BaseResponse
export type GetDeviceResponse = GetDeviceSuccess | BaseResponse
export type UpdateDeviceResponse = BaseResponse
