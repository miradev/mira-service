import {BaseResponse} from "./definitions";

export const createErrorResponse = (err: any): BaseResponse => {
  return {
    success: false,
    description: err.toString()
  }
}