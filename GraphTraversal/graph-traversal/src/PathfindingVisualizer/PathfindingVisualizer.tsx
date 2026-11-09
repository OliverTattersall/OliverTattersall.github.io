import { useCallback, useReducer, useState } from 'react';
import { astar } from '../algorithms/astar';
import { dijkstra, type PathResult } from '../algorithms/dijkstra';
import { createInitialBoard, paintCell, type Board, type Coordinate, type Grid as GridModel, type PaintTerrain } from '../grid/createGrid';
import { createRandomMap } from '../grid/randomMap';
import { usePathAnimation } from '../hooks/usePathAnimation';
import Grid from './Grid/Grid';
import './PathfindingVisualizer.css';

const algorithms = {
  dijkstra,
  astar,
} as const;

type AlgorithmId = keyof typeof algorithms;

type Pathfinder = (grid: GridModel, start: Coordinate, finish: Coordinate) => PathResult;

type BoardAction =
  | { type: 'pointer-down'; row: number; col: number; paint: PaintTerrain }
  | { type: 'pointer-enter'; row: number; col: number }
  | { type: 'pointer-up' | 'reset' | 'randomize' };

function boardReducer(state: Board, action: BoardAction): Board {
  switch (action.type) {
    case 'pointer-down':
      return {
        ...state,
        mouseIsPressed: true,
        paint: action.paint,
        grid: paintCell(state.grid, action.row, action.col, action.paint),
      };
    case 'pointer-enter':
      if (!state.mouseIsPressed || !state.paint) return state;
      return {
        ...state,
        grid: paintCell(state.grid, action.row, action.col, state.paint),
      };
    case 'pointer-up':
      return { ...state, mouseIsPressed: false, paint: null };
    case 'reset':
      return createInitialBoard();
    case 'randomize':
      return {
        ...state,
        mouseIsPressed: false,
        paint: null,
        grid: createRandomMap(state.start, state.finish),
      };
    default:
      return state;
  }
}

export default function PathfindingVisualizer() {
  const [board, dispatch] = useReducer(boardReducer, undefined, createInitialBoard);
  const [algorithm, setAlgorithm] = useState<AlgorithmId>('dijkstra');
  const { visited, path, isRunning, isRunningRef, play, resetAnimation } = usePathAnimation();

  const onMouseDown = useCallback((row: number, col: number, paint: PaintTerrain) => {
    if (isRunningRef.current) return;
    dispatch({ type: 'pointer-down', row, col, paint });
  }, [isRunningRef]);

  const onMouseEnter = useCallback((row: number, col: number) => {
    if (isRunningRef.current) return;
    dispatch({ type: 'pointer-enter', row, col });
  }, [isRunningRef]);

  const onMouseUp = useCallback(() => {
    dispatch({ type: 'pointer-up' });
  }, []);

  const visualize = () => {
    if (isRunningRef.current) return;
    const findPath: Pathfinder = algorithms[algorithm];
    play(findPath(board.grid, board.start, board.finish));
  };

  const reset = () => {
    resetAnimation();
    dispatch({ type: 'reset' });
  };

  const randomize = () => {
    resetAnimation();
    dispatch({ type: 'randomize' });
  };

  return (
    <>
      <h1>A graph traversal visualizer</h1>
      <h4>Left-click and drag for walls. Right-click and drag for mud.</h4>
      <label className="algorithm-label">
        Algorithm
        <select
          className="algorithm-select"
          value={algorithm}
          disabled={isRunning}
          onChange={(event) => {
            const next = event.target.value;
            if (next === 'dijkstra' || next === 'astar') setAlgorithm(next);
          }}
        >
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>
      </label>
      <button className="button" onClick={visualize} disabled={isRunning}>
        Visualize
      </button>
      <br />
      <button className="button" onClick={reset}>
        Reset Grid
      </button>
      <button className="button" onClick={randomize}>
        Random Map
      </button>
      <Grid
        grid={board.grid}
        visited={visited}
        path={path}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseUp={onMouseUp}
      />
      <br />
    </>
  );
}
