import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, expect, test, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import MindMap from '../MindMap.jsx';
import ListView from '../ListView.jsx';
import RealityView from '../RealityView.jsx';
import TaskNode from '../TaskNode.jsx';
import Toolbar from '../Toolbar.jsx';
import TimePie from '../TimePie.jsx';
import useTaskStore from '../../store.js';

describe('UI components', () => {
  afterEach(() => {
    useTaskStore.setState({ tasks: [], nodes: [], edges: [] });
    cleanup();
  });
  test('MindMap renders heading', () => {
    render(<MindMap />);
    expect(
      screen.getByRole('heading', { name: /mind map/i })
    ).toBeInTheDocument();
  });

  test('ListView renders heading', () => {
    render(<ListView />);
    expect(
      screen.getByRole('heading', { name: /task list/i })
    ).toBeInTheDocument();
  });

  test('RealityView renders heading', () => {
    render(<RealityView />);
    expect(
      screen.getByRole('heading', { name: /reality view/i })
    ).toBeInTheDocument();
  });

  test('TaskNode renders title', () => {
    render(<TaskNode title="Example" />);
    expect(
      screen.getAllByRole('heading', { name: /example/i })[0]
    ).toBeInTheDocument();
  });

  test('Toolbar renders buttons', () => {
    render(
      <Toolbar
        onAdd={() => {}}
        onExportCsv={() => {}}
        onExportJson={() => {}}
        onImportJson={() => {}}
        onImportCsv={() => {}}
        onSwitch={() => {}}
      />
    );
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Import JSON')).toBeInTheDocument();
    expect(screen.getByText('Import CSV')).toBeInTheDocument();
    expect(screen.getByText('Switch View')).toBeInTheDocument();
  });

  test('ListView sorts by priority', () => {
    const addTask = useTaskStore.getState().addTask;
    addTask('Low', '1', { priority: 'low' });
    addTask('High', '2', { priority: 'high' });
    render(<ListView />);
    fireEvent.change(screen.getByLabelText(/sort by/i), {
      target: { value: 'priority' },
    });
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('High');
  });

  test('TimePie renders pie chart with child times', () => {
    const addTask = useTaskStore.getState().addTask;
    addTask('Parent', 'p', { elapsed: 180000 });
    addTask('Child1', 'c1', { parentId: 'p', elapsed: 60000, priority: 'high' });
    addTask('Child2', 'c2', { parentId: 'p', elapsed: 60000, priority: 'low' });
    render(<TimePie taskId="p" />);
    const pie = screen.getByTestId('time-pie');
    expect(pie).toBeInTheDocument();
    expect(pie.style.background).toContain('conic-gradient');
  });
});
