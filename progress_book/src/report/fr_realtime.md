# 3.1.5. Real-Time Interaction (Chat & Notifications)

The Real-Time domain keeps users informed and connected without requiring them to
refresh or leave the platform.

### Requirements
- **Direct messaging.** Users can exchange direct messages, with a contact list
  and message history.
- **Real-time notifications.** The system delivers live notifications over
  **WebSockets** for relevant events — new messages, application stage changes,
  follows, and social engagement.
- **Event-driven delivery.** Notifications are produced by backend event
  listeners reacting to domain events, then pushed to connected clients.

### Acceptance criteria
- A notification appears for the recipient in real time, without a page reload.
- Messages are persisted and retrievable as conversation history.
- A user receives a notification when their application stage changes.
