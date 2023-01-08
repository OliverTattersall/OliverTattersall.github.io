
export function dijkstra(grid, startNode, finishNode){
    if (!startNode || !finishNode || startNode===finishNode){
        return false
    }
    
    const unvisitedNodes = getAllNodes(grid);
    startNode.distance = 0
    
    while(!!unvisitedNodes.length){
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.unshift()

        closestNode.isVisited = true
        if(closestNode === finishNode){
            return 'success'
        }
        updateNeighbours(closestNode, grid)
    }
}


function sortNodesByDistance(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }

function updateNeighbours(node, grid){

}

function getNeighbours(node, grid){
    const neighbours = []
    const {col, row} = node
    if (row>0){
        neighbours.push(grid[row-1][col])

    }
    if (row<grid.length-1){
        neighbours.push(grid[row+1][col])
    }
    if (col>0){
        neighbours.push(grid[row][col-1])
    }
    if (col<grid[0].length-1){
        neighbours.push(grid[row][col+1])
    }
    return neighbours.filter(neighbour => !neighbour.isVisited)
}


// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }