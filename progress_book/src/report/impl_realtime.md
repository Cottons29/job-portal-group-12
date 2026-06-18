# 5.4. Real-Time Interaction

Real-time features keep users connected and informed without page reloads.

### Messaging
The messaging system provides direct conversations between users. The backend
exposes a chat schema with contact lists and message-retrieval controllers, and
messages are persisted so conversation history is available across sessions. On
the frontend, the messages feature consumes these endpoints and renders
conversations.

### Real-time notifications
Notifications are delivered live over **WebSockets**. The backend uses NestJS
**WebSocket gateways** together with **event listeners**: when a domain event
occurs — a new message, an application stage change, a new follower, or social
engagement — a listener produces a notification and pushes it to the relevant
connected client.

### Why event-driven?
Decoupling notification delivery from the domains that trigger it keeps modules
loosely coupled: the Applications module does not need to know how notifications
are delivered; it simply emits an event, and the notification listener handles the
rest. This is the same event-driven pattern described in
[4.2. Domain Breakdown & Communication](./arch_domains.md).

### Implementation notes
- WebSocket gateways manage connected clients and push events.
- Notifications cover messages, follows, engagement, and pipeline changes.
