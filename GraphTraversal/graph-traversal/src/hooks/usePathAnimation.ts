import { useCallback, useEffect, useRef, useState } from 'react';
import type { PathResult } from '../algorithms/dijkstra';
import { nodeKey } from '../grid/createGrid';

const VISIT_INTERVAL_MS = 10;
const PATH_INTERVAL_MS = 50;

export function usePathAnimation() {
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [path, setPath] = useState<Set<string>>(() => new Set());
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    isRunningRef.current = false;
    setIsRunning(false);
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const resetAnimation = useCallback(() => {
    clearTimers();
    setVisited(new Set());
    setPath(new Set());
  }, [clearTimers]);

  const play = useCallback((result: PathResult) => {
    if (isRunningRef.current) return;
    clearTimers();
    isRunningRef.current = true;
    setIsRunning(true);
    setVisited(new Set());
    setPath(new Set());

    const timers: ReturnType<typeof setTimeout>[] = [];
    result.visited.forEach((node, index) => {
      const key = nodeKey(node.row, node.col);
      timers.push(
        setTimeout(() => {
          setVisited((current) => {
            const next = new Set(current);
            next.add(key);
            return next;
          });
        }, VISIT_INTERVAL_MS * index)
      );
    });

    const pathDelay = VISIT_INTERVAL_MS * result.visited.length;
    result.path.forEach((node, index) => {
      const key = nodeKey(node.row, node.col);
      timers.push(
        setTimeout(() => {
          setPath((current) => {
            const next = new Set(current);
            next.add(key);
            return next;
          });
          if (index === result.path.length - 1) {
            isRunningRef.current = false;
            setIsRunning(false);
          }
        }, pathDelay + PATH_INTERVAL_MS * index)
      );
    });

    if (result.path.length === 0) {
      timers.push(
        setTimeout(() => {
          isRunningRef.current = false;
          setIsRunning(false);
        }, pathDelay)
      );
    }

    timeoutsRef.current = timers;
  }, [clearTimers]);

  return { visited, path, isRunning, isRunningRef, play, resetAnimation };
}
