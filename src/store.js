import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Task timer store with persistence
const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (title, id) => set((state) => {
        const taskId = id || Date.now().toString();
        if (state.tasks.find((t) => t.id === taskId)) return state; // avoid duplicates
        return {
          tasks: [
            ...state.tasks,
            { id: taskId, title, elapsed: 0, isRunning: false, startTime: null },
          ],
        };
      }),
      startTimer: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isRunning: true, startTime: Date.now() } : t
          ),
        })),
      stopTimer: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const now = Date.now();
            const elapsed = t.elapsed + (t.startTime ? now - t.startTime : 0);
            return { ...t, isRunning: false, elapsed, startTime: null };
          }),
        })),
      updateRunningTime: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id || !t.isRunning) return t;
            const now = Date.now();
            const elapsed = t.elapsed + (t.startTime ? now - t.startTime : 0);
            return { ...t, elapsed, startTime: now };
          }),
        })),
      adjustTime: (id, amount) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, elapsed: Math.max(0, t.elapsed + amount) }
              : t
          ),
        })),
      exportData: () => {
        const header = 'id,title,elapsed_ms';
        const rows = get().tasks.map(
          (t) => `${t.id},${t.title.replace(/,/g, '')},${t.elapsed}`
        );
        return [header, ...rows].join('\n');
      },
    }),
    {
      name: 'task-store',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);

export default useTaskStore;
