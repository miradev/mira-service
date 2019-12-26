import {Collections, IWidget} from "../types/definitions";
import {Collection} from "mongodb";
import {mongodb} from "../clients/mongodb";
import {createErrorResponse} from "../helpers";
import {CreateWidgetResponse, GetAllWidgetResponse} from "../types/responses";

const collection = (): Collection<IWidget> => {
  return mongodb().collection(Collections.WIDGETS)
}

export const createWidget = (widget: IWidget): Promise<CreateWidgetResponse> => {
  widget.active = true
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
    .find({active: true})
    .toArray()
    .then((documents) => {
      return {
        success: true,
        widgets: documents
      }
    })
    .catch(createErrorResponse)
}