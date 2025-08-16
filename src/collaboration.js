// Placeholder utilities for future real-time collaboration features.
// Currently logs actions and does not perform any network activity.

let socket = null;

export function connectToCollaborationServer(roomId = 'default-room') {
  // TODO: Replace with real WebSocket connection logic.
  console.warn('connectToCollaborationServer is a stub.', roomId);
  socket = null;
}

export function broadcastTaskUpdate(task) {
  // TODO: Send task updates to the collaboration server.
  console.warn('broadcastTaskUpdate is a stub.', task);
  if (!socket) return;
  try {
    socket.send(JSON.stringify({ type: 'task:update', payload: task }));
  } catch (err) {
    console.error('WebSocket send failed:', err);
  }
}

export function onRemoteTaskUpdate(handler) {
  // TODO: Listen for updates from remote collaborators.
  console.warn('onRemoteTaskUpdate is a stub.');
  // Return a no-op unsubscribe function for now.
  return () => {};
}
