import { Collection, ObjectId } from "mongodb"
import { mongodb } from "../clients/mongodb"
import { createErrorResponse } from "../helpers"
import { Collections, IWidget } from "../types/definitions"
import {
  CreateWidgetResponse,
  DeleteWidgetResponse,
  GetAllWidgetResponse,
  GetWidgetResponse,
} from "../types/responses"

const collection = (): Collection<IWidget> => {
  return mongodb().collection(Collections.WIDGETS)
}

export const createWidget = (widget: IWidget): Promise<CreateWidgetResponse> => {
  widget.active = true
  return collection()
    .insertOne(widget)
    .then(newWidget => {
      return {
        id: newWidget.insertedId,
        success: true,
      }
    })
    .catch(createErrorResponse)
}

export const getAllWidgets = (): Promise<GetAllWidgetResponse> => {
  return collection()
    .find({ active: true })
    .toArray()
    .then(documents => {
      return {
        success: true,
        widgets: documents,
      }
    })
    .catch(createErrorResponse)
}

export const getWidget = (id: ObjectId): Promise<GetWidgetResponse> => {
  return collection()
    .findOne({ _id: id })
    .then(widget => {
      if (widget) {
        return {
          success: true,
          widget,
        }
      }
      return {
        success: false,
        widget: "Widget does not exist",
      }
    })
    .catch(createErrorResponse)
}

export const deleteWidget = (id: ObjectId): Promise<DeleteWidgetResponse> => {
  return collection()
    .updateOne({ _id: id }, { $set: { active: false } })
    .then(res => {
      if (res.modifiedCount === 1) {
        return {
          success: true,
        }
      }
      return {
        success: false,
        description: "Failed to delete widget",
      }
    })
    .catch(createErrorResponse)
}
