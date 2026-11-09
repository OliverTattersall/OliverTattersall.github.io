export type Coordinate = {
  row: number;
  col: number;
};

export type GridNode = Coordinate & {
  isStart: boolean;
  isFinish: boolean;
  isWall: boolean;
};

export type Grid = GridNode[][];

export type Board = {
  start: Coordinate;
  finish: Coordinate;
  mouseIsPressed: boolean;
  grid: Grid;
};

export const ROW_COUNT = 20;
export const COL_COUNT = 50;
export const DEFAULT_START: Coordinate = { row: 10, col: 15 };
export const DEFAULT_FINISH: Coordinate = { row: 10, col: 35 };

export function nodeKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function createGrid(start: Coordinate, finish: Coordinate): Grid {
  const grid: Grid = [];
  for (let row = 0; row < ROW_COUNT; row++) {
    const currentRow: GridNode[] = [];
    for (let col = 0; col < COL_COUNT; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === start.row && col === start.col,
        isFinish: row === finish.row && col === finish.col,
        isWall: false,
      });
    }
    grid.push(currentRow);
  }
  return grid;
}

export function createInitialBoard(): Board {
  const start = { row: DEFAULT_START.row, col: DEFAULT_START.col };
  const finish = { row: DEFAULT_FINISH.row, col: DEFAULT_FINISH.col };
  return {
    start,
    finish,
    mouseIsPressed: false,
    grid: createGrid(start, finish),
  };
}

export function toggleWall(grid: Grid, row: number, col: number): Grid {
  const node = grid[row][col];
  if (node.isStart || node.isFinish) return grid;
  const nextRow = grid[row].slice();
  nextRow[col] = { ...node, isWall: !node.isWall };
  const nextGrid = grid.slice();
  nextGrid[row] = nextRow;
  return nextGrid;
}
