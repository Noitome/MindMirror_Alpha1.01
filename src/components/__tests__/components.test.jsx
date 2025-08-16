import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { describe, expect, test, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import MindMap from '../MindMap.jsx';
import ListView from '../ListView.jsx';
import RealityView from '../RealityView.jsx';
import TaskNode from '../TaskNode.jsx';
import Toolbar from '../Toolbar.jsx';
import useTaskStore from '../../store.js';

describe('UI components', () => {
  afterEach(() => {
    useTaskStore.setState({ tasks: [] });
    cleanup();
  });
  test('MindMap renders heading', () => {
    render(<MindMap />);
    expect(screen.getByRole('heading', { name: /mind map/i })).toBeInTheDocument();
  });

  test('ListView renders heading', () => {
    render(<ListView />);
    expect(screen.getByRole('heading', { name: /task list/i })).toBeInTheDocument();
  });

  test('RealityView renders heading', () => {
    render(<RealityView />);
    expect(screen.getByRole('heading', { name: /reality view/i })).toBeInTheDocument();
  });

  test('TaskNode renders title', () => {
    render(<TaskNode title="Example" />);
    expect(screen.getAllByRole('heading', { name: /example/i })[0]).toBeInTheDocument();
  });

  test('Toolbar renders buttons', () => {
    render(<Toolbar onAdd={() => {}} onExport={() => {}} onSwitch={() => {}} />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Download Data')).toBeInTheDocument();
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
});
