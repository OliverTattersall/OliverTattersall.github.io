import { memo } from 'react';
import './Node.css';

export type CellMouseHandler = (row: number, col: number) => void;

type NodeProps = {
  col: number;
  row: number;
  isFinish: boolean;
  isStart: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  onMouseDown: CellMouseHandler;
  onMouseEnter: CellMouseHandler;
  onMouseUp: () => void;
};

function Node({
  col,
  isFinish,
  isStart,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  row,
}: NodeProps) {
  const className = [
    'node',
    isStart ? 'node-start' : '',
    isFinish ? 'node-finish' : '',
    isWall ? 'node-wall' : '',
    isVisited ? 'node-visited' : '',
    isPath ? 'node-shortest-path' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    />
  );
}

export default memo(Node);
