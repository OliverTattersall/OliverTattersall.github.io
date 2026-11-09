import { dijkstra } from './dijkstra';
import { createGrid, toggleWall, type Coordinate } from '../grid/createGrid';

const start: Coordinate = { row: 10, col: 15 };
const finish: Coordinate = { row: 10, col: 35 };

test('returns visit order and path without mutating the grid', () => {
  const grid = createGrid(start, finish);
  const startCell = grid[start.row][start.col];
  const result = dijkstra(grid, start, finish);

  expect(result.visited[0]).toEqual(start);
  expect(result.visited.at(-1)).toEqual(finish);
  expect(result.path[0]).toEqual(start);
  expect(result.path.at(-1)).toEqual(finish);
  expect(result.path.length).toBeGreaterThan(1);
  result.path.forEach((cell, index) => {
    expect(grid[cell.row][cell.col].isWall).toBe(false);
    if (index === 0) return;
    const previous = result.path[index - 1];
    const step = Math.abs(cell.row - previous.row) + Math.abs(cell.col - previous.col);
    expect(step).toBe(1);
  });
  expect(grid[start.row][start.col]).toBe(startCell);
  expect(startCell).toEqual({
    row: start.row,
    col: start.col,
    isStart: true,
    isFinish: false,
    isWall: false,
  });
});

test('walks around a wall and leaves the walled cell unchanged', () => {
  const grid = toggleWall(createGrid({ row: 0, col: 0 }, { row: 0, col: 2 }), 0, 1);
  const wall = grid[0][1];
  const result = dijkstra(grid, { row: 0, col: 0 }, { row: 0, col: 2 });

  expect(result.path[0]).toEqual({ row: 0, col: 0 });
  expect(result.path.at(-1)).toEqual({ row: 0, col: 2 });
  expect(result.path).not.toContainEqual({ row: 0, col: 1 });
  expect(grid[0][1]).toBe(wall);
  expect(wall.isWall).toBe(true);
});

test('returns only the finish cell when the finish is sealed off', () => {
  let grid = createGrid({ row: 0, col: 0 }, { row: 0, col: 2 });
  grid = toggleWall(grid, 0, 1);
  grid = toggleWall(grid, 0, 3);
  grid = toggleWall(grid, 1, 2);
  const result = dijkstra(grid, { row: 0, col: 0 }, { row: 0, col: 2 });

  expect(result.visited.map((cell) => `${cell.row}-${cell.col}`)).not.toContain('0-2');
  expect(result.path).toEqual([{ row: 0, col: 2 }]);
});
