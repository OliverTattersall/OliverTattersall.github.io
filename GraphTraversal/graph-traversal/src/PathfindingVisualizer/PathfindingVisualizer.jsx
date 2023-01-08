import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import './PathfindingVisualizer.css'

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
    constructor(props) { 
        super(props);
        this.state = {
            nodes: [],
        };
    }
    componentDidMount(){
        const nodes = [];
        for (let row = 0; row < 20; row++){
            const currentRow = [];
            for(let col = 0; col<50; col++){
                const currentNode = {
                    col,
                    row, 
                    isStart: row === START_NODE_ROW && col===START_NODE_COL,
                    isFinish: row ===FINISH_NODE_ROW && col === FINISH_NODE_COL,
                };
                currentRow.push(currentNode)
            }
            nodes.push(currentRow)

        }
        this.setState({nodes})


    }
    visualizeDijikstra(){
        const {grid} = this.state
        const startNode = grid[START_NODE_ROW][START_NODE_COL]
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);

    }

    render() {
        const {nodes} = this.state
        console.log(nodes)
        return (
        <>
            <button onClick = {()=> this.visualizeDijikstra()}>
            Visualize Dijkstra's Algorithm
            </button>
            <div className="grid">
                {nodes.map((row, rowIdx) =>{
                    return  (
                    <div key = {rowIdx}>
                        {row.map((node, nodeIdx) => {
                            const {isStart, isFinish} = node;
                            // console.log(isStart)
                            return (
                                <Node>
                                    key = {nodeIdx}
                                    isStart = {isStart}
                                    isFinish = {isFinish}
                                    test = {'foo'}
                                    test = {'kappa'}
                                </Node>
                            );
                        }
                        
                        )}
                    </div>
                    
                    );
            })}
                
            </div>
            </>
        );
    }

}