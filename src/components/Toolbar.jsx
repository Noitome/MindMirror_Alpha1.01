import React from 'react';

export default function Toolbar({ onAdd, onExport, onSwitch }) {
  return (
    <div className="toolbar">
      <button onClick={onAdd}>Add Task</button>
      <button onClick={onExport}>Export CSV</button>
      <button onClick={onSwitch}>Switch View</button>
    </div>
  );
}
