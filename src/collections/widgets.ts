import { Collection } from 'mongodb'
import { mongodb } from '../clients/mongodb'
import { createErrorResponse } from '../helpers'
import { Collections, IWidget } from '../types/definitions'
import {
  CreateWidgetResponse,
  DeleteWidgetResponse,
  GetAllWidgetResponse,
  GetWidgetResponse,
  UpdateWidgetResponse,
} from '../types/responses'

const collection = (): Collection<IWidget> => {
  return mongodb().collection(Collections.WIDGETS)
}

export const createWidget = (widget: IWidget, userId: string): Promise<CreateWidgetResponse> => {
  widget.active = true
  widget.authorId = userId
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

export const getAllWidgetsByUserId = (userId: string): Promise<GetAllWidgetResponse> => {
  return collection()
    .find({ authorId: userId })
    .toArray()
    .then(documents => {
      return {
        success: true,
        widgets: documents,
      }
    })
    .catch(createErrorResponse)
}

export const getWidget = (id: string): Promise<GetWidgetResponse> => {
  return collection()
    .findOne({ _id: id, active: true })
    .then(widget => {
      if (widget) {
        return {
          success: true,
          widget,
        }
      }
      return {
        success: false,
        widget: 'Widget does not exist',
      }
    })
    .catch(createErrorResponse)
}

export const updateWidget = (id: string, widget: IWidget): Promise<UpdateWidgetResponse> => {
  return collection()
    .updateOne(
      { _id: id, active: true },
      {
        $set: {
          description: widget.description,
          tags: widget.tags,
          images: widget.images,
          name: widget.name,
          filename: widget.filename,
          manifest: widget.manifest,
        },
      },
    )
    .then(res => {
      if (res.modifiedCount === 1) {
        return {
          success: true,
        }
      }
      return {
        success: false,
        description: 'Failed to update widget',
      }
    })
    .catch(createErrorResponse)
}

export const deleteWidget = (id: string): Promise<DeleteWidgetResponse> => {
  return collection()
    .updateOne({ _id: id, active: true }, { $set: { active: false } })
    .then(res => {
      if (res.modifiedCount === 1) {
        return {
          success: true,
        }
      }
      return {
        success: false,
        description: 'Failed to delete widget',
      }
    })
    .catch(createErrorResponse)
}

export const getFiles = (...widgets: string[]): Promise<string[]> => {
  return collection()
    .find({ _id: { $in: widgets } })
    .map<string>(widget => widget.filename)
    .toArray()
}
