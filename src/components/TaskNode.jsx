import React, { useEffect, useRef } from 'react';
import Timer from './Timer.jsx';
import useTaskStore from '../store.js';

// Displays a task title with an attached timer
export default function TaskNode({ id, title = 'New Task' }) {
  const addTask = useTaskStore((s) => s.addTask);
  const taskId = useRef(id || Date.now().toString());

  // ensure task exists in the store
  useEffect(() => {
    addTask(title, taskId.current);
  }, [addTask, title]);

  return (
    <div className="task-node">
      <h3>{title}</h3>
      <Timer taskId={taskId.current} />
    </div>
  );
}
