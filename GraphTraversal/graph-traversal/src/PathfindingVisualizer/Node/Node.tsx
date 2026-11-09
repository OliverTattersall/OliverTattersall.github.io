import { memo } from 'react';
import type { PaintTerrain } from '../../grid/createGrid';
import './Node.css';

export type CellMouseHandler = (row: number, col: number) => void;
export type CellPaintHandler = (row: number, col: number, terrain: PaintTerrain) => void;

type NodeProps = {
  col: number;
  row: number;
  isFinish: boolean;
  isStart: boolean;
  isWall: boolean;
  isMud: boolean;
  isVisited: boolean;
  isPath: boolean;
  onMouseDown: CellPaintHandler;
  onMouseEnter: CellMouseHandler;
  onMouseUp: () => void;
};

function Node({
  col,
  isFinish,
  isStart,
  isWall,
  isMud,
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
    isMud ? 'node-mud' : '',
    isVisited ? 'node-visited' : '',
    isPath ? 'node-shortest-path' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onMouseDown={(event) => onMouseDown(row, col, event.button === 2 ? 'mud' : 'wall')}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}

export default memo(Node);
