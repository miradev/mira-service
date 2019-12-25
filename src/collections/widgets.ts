import {BaseResponse, IWidget} from "../definitions";
import {Collection} from "mongodb";
import {mongodb} from "../clients/mongodb";

const COLLECTION_NAME = "widgets"

const collection = (): Collection => {
  return mongodb().collection(COLLECTION_NAME)
}

export const createWidget = (widget: IWidget): Promise<BaseResponse> => {
  return collection().insertOne(widget)
    .then(newWidget => {
      console.log('Created widget', newWidget.insertedId)
      return {
        success: true
      }
    })
    .catch(err => {
      return {
        success: false,
        description: err.toString()
      }
    })
}