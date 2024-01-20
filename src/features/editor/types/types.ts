export enum DragItemType {
  Table = "table",
  Wall = "wall",
}
export enum TableType {
  Circle = "circle",
  Rectangle = "rectangle",
}

export interface DragItem {
  id: string;
  left: number;
  top: number;
  type: DragItemType;
  tableType?: TableType;
}
