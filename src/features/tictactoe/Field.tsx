import React, { ComponentType, useMemo, useRef, useState } from 'react';
import { useElementSize, usePrevious } from '../../app/hooks';
import { range } from '../../utils';
import Cell from './Cell';
import './Field.scss';
import { Coordinate } from './types';

interface FieldProps {
  overflowCells: number;
  xOffset: number;
  yOffset: number;
  cellSize: number;
}
interface InfiniteFieldProps {
  cmp: ComponentType<Coordinate>;
  throttle: number;
}

function arrayOfIndices(
  size: number,
  props: Pick<FieldProps, 'cellSize' | 'overflowCells'>
): [number, number[]] {
  let cellsOnScreen =
    Math.ceil(size / props.cellSize) + props.overflowCells * 2;
  cellsOnScreen = cellsOnScreen % 2 ? cellsOnScreen : cellsOnScreen + 1;
  const brunch = Math.floor(cellsOnScreen / 2);
  return [
    brunch * props.cellSize + size / 2 - (cellsOnScreen * props.cellSize) / 2,
    range(cellsOnScreen).map((_, it) => it - brunch),
  ];
}
function appendOffset(arr: number[], cellSize: number, offset: number) {
  return arr.map((v) => v - Math.ceil(offset / cellSize));
}
export const InfiniteField = (hocProps: InfiniteFieldProps) =>
  function Cmp(props: FieldProps) {
    const { cellSize, overflowCells, xOffset, yOffset } = props;

    const field = useRef<HTMLDivElement>(null);
    const [transition, setTransition] = useState('');
    const fieldSize = useElementSize(hocProps.throttle, field.current);

    const prevFieldSize = usePrevious(fieldSize);
    if (transition !== '' && fieldSize !== prevFieldSize) {
      console.log(fieldSize, prevFieldSize);
      setTransition('');
    }

    const [[translateX, arrX], [translateY, arrY]] = useMemo(
      () => [
        arrayOfIndices(fieldSize.width ?? 0, { cellSize, overflowCells }),
        arrayOfIndices(fieldSize.height ?? 0, { cellSize, overflowCells }),
      ],
      [fieldSize, cellSize, overflowCells]
    );
    const [translate, setTranslate] = useState<Coordinate>({ x: 0, y: 0 });
    if (
      field.current &&
      (translate.x !== translateX || translate.y !== translateY)
    ) {
      setTranslate({ x: translateX, y: translateY });
    }
    const computedCells = useMemo(() => {
      return appendOffset(arrX, cellSize, xOffset).flatMap((x) =>
        appendOffset(arrY, cellSize, yOffset).map((y) => ({ x, y }))
      );
    }, [arrX, arrY, xOffset, yOffset, cellSize]);
    const [cells, setCells] = useState<Coordinate[]>([]);
    if (cells !== computedCells) setCells(computedCells);
    // set transition after initialization
    if (translate.x !== 0)
      setTimeout(() => setTransition('transform .3s linear'), 1e3);

    return (
      <div className='field' ref={field}>
        <div
          className='container'
          style={{
            transform: `translate(${translate.x + props.xOffset}px, ${
              translate.y + props.yOffset
            }px)`,
            transition,
          }}>
          {cells.map(({ x, y }) => (
            <hocProps.cmp
              key={x.toString() + '_' + y.toString()}
              x={x}
              y={y}></hocProps.cmp>
          ))}
        </div>
      </div>
    );
  };
const Field = InfiniteField({ cmp: Cell, throttle: 100 });
export default Field;
