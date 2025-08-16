import { render, screen, cleanup } from '@testing-library/react';
import { describe, expect, test, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import MindMap from '../MindMap.jsx';
import ListView from '../ListView.jsx';
import RealityView from '../RealityView.jsx';
import TaskNode from '../TaskNode.jsx';
import Toolbar from '../Toolbar.jsx';

describe('UI components', () => {
  afterEach(() => cleanup());
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
});
