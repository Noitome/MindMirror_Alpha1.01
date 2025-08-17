import useTaskStore from '../src/store.js';

describe('task store', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], nodes: [], edges: [] });
  });

  test('addTask adds a new task', () => {
    const { addTask } = useTaskStore.getState();
    addTask('Test Task', '1');
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ id: '1', title: 'Test Task' });
  });

  test('startTimer marks task as running', () => {
    const store = useTaskStore.getState();
    store.addTask('Timer Task', '1');
    const before = Date.now();
    store.startTimer('1');
    const t = useTaskStore.getState().tasks[0];
    expect(t.isRunning).toBe(true);
    expect(t.startTime).toBeGreaterThanOrEqual(before);
  });

  test('addNote updates task notes', () => {
    const store = useTaskStore.getState();
    store.addTask('Note Task', '1');
    store.addNote('1', 'Remember this');
    const t = useTaskStore.getState().tasks[0];
    expect(t.notes).toBe('Remember this');
  });

  test('subtask time adds to parent', () => {
    const store = useTaskStore.getState();
    store.addTask('Parent', 'p');
    store.addTask('Child', 'c', { parentId: 'p' });
    store.adjustTime('c', 60000);
    const parent = useTaskStore
      .getState()
      .tasks.find((t) => t.id === 'p');
    const child = useTaskStore
      .getState()
      .tasks.find((t) => t.id === 'c');
    expect(child.elapsed).toBe(60000);
    expect(parent.elapsed).toBe(60000);
  });

  test('parent timer requires note to save', () => {
    const store = useTaskStore.getState();
    store.addTask('Parent', 'p');
    store.addTask('Child', 'c', { parentId: 'p' });
    store.startTimer('p');
    const start = Date.now() - 60000;
    useTaskStore.setState((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === 'p' ? { ...t, startTime: start } : t
      ),
    }));
    store.stopTimer('p');
    let parent = useTaskStore
      .getState()
      .tasks.find((t) => t.id === 'p');
    expect(parent.elapsed).toBe(0);
    store.updateTask('p', { notes: 'summary' });
    store.startTimer('p');
    const start2 = Date.now() - 60000;
    useTaskStore.setState((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === 'p' ? { ...t, startTime: start2 } : t
      ),
    }));
    store.stopTimer('p');
    parent = useTaskStore
      .getState()
      .tasks.find((t) => t.id === 'p');
    expect(parent.elapsed).toBeGreaterThanOrEqual(60000);
  });
});
