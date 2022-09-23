import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { makeMove } from './tictactoeSlice';
import { Coordinate, Player } from './types';

const iconClass = (p: Player) =>
  p === Player.x ? 'fa fa-xmark' : 'fa-regular fa-circle';

export default function Cell(props: Coordinate) {
  const player = useAppSelector((state) => state.tictactoe[props.x]?.[props.y]);
  const dispatch = useAppDispatch();

  return (
    <div
      className='cell'
      onClick={() => dispatch(makeMove(props))}
      style={{ left: props.x * 50 + 'px', top: props.y * 50 + 'px' }}>
      {player && <i className={iconClass(player)}></i>}
    </div>
  );
}
