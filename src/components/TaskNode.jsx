import React from 'react';

export default function TaskNode({ title = 'New Task' }) {
  return (
    <div className="task-node">
      <h3>{title}</h3>
    </div>
  );
}
