import React from 'react';
import TaskNode from './TaskNode.jsx';

export default function ListView() {
  return (
    <section className="list-view">
      <h2>Task List</h2>
      <div>
        <TaskNode title="First Task" />
        <TaskNode title="Second Task" />
      </div>
    </section>
  );
}
