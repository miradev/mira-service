import { ObjectId } from 'mongodb'
import { connectMongo, disconnectMongo } from '../../clients/mongodb'
import {
  createWidget,
  deleteWidget,
  getAllWidgets,
  getWidget,
  updateWidget,
} from '../../collections/widgets'
import { IWidget } from '../../types/definitions'
import { CreateWidgetSuccess, GetAllWidgetSuccess, GetWidgetSuccess } from '../../types/responses'

beforeAll(async () => {
  await connectMongo()
})

afterAll(async () => {
  await disconnectMongo()
})

describe('widgets', () => {
  const widget: IWidget = {
    name: 'Clock',
    description: 'A clock application',
    active: false,
    filename: 'clock.zip',
  }
  let id: ObjectId
  describe('createWidget', () => {
    it('creates the widget', async () => {
      const response = (await createWidget(widget, '1')) as CreateWidgetSuccess
      expect(response.success).toEqual(true)
      id = new ObjectId(response.id)
    })
  })
  describe('getAllWidget', () => {
    it('retrieves all the widgets', async () => {
      const response = (await getAllWidgets()) as GetAllWidgetSuccess
      expect(response.success).toEqual(true)
      expect(response.widgets.length).toBeGreaterThan(0)
    })
  })
  describe('getWidget', () => {
    it('retrieves the widget', async () => {
      const response = (await getWidget(id)) as GetWidgetSuccess
      expect(response.success).toEqual(true)
      expect(response.widget.active).toBe(true)
    })
    it('should fail if widget does not exist', async () => {
      const response = await getWidget(new ObjectId('fff000fff000'))
      expect(response.success).toEqual(false)
    })
  })
  describe('updateWidget', () => {
    it('updates the widget with a different description', async () => {
      const newWidget: IWidget = {
        name: 'Clock',
        description: 'An updated description',
        active: false,
        filename: 'clock.zip',
      }
      const response = await updateWidget(id, newWidget)
      expect(response.success).toEqual(true)
      const getResponse = (await getWidget(id)) as GetWidgetSuccess
      expect(getResponse.widget.description).not.toEqual(widget.description)
    })
  })
  describe('deleteWidget', () => {
    it('deletes the widget', async () => {
      const response = await deleteWidget(id)
      expect(response.success).toEqual(true)
    })
    it('turns off active status of widget', async () => {
      const verifyResponse = await getWidget(id)
      expect(verifyResponse.success).toBe(false)
    })
  })
})
