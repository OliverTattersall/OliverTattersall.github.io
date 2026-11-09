import { nodeKey, type Grid as GridModel } from '../../grid/createGrid';
import Node, { type CellMouseHandler, type CellPaintHandler } from '../Node/Node';

type GridProps = {
  grid: GridModel;
  visited: Set<string>;
  path: Set<string>;
  onMouseDown: CellPaintHandler;
  onMouseEnter: CellMouseHandler;
  onMouseUp: () => void;
};

export default function Grid({ grid, visited, path, onMouseDown, onMouseEnter, onMouseUp }: GridProps) {
  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx}>
          {row.map((node) => {
            const key = nodeKey(node.row, node.col);
            return (
              <Node
                key={key}
                col={node.col}
                row={node.row}
                isFinish={node.isFinish}
                isStart={node.isStart}
                isWall={node.isWall}
                isMud={node.isMud}
                isVisited={visited.has(key)}
                isPath={path.has(key)}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
