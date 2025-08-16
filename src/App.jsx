import React, { useState } from 'react';
import Toolbar from './components/Toolbar.jsx';
import MindMap from './components/MindMap.jsx';
import ListView from './components/ListView.jsx';
import RealityView from './components/RealityView.jsx';
import './App.css';

export default function App() {
  const [view, setView] = useState('mind');

  const handleAdd = () => {
    alert('Add Task clicked');
  };

  const handleExport = () => {
    alert('Export CSV clicked');
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
