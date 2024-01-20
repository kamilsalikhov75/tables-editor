import type { CSSProperties } from "react";
import { useCallback } from "react";
import type { XYCoord } from "react-dnd";
import { useDrop } from "react-dnd";
import { useLocalStorage } from "@/shared/lib/hooks/use-local-storage";
import { DragItem, DragItemType, TableType } from "../types/types";
import { Table } from "./table";

const styles: CSSProperties = {
  width: "100%",
  height: "100vh",
  position: "relative",
};

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } };
}

export const Container = () => {
  const [boxes, setBoxes] = useLocalStorage<DragItem[]>("map");

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
      console.log(id);

      setBoxes(
        boxes.map((box) => {
          if (box.id === id) {
            return { ...box, left, top };
          }
          return box;
        })
      );
    },
    [boxes, setBoxes]
  );

  const [, drop] = useDrop(
    () => ({
      accept: DragItemType.Table,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );

  return (
    <div style={{ display: "flex" }}>
      <div ref={drop} style={styles}>
        {boxes.map((box) => {
          const { left, top, tableType } = box;
          return (
            <Table
              key={box.id}
              id={box.id}
              left={left}
              top={top}
              type={tableType as TableType}
            />
          );
        })}
      </div>
    </div>
  );
};
