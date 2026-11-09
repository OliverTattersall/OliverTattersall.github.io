import { astar } from './astar';
import { dijkstra } from './dijkstra';
import { cellWeight, createGrid, paintCell, type Coordinate, type Grid } from '../grid/createGrid';

const start: Coordinate = { row: 10, col: 15 };
const finish: Coordinate = { row: 10, col: 35 };

test('finds a manhattan-length path and searches fewer cells than Dijkstra', () => {
  const grid = createGrid(start, finish);
  const result = astar(grid, start, finish);
  const dijkstraResult = dijkstra(grid, start, finish);

  expect(result.visited[0]).toEqual(start);
  expect(result.visited.at(-1)).toEqual(finish);
  expect(result.path[0]).toEqual(start);
  expect(result.path.at(-1)).toEqual(finish);
  expect(result.path).toHaveLength(manhattan(start, finish) + 1);
  expect(pathCost(grid, result.path)).toBe(pathCost(grid, dijkstraResult.path));
  expect(result.visited.length).toBeLessThan(dijkstraResult.visited.length);
  expect(grid[start.row][start.col].isWall).toBe(false);
});

test('goes around mud when a clear detour is cheaper', () => {
  const grid = paintCell(createGrid({ row: 0, col: 0 }, { row: 0, col: 2 }), 0, 1, 'mud');
  const result = astar(grid, { row: 0, col: 0 }, { row: 0, col: 2 });

  expect(result.path).not.toContainEqual({ row: 0, col: 1 });
  expect(pathCost(grid, result.path)).toBe(pathCost(grid, dijkstra(grid, { row: 0, col: 0 }, { row: 0, col: 2 }).path));
});

test('walks around a wall', () => {
  const grid = paintCell(createGrid({ row: 0, col: 0 }, { row: 0, col: 2 }), 0, 1, 'wall');
  const result = astar(grid, { row: 0, col: 0 }, { row: 0, col: 2 });

  expect(result.path[0]).toEqual({ row: 0, col: 0 });
  expect(result.path.at(-1)).toEqual({ row: 0, col: 2 });
  expect(result.path).not.toContainEqual({ row: 0, col: 1 });
});

function manhattan(from: Coordinate, to: Coordinate): number {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

function pathCost(grid: Grid, path: Coordinate[]): number {
  return path.slice(1).reduce((cost, cell) => cost + cellWeight(grid[cell.row][cell.col]), 0);
}
