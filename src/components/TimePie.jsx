import React from 'react';
import useTaskStore from '../store.js';
import { priorityColors } from '../colors.js';

export default function TimePie({ taskId }) {
  const tasks = useTaskStore((s) => s.tasks);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;
  const children = tasks.filter((t) => t.parentId === taskId);
  const total = task.elapsed || 0;
  let current = 0;
  const segments = [];
  children.forEach((child) => {
    const pct = total > 0 ? (child.elapsed / total) * 100 : 0;
    segments.push(
      `${priorityColors[child.priority] || priorityColors.default} ${current}% ${
        current + pct
      }%`
    );
    current += pct;
  });
  const childrenTotal = children.reduce((sum, c) => sum + c.elapsed, 0);
  if (total > childrenTotal) {
    const pct = total > 0 ? ((total - childrenTotal) / total) * 100 : 0;
    segments.push(
      `${priorityColors[task.priority] || priorityColors.default} ${current}% ${
        current + pct
      }%`
    );
  }
  const background = `conic-gradient(${segments.join(',')})`;
  return (
    <div
      data-testid="time-pie"
      className="time-pie"
      style={{ width: 80, height: 80, borderRadius: '50%', background }}
    />
  );
}
