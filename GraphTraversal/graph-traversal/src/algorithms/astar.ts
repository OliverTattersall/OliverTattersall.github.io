import { cellWeight, type Coordinate, type Grid } from '../grid/createGrid';
import type { PathResult } from './dijkstra';

type SearchNode = {
  row: number;
  col: number;
  isWall: boolean;
  weight: number;
  distance: number;
  isVisited: boolean;
  previousNode: SearchNode | null;
};

// A* on a 4-connected grid. The heuristic is Manhattan distance to the finish.
// g is the weighted cost from the start, and the next cell is the smallest g + h.
export function astar(grid: Grid, start: Coordinate, finish: Coordinate): PathResult {
  const nodes = buildSearchNodes(grid);
  const startNode = nodes[start.row][start.col];
  const finishNode = nodes[finish.row][finish.col];
  startNode.distance = 0;

  const visited: Coordinate[] = [];
  const open = nodes.flat();

  while (open.length) {
    sortByPriority(open, finish);
    const closestNode = open.shift();
    if (!closestNode) break;
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;
    closestNode.isVisited = true;
    visited.push({ row: closestNode.row, col: closestNode.col });
    if (closestNode === finishNode) break;
    updateUnvisitedNeighbors(closestNode, nodes);
  }

  return { visited, path: backtrack(finishNode) };
}

export function manhattan(from: Coordinate, to: Coordinate): number {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

function buildSearchNodes(grid: Grid): SearchNode[][] {
  return grid.map((row) =>
    row.map((node) => ({
      row: node.row,
      col: node.col,
      isWall: node.isWall,
      weight: cellWeight(node),
      distance: Infinity,
      isVisited: false,
      previousNode: null,
    }))
  );
}

function sortByPriority(open: SearchNode[], finish: Coordinate) {
  open.sort((nodeA, nodeB) => {
    const priorityA = nodeA.distance + manhattan(nodeA, finish);
    const priorityB = nodeB.distance + manhattan(nodeB, finish);
    if (priorityA !== priorityB) return priorityA - priorityB;
    return manhattan(nodeA, finish) - manhattan(nodeB, finish);
  });
}

function updateUnvisitedNeighbors(node: SearchNode, nodes: SearchNode[][]) {
  for (const neighbor of getUnvisitedNeighbors(node, nodes)) {
    const nextDistance = node.distance + neighbor.weight;
    if (nextDistance < neighbor.distance) {
      neighbor.distance = nextDistance;
      neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors(node: SearchNode, nodes: SearchNode[][]): SearchNode[] {
  const neighbors: SearchNode[] = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(nodes[row - 1][col]);
  if (row < nodes.length - 1) neighbors.push(nodes[row + 1][col]);
  if (col > 0) neighbors.push(nodes[row][col - 1]);
  if (col < nodes[0].length - 1) neighbors.push(nodes[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function backtrack(finishNode: SearchNode): Coordinate[] {
  const path: Coordinate[] = [];
  let currentNode: SearchNode | null = finishNode;
  while (currentNode !== null) {
    path.unshift({ row: currentNode.row, col: currentNode.col });
    currentNode = currentNode.previousNode;
  }
  return path;
}
