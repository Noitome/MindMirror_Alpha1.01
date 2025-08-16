import React, { useState } from 'react';
import Toolbar from './components/Toolbar.jsx';
import MindMap from './components/MindMap.jsx';
import ListView from './components/ListView.jsx';
import RealityView from './components/RealityView.jsx';
import useTaskStore from './store.js';
import './App.css';

export default function App() {
  const [view, setView] = useState('mind');
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const exportData = useTaskStore((s) => s.exportData);

  const handleAdd = () => {
    const title = `Task ${tasks.length + 1}`;
    addTask(title);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSwitch = () => {
    setView((prev) => (prev === 'mind' ? 'list' : prev === 'list' ? 'reality' : 'mind'));
  };

  const renderView = () => {
    if (view === 'list') return <ListView />;
    if (view === 'reality') return <RealityView />;
    return <MindMap />;
  };

  return (
    <div className="app">
      <Toolbar onAdd={handleAdd} onExport={handleExport} onSwitch={handleSwitch} />
      <div className="view-container column">{renderView()}</div>
    </div>
  );
}
