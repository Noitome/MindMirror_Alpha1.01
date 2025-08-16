import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import MindMap from '../MindMap.jsx';
import ListView from '../ListView.jsx';
import RealityView from '../RealityView.jsx';
import TaskNode from '../TaskNode.jsx';
import Toolbar from '../Toolbar.jsx';

describe('UI components', () => {
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
    expect(screen.getByRole('heading', { name: /example/i })).toBeInTheDocument();
  });

  test('Toolbar renders buttons', () => {
    render(<Toolbar onAdd={() => {}} onExport={() => {}} onSwitch={() => {}} />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
    expect(screen.getByText('Switch View')).toBeInTheDocument();
  });
});
