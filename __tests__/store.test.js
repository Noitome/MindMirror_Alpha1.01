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
});
