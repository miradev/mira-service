import {BaseResponse, Collections, IWidget} from "../definitions";
import {Collection} from "mongodb";
import {mongodb} from "../clients/mongodb";

const collection = (): Collection => {
  return mongodb().collection(Collections.WIDGETS)
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