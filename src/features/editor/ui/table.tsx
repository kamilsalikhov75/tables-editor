import { useDrag } from 'react-dnd'
import clsx from 'clsx'
import { DragItemType } from '../types/types'

export interface TableProps {
  id: string
  left: number
  top: number
  type:'circle'|'rectangle'
}

export const Table = ({
  id,
  left,
  top,
  type
}:TableProps) => { 
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DragItemType.Table,
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top],
  )

  if (isDragging ) {
    return <div ref={drag} />
  }
  return (
    <div
      className={clsx("flex items-center justify-center absolute border border-solid border-gray-500 bg-green-700 cursor-move", {
        'rounded-full w-[100px] h-[100px]':type==='circle',
        'rounded-sm w-[200px] h-[100px]':type==='rectangle'
      })}
      ref={drag}
      style={{ left, top }}
      data-testid="box"
    >
      {id}
    </div>
  )
}
