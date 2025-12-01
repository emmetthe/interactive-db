export type WSMessage =
  | { type: 'join'; workspaceId: string; userId: string; userName: string; accessLevel: 'view' | 'edit' }
  | { type: 'table:create'; table: any }
  | { type: 'table:update'; tableId: string; updates: any }
  | { type: 'table:delete'; tableId: string }
  | { type: 'group:create'; group: any }
  | { type: 'group:update'; groupId: string; updates: any }
  | { type: 'group:delete'; groupId: string }
  | { type: 'workspace:name'; name: string }
  | { type: 'cursor:move'; userId: string; x: number; y: number; userName: string }
  | { type: 'user:joined'; userId: string; userName: string; accessLevel: 'view' | 'edit' }
  | { type: 'user:left'; userId: string }
  | { type: 'users:list'; users: Array<{ id: string; name: string; accessLevel: 'view' | 'edit' }> }
  | { type: 'sync:request' }
  | { type: 'sync:state'; state: any }
  | { type: 'access:denied'; reason: string };

interface WebSocketClientOptions {
  workspaceId: string;
  userId: string;
  userName: string;
  accessLevel: 'view' | 'edit';
  onMessage: (message: WSMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private options: WebSocketClientOptions;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageQueue: WSMessage[] = [];

  constructor(options: WebSocketClientOptions) {
    this.options = options;
  }

  connect(wsUrl: string) {
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;

        // Join workspace with access level
        this.send({
          type: 'join',
          workspaceId: this.options.workspaceId,
          userId: this.options.userId,
          userName: this.options.userName,
          accessLevel: this.options.accessLevel
        });

        // Send queued messages
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();
          if (message) this.send(message);
        }

        // Start heartbeat
        this.startHeartbeat();

        if (this.options.onConnect) {
          this.options.onConnect();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;
          this.options.onMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();

        if (this.options.onDisconnect) {
          this.options.onDisconnect();
        }

        // Attempt to reconnect
        this.attemptReconnect(wsUrl);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (this.options.onError) {
          this.options.onError(error);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }

  private attemptReconnect(wsUrl: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect(wsUrl);
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  send(message: WSMessage) {
    // Only allow edit actions if user has edit access
    if (this.options.accessLevel === 'view' && this.isEditAction(message)) {
      console.warn('User does not have edit access');
      return;
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for sending when connection is established
      this.messageQueue.push(message);
    }
  }

  private isEditAction(message: WSMessage): boolean {
    const editActions = ['table:create', 'table:update', 'table:delete', 'group:create', 'group:update', 'group:delete', 'workspace:name'];
    return editActions.includes(message.type);
  }

  updateAccessLevel(accessLevel: 'view' | 'edit') {
    this.options.accessLevel = accessLevel;
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getAccessLevel(): 'view' | 'edit' {
    return this.options.accessLevel;
  }
}
