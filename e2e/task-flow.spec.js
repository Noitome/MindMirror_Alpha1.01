import { test, expect } from '@playwright/test';

test('create tasks, link them, export CSV', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.getByText('Add Task').click();
  await page.getByText('Add Task').click();
  await expect(page.getByRole('heading', { name: 'Task 1' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Task 2' })).toBeVisible();

  const edgeCount = await page.evaluate(async () => {
    const { default: useTaskStore } = await import('/src/store.js');
    const store = useTaskStore.getState();
    const [t1, t2] = store.tasks;
    store.setNodes([
      { id: t1.id, data: { label: t1.title }, position: { x: 0, y: 0 } },
      { id: t2.id, data: { label: t2.title }, position: { x: 100, y: 0 } },
    ]);
    store.setEdges([{ id: 'e1', source: t1.id, target: t2.id }]);
    return useTaskStore.getState().edges.length;
  });
  expect(edgeCount).toBe(1);

  const csv = await page.evaluate(async () => {
    const { default: useTaskStore } = await import('/src/store.js');
    return useTaskStore.getState().exportCsv();
  });
  expect(csv).toContain('Task 1');
  expect(csv).toContain('Task 2');
});
