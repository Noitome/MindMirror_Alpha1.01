import React, { useState } from 'react';
import TaskNode from './TaskNode.jsx';
import useTaskStore from '../store.js';

const priorityOrder = { high: 0, medium: 1, low: 2 };
const statusOrder = { 'To-Do': 0, 'In-Progress': 1, Done: 2 };

export default function ListView() {
  const tasks = useTaskStore((s) => s.tasks);
  const [sortBy, setSortBy] = useState('none');

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
    }
    if (sortBy === 'status') {
      return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
    }
    return 0;
  });

  return (
    <section className="list-view">
      <h2>Task List</h2>
      <label>
        Sort by:
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="none">None</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
      </label>
      <div>
        {sorted.map((t) => (
          <TaskNode key={t.id} id={t.id} title={t.title} />
        ))}
      </div>
    </section>
  );
}
