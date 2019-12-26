import {IWidget} from "./types/definitions";

export const isCreateWidgetRequest = (o: any): o is IWidget => {
  return o.name !== undefined &&
    o.description !== undefined &&
    o.active !== undefined;
}
