import { COL_COUNT, ROW_COUNT, createGrid, type Coordinate, type Grid, type GridNode } from './createGrid';

export type RandomSource = () => number;

export const WALL_CHANCE = 0.2;
export const MUD_SEED_CHANCE = 0.025;
export const MUD_SPREAD_CHANCE = 0.55;
export const MUD_SPREAD_PASSES = 2;

export function createRandomMap(
  start: Coordinate,
  finish: Coordinate,
  random: RandomSource = Math.random,
): Grid {
  const grid = createGrid(start, finish);
  seedMud(grid, random);
  for (let pass = 0; pass < MUD_SPREAD_PASSES; pass++) {
    spreadMud(grid, random);
  }
  placeWalls(grid, random);
  return grid;
}

function seedMud(grid: Grid, random: RandomSource) {
  eachCell(grid, (node, row, col) => {
    if (isProtected(node)) return;
    if (random() < MUD_SEED_CHANCE) {
      grid[row][col] = { ...node, isMud: true };
    }
  });
}

function spreadMud(grid: Grid, random: RandomSource) {
  const grown: Coordinate[] = [];
  eachCell(grid, (node, row, col) => {
    if (isProtected(node) || node.isMud) return;
    if (!hasMudNeighbor(grid, row, col)) return;
    if (random() < MUD_SPREAD_CHANCE) grown.push({ row, col });
  });
  grown.forEach(({ row, col }) => {
    grid[row][col] = { ...grid[row][col], isMud: true };
  });
}

function placeWalls(grid: Grid, random: RandomSource) {
  eachCell(grid, (node, row, col) => {
    if (isProtected(node) || node.isMud) return;
    if (random() < WALL_CHANCE) {
      grid[row][col] = { ...node, isWall: true };
    }
  });
}

function eachCell(grid: Grid, visit: (node: GridNode, row: number, col: number) => void) {
  for (let row = 0; row < ROW_COUNT; row++) {
    for (let col = 0; col < COL_COUNT; col++) {
      visit(grid[row][col], row, col);
    }
  }
}

function isProtected(node: GridNode): boolean {
  return node.isStart || node.isFinish;
}

function hasMudNeighbor(grid: Grid, row: number, col: number): boolean {
  return neighbors(grid, row, col).some((node) => node.isMud);
}

function neighbors(grid: Grid, row: number, col: number): GridNode[] {
  const found: GridNode[] = [];
  if (row > 0) found.push(grid[row - 1][col]);
  if (row < ROW_COUNT - 1) found.push(grid[row + 1][col]);
  if (col > 0) found.push(grid[row][col - 1]);
  if (col < COL_COUNT - 1) found.push(grid[row][col + 1]);
  return found;
}
