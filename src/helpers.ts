import express from 'express'
import * as fs from 'fs'
import * as JSZip from 'jszip'
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

export const socketNotFound = (res: express.Response) => (): void => {
  res.send({
    success: false,
    description: 'Device with the provided deviceId could not be found',
  })
}

export const createUploadWidgetResponse = (
  file: Express.Multer.File,
): Promise<UploadWidgetResponse> => {
  if (file) {
    return zipRead(file.path, 'manifest.json')
      .then(manifest => {
        return {
          success: true,
          filename: file.filename,
          manifest: JSON.parse(manifest),
        }
      })
      .catch(e => {
        return { success: false, description: 'Error reading manifest from zip'}
      })
  }
  return Promise.resolve({
    success: false,
    description: 'There was no file uploaded',
  })
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

export const zipRead = (filePath: string, fileName: string): Promise<string> => {
  if (fs.existsSync(filePath)) {
    return JSZip.loadAsync(fs.readFileSync(filePath)).then(zip => {
      return zip.file(fileName).async('string')
    })
  }
  return Promise.reject(new Error('Zip does not exist'))
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
