import express from "express"
import { BaseResponse } from "./types/responses"

export const validate = (
  obj: object,
  guard: (o: object) => boolean,
  failedCallback?: () => void,
): boolean => {
  if (guard(obj)) {
    return true
  }
  failedCallback && failedCallback()
  return false
}

export const validationFailed = (res: express.Response) => (): void => {
  res.send({
    success: false,
    description: "Unexpected request formatting",
  })
}

export const createErrorResponse = (err: any): BaseResponse => {
  return {
    success: false,
    description: err.toString(),
  }
}
