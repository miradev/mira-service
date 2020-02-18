import { IWidget } from './types/definitions'

export const isCreateWidgetRequest = (o: any): o is IWidget => {
  return (
    o.name !== undefined &&
    o.description !== undefined &&
    o.active !== undefined &&
    o.filename !== undefined
  )
}

export const isAuthRequest = (o: any) => {
  return o.username !== undefined && o.password !== undefined
}

export const isSignupRequest = (o: any) => {
  return o.username !== undefined && o.password !== undefined && o.email !== undefined
}

export const isUpdateWidgetRequest = isCreateWidgetRequest
