// Run with: node websocket-server.js

const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;

// Store workspace states and connected clients
// workspaceId -> { state, clients: Map<userId, {ws, userName, accessLevel}> }
const workspaces = new Map();

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  let currentWorkspaceId = null;
  let currentUserId = null;
  let currentUserName = null;
  let currentAccessLevel = 'edit';

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'join':
          handleJoin(ws, message);
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;

        case 'sync:request':
          handleSyncRequest(ws, message);
          break;

        default:
          // Check if user has edit access for edit actions
          if (isEditAction(message.type) && currentAccessLevel === 'view') {
            ws.send(
              JSON.stringify({
                type: 'access:denied',
                reason: 'You do not have edit access to this workspace'
              })
            );
            return;
          }

          // Broadcast message to all clients in the same workspace
          broadcast(message, ws);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');

    if (currentWorkspaceId && currentUserId) {
      const workspace = workspaces.get(currentWorkspaceId);
      if (workspace) {
        workspace.clients.delete(currentUserId);

        // Notify others that user left
        broadcast(
          {
            type: 'user:left',
            userId: currentUserId
          },
          null,
          currentWorkspaceId
        );

        // Send updated user list to remaining clients
        sendUserList(currentWorkspaceId);

        // Clean up empty workspaces
        if (workspace.clients.size === 0) {
          workspaces.delete(currentWorkspaceId);
          console.log(`Workspace ${currentWorkspaceId} deleted (no active users)`);
        }
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  function handleJoin(ws, message) {
    const { workspaceId, userId, userName, accessLevel = 'edit' } = message;
    currentWorkspaceId = workspaceId;
    currentUserId = userId;
    currentUserName = userName || 'Anonymous';
    currentAccessLevel = accessLevel;

    // Initialize workspace if it doesn't exist
    if (!workspaces.has(workspaceId)) {
      workspaces.set(workspaceId, {
        state: {
          tables: [],
          groups: [],
          relationships: [],
          workspaceName: 'Untitled Workspace'
        },
        clients: new Map()
      });
      console.log(`Workspace ${workspaceId} created`);
    }

    const workspace = workspaces.get(workspaceId);
    workspace.clients.set(userId, {
      ws,
      userName: currentUserName,
      accessLevel: currentAccessLevel
    });

    console.log(`User ${userId} (${currentUserName}) joined workspace ${workspaceId} with ${currentAccessLevel} access`);

    // Send current state to the new client
    ws.send(
      JSON.stringify({
        type: 'sync:state',
        state: workspace.state
      })
    );

    // Notify others that a new user joined
    broadcast(
      {
        type: 'user:joined',
        userId: userId,
        userName: currentUserName,
        accessLevel: currentAccessLevel
      },
      ws,
      workspaceId
    );

    // Send current user list to the new user and all clients
    sendUserList(workspaceId);
  }

  function handleSyncRequest(ws, message) {
    if (currentWorkspaceId) {
      const workspace = workspaces.get(currentWorkspaceId);
      if (workspace) {
        ws.send(
          JSON.stringify({
            type: 'sync:state',
            state: workspace.state
          })
        );
      }
    }
  }

  function sendUserList(workspaceId) {
    const workspace = workspaces.get(workspaceId);
    if (!workspace) return;

    const users = Array.from(workspace.clients.entries()).map(([id, client]) => ({
      id,
      name: client.userName,
      accessLevel: client.accessLevel
    }));

    const message = JSON.stringify({
      type: 'users:list',
      users
    });

    workspace.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(message);
      }
    });
  }

  function broadcast(message, sender, workspaceId = currentWorkspaceId) {
    if (!workspaceId) return;

    const workspace = workspaces.get(workspaceId);
    if (!workspace) return;

    // Update workspace state based on message type
    updateWorkspaceState(workspace, message);

    // Broadcast to all clients in the workspace except sender
    workspace.clients.forEach((client) => {
      if (client.ws !== sender && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  function updateWorkspaceState(workspace, message) {
    const { state } = workspace;

    switch (message.type) {
      case 'table:create':
        state.tables.push(message.table);
        break;

      case 'table:update':
        const tableIndex = state.tables.findIndex((t) => t.id === message.tableId);
        if (tableIndex !== -1) {
          state.tables[tableIndex] = {
            ...state.tables[tableIndex],
            ...message.updates
          };
        }
        break;

      case 'table:delete':
        state.tables = state.tables.filter((t) => t.id !== message.tableId);
        break;

      case 'group:create':
        state.groups.push(message.group);
        break;

      case 'group:update':
        const groupIndex = state.groups.findIndex((g) => g.id === message.groupId);
        if (groupIndex !== -1) {
          state.groups[groupIndex] = {
            ...state.groups[groupIndex],
            ...message.updates
          };
        }
        break;

      case 'group:delete':
        state.groups = state.groups.filter((g) => g.id !== message.groupId);
        break;

      case 'workspace:name':
        state.workspaceName = message.name;
        break;
    }
  }

  function isEditAction(type) {
    const editActions = ['table:create', 'table:update', 'table:delete', 'group:create', 'group:update', 'group:delete', 'workspace:name'];
    return editActions.includes(type);
  }
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
  console.log(`Connect to: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
