import React from 'react';
import TaskNode from './TaskNode.jsx';

export default function MindMap() {
  return (
    <section className="mind-map">
      <h2>Mind Map</h2>
      <div className="mind-map-canvas">
        <TaskNode title="Sample Idea" />
      </div>
    </section>
  );
}
