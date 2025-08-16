import React from 'react';
import TaskNode from './TaskNode.jsx';
import useTaskStore from '../store.js';

export default function ListView() {
  const tasks = useTaskStore((s) => s.tasks);
  return (
    <section className="list-view">
      <h2>Task List</h2>
      <div>
        {tasks.map((t) => (
          <TaskNode key={t.id} id={t.id} title={t.title} />
        ))}
      </div>
    </section>
  );
}
