import React, { useEffect } from 'react';
import useTaskStore from '../store.js';

export default function Timer({ taskId }) {
  const { tasks, startTimer, stopTimer, updateRunningTime, adjustTime } =
    useTaskStore((state) => ({
      tasks: state.tasks,
      startTimer: state.startTimer,
      stopTimer: state.stopTimer,
      updateRunningTime: state.updateRunningTime,
      adjustTime: state.adjustTime,
    }));

  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    let interval;
    if (task?.isRunning) {
      // resume immediately and keep updating
      updateRunningTime(taskId);
      interval = setInterval(() => updateRunningTime(taskId), 1000);
    }
    return () => clearInterval(interval);
  }, [task?.isRunning, taskId, updateRunningTime]);

  if (!task) return null;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="timer">
      <span>{formatTime(task.elapsed)}</span>
      {task.isRunning ? (
        <button onClick={() => stopTimer(taskId)}>Stop</button>
      ) : (
        <button onClick={() => startTimer(taskId)}>Start</button>
      )}
      <button onClick={() => adjustTime(taskId, 60000)}>+1m</button>
      <button onClick={() => adjustTime(taskId, -60000)}>-1m</button>
    </div>
  );
}
