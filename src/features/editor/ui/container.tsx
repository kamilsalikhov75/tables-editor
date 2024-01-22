import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { XYCoord } from "react-dnd";
import { useDrop } from "react-dnd";
import { useLocalStorage } from "@/shared/lib/hooks/use-local-storage";
import { DragItem, DragItemType, TableType } from "../types/types";
import { Table } from "./table";
import clsx from "clsx";
import Hammer from "hammerjs";
import { useThrottle } from "@/shared/lib/hooks/use-throtlle";

export interface ContainerState {
  boxes: { [key: string]: { top: number; left: number; title: string } };
}

const initialValue: DragItem[] = [
  {
    id: "1",
    top: 252,
    left: 553,
    type: DragItemType.Table,
    tableType: TableType.Circle,
  },
  {
    id: "2",
    top: 76,
    left: 212,
    type: DragItemType.Table,
    tableType: TableType.Rectangle,
  },
  {
    id: "3",
    top: 451,
    left: 299,
    type: DragItemType.Table,
    tableType: TableType.Circle,
  },
];

const step = 10;

export const Container = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [boxes, setBoxes] = useLocalStorage<DragItem[]>("map", initialValue);
  const [scale, setScale] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const throtlledX = useThrottle(x, 10);
  const throtlledY = useThrottle(y, 10);
  const mc = useMemo(() => {
    if (wrapperRef.current) {
      return new Hammer.Manager(wrapperRef.current);
    }
  }, [wrapperRef.current]);
  const Pan = useMemo(() => {
    return new Hammer.Pan();
  }, []);

  const moveBox = useCallback(
    (id: string, left: number, top: number) => {
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

  useEffect(() => {
    setWidth(wrapperRef.current?.clientWidth);
    setHeight(wrapperRef.current?.clientHeight);
  }, [wrapperRef]);

  useEffect(() => {
    if (mc && !mc?.get("pan")) {
      mc.add(Pan);
      mc.on("panmove", (e) => {
        const left = e.deltaX + x;
        const top = e.deltaY + y;
        setX(left);
        setY(top);
      });
    }
  }, [x, y, mc, Pan, wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      onWheel={(e) => {
        if (e.deltaY > 0) {
          return setScale((prev) => prev + 0.1);
        }
        if (scale > 0.1) {
          setScale((prev) => prev - 0.1);
        }
      }}
      className={clsx("flex relative overflow-clip")}
    >
      {width && height && (
        <div
          className="absolute"
          // style={{ transform: `translate(${bgX}px, ${bgY}px)` }}
        >
          <div className="grid grid-flow-col gap-[9px] absolute">
            {Array(Math.floor(width / step) + 100)
              .fill(0)
              .map((_, index) => {
                return (
                  <span
                    className={clsx(
                      "block w-[1px]",
                      { "bg-black": index % 5 === 0 },
                      { "bg-gray-300 ": index % 5 !== 0 }
                    )}
                    style={{ height: height + 100 * step }}
                    key={index}
                  />
                );
              })}
          </div>
          <div className="grid grid-flow-row gap-[9px] absolute">
            {Array(Math.floor(height / step) + 100)
              .fill(0)
              .map((_, index) => {
                return (
                  <span
                    className={clsx(
                      "block w-full h-[1px] bg-black",
                      { "bg-black": index % 5 === 0 },
                      { "bg-gray-300 ": index % 5 !== 0 }
                    )}
                    style={{ width: width + 100 * step }}
                    key={index}
                  />
                );
              })}
          </div>
        </div>
      )}

      <div
        id="items"
        className="w-screen h-[calc(100vh-72px)] relative"
        ref={drop}
        // style={{ transform: `scale(${scale})` }}
        style={{
          transform: `translate(${throtlledX}px, ${throtlledY}px) scale(${scale})`,
        }}
      >
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
