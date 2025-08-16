import React, { useRef } from 'react';

export default function Toolbar({
  onAdd,
  onExportCsv,
  onExportJson,
  onImportJson,
  onImportCsv,
  onSwitch,
}) {
  const jsonRef = useRef(null);
  const csvRef = useRef(null);

  return (
    <div className="toolbar">
      <button onClick={onAdd}>Add Task</button>
      <button onClick={onExportCsv}>Export CSV</button>
      <button onClick={onExportJson}>Export JSON</button>
      <input
        type="file"
        accept=".json"
        ref={jsonRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onImportJson(file);
          e.target.value = '';
        }}
      />
      <button onClick={() => jsonRef.current?.click()}>Import JSON</button>
      <input
        type="file"
        accept=".csv"
        ref={csvRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) onImportCsv(file);
          e.target.value = '';
        }}
      />
      <button onClick={() => csvRef.current?.click()}>Import CSV</button>
      <button onClick={onSwitch}>Switch View</button>
    </div>
  );
}

