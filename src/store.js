import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  connectToCollaborationServer,
  broadcastTaskUpdate,
  onRemoteTaskUpdate,
} from './collaboration.js';
import {
  getTaskSplitSuggestions as fetchTaskSplitSuggestions,
  getDueDateRecommendation as fetchDueDateRecommendation,
} from './ai.js';

// Task timer store with persistence
const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      nodes: [],
      edges: [],
      addTask: (title, id, attrs = {}) =>
        set((state) => {
          const taskId = id || Date.now().toString();
          if (state.tasks.find((t) => t.id === taskId)) return state; // avoid duplicates
          return {
            tasks: [
              ...state.tasks,
              {
                id: taskId,
                title,
                elapsed: attrs.elapsed || 0,
                isRunning: false,
                startTime: null,
                priority: attrs.priority || 'medium',
                status: attrs.status || 'To-Do',
                category: attrs.category || '',
                dueDate: attrs.dueDate || null,
                notes: attrs.notes || '',
                parentId: attrs.parentId || null,
              },
            ],
          };
        }),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      startTimer: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isRunning: true, startTime: Date.now() } : t
          ),
        })),
      stopTimer: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;
          const now = Date.now();
          const added = task.startTime ? now - task.startTime : 0;
          const hasChildren = state.tasks.some((t) => t.parentId === id);
          if (hasChildren && !task.notes) {
            return {
              tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, isRunning: false, startTime: null } : t
              ),
            };
          }
          return {
            tasks: state.tasks.map((t) => {
              if (t.id === id) {
                return {
                  ...t,
                  isRunning: false,
                  elapsed: t.elapsed + added,
                  startTime: null,
                };
              }
              if (t.id === task.parentId) {
                return { ...t, elapsed: t.elapsed + added };
              }
              return t;
            }),
          };
        }),
      updateRunningTime: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id || !t.isRunning) return t;
            const now = Date.now();
            const elapsed = t.elapsed + (t.startTime ? now - t.startTime : 0);
            return { ...t, elapsed, startTime: now };
          }),
        })),
      addNote: (id, note) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, notes: note } : t
          ),
        })),
      adjustTime: (id, amount) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;
          return {
            tasks: state.tasks.map((t) => {
              if (t.id === id) {
                return {
                  ...t,
                  elapsed: Math.max(0, t.elapsed + amount),
                };
              }
              if (t.id === task.parentId) {
                return {
                  ...t,
                  elapsed: Math.max(0, t.elapsed + amount),
                };
              }
              return t;
            }),
          };
        }),
      exportCsv: () => {
        const header = 'id,title,elapsed_ms';
        const rows = get().tasks.map(
          (t) => `${t.id},${t.title.replace(/,/g, '')},${t.elapsed}`
        );
        return [header, ...rows].join('\n');
      },
      exportData: () => get().exportCsv(),
      exportJson: () =>
        JSON.stringify({
          tasks: get().tasks,
          nodes: get().nodes,
          edges: get().edges,
        }),
      importJson: (json) => {
        try {
          const data = JSON.parse(json);
          set({
            tasks: data.tasks || [],
            nodes: data.nodes || [],
            edges: data.edges || [],
          });
        } catch (e) {
          console.error('Invalid JSON import');
        }
      },
      importCsv: (csv) => {
        const lines = csv.trim().split('\n');
        const [, ...rows] = lines;
        const tasks = rows
          .map((row) => row.split(','))
          .filter((parts) => parts.length >= 3)
          .map(([id, title, elapsed]) => ({
            id,
            title,
            elapsed: parseInt(elapsed, 10) || 0,
            isRunning: false,
            startTime: null,
            priority: 'medium',
            status: 'To-Do',
            category: '',
            dueDate: null,
            notes: '',
          }));
        set({ tasks });
      },
      initCollaboration: () => {
        connectToCollaborationServer('main');
        onRemoteTaskUpdate((update) => {
          console.warn('Remote update received:', update);
        });
      },
      syncTaskUpdate: (task) => broadcastTaskUpdate(task),
      getTaskSplitSuggestions: async (task) => fetchTaskSplitSuggestions(task),
      getDueDateRecommendation: async (task) =>
        fetchDueDateRecommendation(task),
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
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
