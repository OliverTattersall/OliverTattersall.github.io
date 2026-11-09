import type { Coordinate, Grid } from '../grid/createGrid';

export type PathResult = {
  visited: Coordinate[];
  path: Coordinate[];
};

type SearchNode = {
  row: number;
  col: number;
  isWall: boolean;
  distance: number;
  isVisited: boolean;
  previousNode: SearchNode | null;
};

// Dijkstra on a 4-connected grid. Visit order and the backtracked path are
// returned as coordinates. Distance and previous pointers stay on local
// copies, so the board grid is left unchanged.
export function dijkstra(grid: Grid, start: Coordinate, finish: Coordinate): PathResult {
  const nodes = buildSearchNodes(grid);
  const startNode = nodes[start.row][start.col];
  const finishNode = nodes[finish.row][finish.col];
  startNode.distance = 0;

  const visited: Coordinate[] = [];
  const unvisited = nodes.flat();

  while (unvisited.length) {
    sortNodesByDistance(unvisited);
    const closestNode = unvisited.shift();
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

function buildSearchNodes(grid: Grid): SearchNode[][] {
  return grid.map((row) =>
    row.map((node) => ({
      row: node.row,
      col: node.col,
      isWall: node.isWall,
      distance: Infinity,
      isVisited: false,
      previousNode: null,
    }))
  );
}

function sortNodesByDistance(unvisitedNodes: SearchNode[]) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: SearchNode, nodes: SearchNode[][]) {
  for (const neighbor of getUnvisitedNeighbors(node, nodes)) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
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
