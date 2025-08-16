import React from 'react';
import TaskNode from './TaskNode.jsx';
import useTaskStore from '../store.js';

export default function MindMap() {
  const tasks = useTaskStore((s) => s.tasks);
  return (
    <section className="mind-map">
      <h2>Mind Map</h2>
      <div className="mind-map-canvas">
        {tasks.map((t) => (
          <TaskNode key={t.id} id={t.id} title={t.title} />
        ))}
      </div>
    </section>
  );
}
