import express from "express"
import { ObjectId } from "mongodb"
import { BaseResponse } from "./types/responses"

export const validate = (
  obj: object,
  guard: (o: object) => boolean,
  failureCallback?: () => void,
): boolean => {
  if (guard(obj)) {
    return true
  }
  failureCallback && failureCallback()
  return false
}

export const validateId = (id: string, failureCallback?: () => void): ObjectId | null => {
  try {
    return new ObjectId(id)
  } catch (_) {
    failureCallback && failureCallback()
    return null
  }
}

export const validationFailed = (res: express.Response) => (): void => {
  res.send({
    success: false,
    description: "Unexpected request formatting",
  })
}

export const badObjectId = (res: express.Response) => (): void => {
  res.send({
    success: false,
    description: "Invalid object Id",
  })
}

export const createErrorResponse = (err: any): BaseResponse => {
  return {
    success: false,
    description: err.toString(),
  }
}