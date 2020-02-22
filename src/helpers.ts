import express from 'express'
import { BaseResponse, UploadWidgetResponse } from './types/responses'

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

const validId = /[-_a-zA-Z0-9]+/
export const validateId = (id: string, failureCallback?: () => void): string | null => {
  const match = id.match(validId)
  if (match && match[0] === id) {
    return id
  }
  failureCallback && failureCallback()
  return null
}

export const validationFailed = (res: express.Response) => (): void => {
  res.send({
    success: false,
    description: 'Unexpected request formatting',
  })
}

export const badObjectId = (res: express.Response) => (): void => {
  res.send({
    success: false,
    description: 'Invalid object Id',
  })
}

export const createUploadWidgetResponse = (file: Express.Multer.File): UploadWidgetResponse => {
  if (file) {
    return {
      success: true,
      filename: file.filename,
    }
  }
  return {
    success: false,
    description: 'There was no file uploaded',
  }
}

export const widgetFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (a: Error | null, b?: boolean) => void,
): void => {
  console.log(file)
  if (file.mimetype in ['application/zip', 'application/octet-stream']) {
    return cb(new Error('Only .zip is allowed'))
  }
  cb(null, true)
}

export const widgetName = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: (a: any, s?: any) => void,
): void => {
  cb(null, Date.now() + file.originalname)
}

export const createErrorResponse = (err: any): BaseResponse => {
  return {
    success: false,
    description: err.toString(),
  }
}
