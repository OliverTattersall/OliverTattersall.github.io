import { useCallback, useReducer } from 'react';
import { dijkstra } from '../algorithms/dijkstra';
import { createInitialBoard, paintCell, type Board, type PaintTerrain } from '../grid/createGrid';
import { usePathAnimation } from '../hooks/usePathAnimation';
import Grid from './Grid/Grid';
import './PathfindingVisualizer.css';

type BoardAction =
  | { type: 'pointer-down'; row: number; col: number; paint: PaintTerrain }
  | { type: 'pointer-enter'; row: number; col: number }
  | { type: 'pointer-up' | 'reset' };

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
    default:
      return state;
  }
}

export default function PathfindingVisualizer() {
  const [board, dispatch] = useReducer(boardReducer, undefined, createInitialBoard);
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
    play(dijkstra(board.grid, board.start, board.finish));
  };

  const reset = () => {
    resetAnimation();
    dispatch({ type: 'reset' });
  };

  return (
    <>
      <h1>Welcome to my React App, a graph traversal visualizer</h1>
      <h4>Left-click and drag for walls. Right-click and drag for mud.</h4>
      <button className="button" onClick={visualize} disabled={isRunning}>
        Visualize Dijkstra's Algorithm
      </button>
      <br />
      <button className="button" onClick={reset}>
        Reset Grid
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
