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
  const exportCsv = useTaskStore((s) => s.exportCsv);
  const exportJson = useTaskStore((s) => s.exportJson);
  const importJson = useTaskStore((s) => s.importJson);
  const importCsv = useTaskStore((s) => s.importCsv);

  const handleAdd = () => {
    const title = `Task ${tasks.length + 1}`;
    addTask(title);
  };

  const download = (data, filename, type) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = () => {
    const data = exportCsv();
    download(data, 'tasks.csv', 'text/csv');
  };

  const handleExportJson = () => {
    const data = exportJson();
    download(data, 'tasks.json', 'application/json');
  };

  const handleImportJson = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => importJson(e.target.result);
    reader.readAsText(file);
  };

  const handleImportCsv = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => importCsv(e.target.result);
    reader.readAsText(file);
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
      <Toolbar
        onAdd={handleAdd}
        onExportCsv={handleExportCsv}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onImportCsv={handleImportCsv}
        onSwitch={handleSwitch}
      />
      <div className="view-container column">{renderView()}</div>
    </div>
  );
}
