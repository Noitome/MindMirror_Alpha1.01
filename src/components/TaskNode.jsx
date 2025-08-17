import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Timer from './Timer.jsx';
import TimePie from './TimePie.jsx';
import useTaskStore from '../store.js';
import { priorityColors } from '../colors.js';

// Displays a task title with timer and editable metadata
export default function TaskNode({
  id,
  title = 'New Task',
  showNotes = false,
  parentId = null,
}) {
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const tasks = useTaskStore((s) => s.tasks);
  const taskId = useRef(id || Date.now().toString());
  const task = tasks.find((t) => t.id === taskId.current);
  const hasChildren = tasks.some((t) => t.parentId === taskId.current);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // ensure task exists in the store
  useEffect(() => {
    addTask(title, taskId.current, { parentId });
  }, [addTask, title, parentId]);

  const t =
    task || {
      title,
      priority: 'medium',
      status: 'To-Do',
      category: '',
      dueDate: '',
      notes: '',
    };

  return (
    <div
      className="task-node"
      style={{ border: `2px solid ${priorityColors[t.priority] || 'gray'}` }}
    >
      <h3 onClick={() => setOpen(true)}>{t.title}</h3>
      <div className="task-meta">
        <span>{t.status}</span>
        {t.category && <span> | {t.category}</span>}
        {t.dueDate && <span> | {new Date(t.dueDate).toLocaleDateString()}</span>}
      </div>
      <Timer taskId={taskId.current} />
      {hasChildren && <TimePie taskId={taskId.current} />}
      {showNotes && t.notes && (
        <div className="task-notes">
          <ReactMarkdown>
            {expanded || t.notes.length <= 100
              ? t.notes
              : `${t.notes.slice(0, 100)}...`}
          </ReactMarkdown>
          {t.notes.length > 100 && (
            <button onClick={() => setExpanded((e) => !e)}>
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          )}
        </div>
      )}
      {open && (
        <div className="modal">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              updateTask(taskId.current, {
                title: form.title.value,
                priority: form.priority.value,
                status: form.status.value,
                category: form.category.value,
                dueDate: form.dueDate.value,
                notes: form.notes.value,
              });
              setOpen(false);
            }}
          >
            <label>
              Title
              <input name="title" defaultValue={t.title} />
            </label>
            <label>
              Priority
              <select name="priority" defaultValue={t.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={t.status}>
                <option value="To-Do">To-Do</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Done">Done</option>
              </select>
            </label>
            <label>
              Category
              <input name="category" defaultValue={t.category} />
            </label>
            <label>
              Due Date
              <input type="date" name="dueDate" defaultValue={t.dueDate?.slice(0, 10)} />
            </label>
            <label>
              Notes
              <textarea name="notes" defaultValue={t.notes} />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
