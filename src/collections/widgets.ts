import {Collections, CreateWidgetResponse, GetAllWidgetResponse, IWidget} from "../definitions";
import {Collection} from "mongodb";
import {mongodb} from "../clients/mongodb";
import {createErrorResponse} from "../helpers";

const collection = (): Collection<IWidget> => {
  return mongodb().collection(Collections.WIDGETS)
}

export const createWidget = (widget: IWidget): Promise<CreateWidgetResponse> => {
  return collection()
    .insertOne(widget)
    .then(newWidget => {
      return {
        success: true,
        id: newWidget.insertedId
      }
    })
    .catch(createErrorResponse)
}

export const getAllWidgets = (): Promise<GetAllWidgetResponse> => {
  return collection()
    .find()
    .toArray()
    .then((documents) => {
      return {
        success: true,
        widgets: documents
      }
    })
    .catch(createErrorResponse)
}