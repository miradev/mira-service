import {BaseResponse} from "./types/responses";

export const validate = (obj: object, guard: Function, failedCallback?: Function): boolean => {
  if (guard(obj)) {
    return true
  }
  failedCallback && failedCallback()
  return false
}

export const validationFailed = (res: any) => (): void => {
  res.send({
    success: false,
    description: 'Unexpected request formatting'
  } as BaseResponse)
}

export const createErrorResponse = (err: any): BaseResponse => {
  return {
    success: false,
    description: err.toString()
  }
}