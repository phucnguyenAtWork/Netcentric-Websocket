# Netcentric WebSocket Project

A real-time chat application with a Go backend and a Next.js (React + TypeScript) frontend, featuring JWT authentication, PostgreSQL database, and WebSocket-based communication. This project demonstrates a modern, scalable approach to building real-time web applications, with a focus on clean architecture, security, and extensibility.

## WebSocket in the Tech Stack

WebSocket is a core technology in this project, enabling real-time, bidirectional communication between the client and server. It is essential for features that require instant updates, such as chat messaging, user presence, and notifications.

A carefully selected technology stack ensures performance, security, and developer productivity:

**Backend (Go):** Uses the Gorilla WebSocket library to manage persistent WebSocket connections, handle chat room logic, broadcast messages, and track user presence. The server's hub pattern ensures efficient message routing and scalability.
- **Gin:** High-performance HTTP router for building RESTful APIs.
- **Gorilla WebSocket:** Robust WebSocket implementation for real-time communication.
- **PostgreSQL (lib/pq):** Reliable, scalable relational database for storing user data and (optionally) chat history.
- **JWT (golang-jwt/jwt):** Secure token-based authentication.
- **bcrypt:** Password hashing for secure credential storage.

**Frontend (Next.js):** Leverages the native WebSocket API to establish and maintain connections with the backend, send and receive chat messages, and update the UI in real time. The frontend also manages connection state and reconnections for a seamless user experience.
- **React + TypeScript:** Modern, type-safe UI development.
- **TailwindCSS:** Utility-first CSS framework for rapid UI development.
- **WebSocket API:** Native browser API for real-time communication.
- **Context API:** State management for authentication and chat state.

**Example Usage:**

*Frontend (React/TypeScript):*
```typescript
const ws = new WebSocket('ws://127.0.0.1:8080/ws/joinRoom/ROOM_ID');
ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'message', content: 'Hello, world!' }));
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Handle incoming message, update UI
};
```

*Backend (Go, Gorilla WebSocket):*
```go
conn, err := upgrader.Upgrade(w, r, nil)
if err != nil {
    log.Println("Upgrade error:", err)
    return
}
for {
    _, msg, err := conn.ReadMessage()
    if err != nil {
        break
    }
    // Broadcast or process message
}
```

## Features

This project offers a robust set of features for a modern chat application:
- **Real-time multi-room chat via WebSocket:** Users can join multiple chat rooms and exchange messages instantly, with all updates reflected in real time.
- **User authentication (JWT, bcrypt password hashing):** Secure registration and login, with passwords hashed using bcrypt and sessions managed via JWT tokens.
- **User presence and join/leave notifications:** The system tracks which users are online and provides notifications when users join or leave rooms.
- **Responsive UI with TailwindCSS:** The frontend is styled with TailwindCSS, ensuring a clean, modern, and mobile-friendly interface.
- **Context API for state management:** React Context API is used to manage authentication state and WebSocket connections across the app.
- **Secure (CORS, HTTP-only cookies):** Security best practices are followed, including CORS configuration and use of HTTP-only cookies for JWT tokens.
- **Extensible architecture (Repository, Service, Handler, Hub patterns):** The codebase is organized for maintainability and scalability, following established architectural patterns.

## Tech Stack



## Project Structure

The project is organized for clarity and scalability:

```
server/
  cmd/            # Entry point (main.go)
  db/             # Database layer (connection, migrations)
  internal/
    user/         # User domain: handlers, services, repositories, models
    ws/           # WebSocket domain: hub, client, handlers
  router/         # HTTP and WebSocket route definitions
  util/           # Utility functions (e.g., password hashing)

client/
  pages/          # Next.js pages (routing)
  components/     # Reusable React components (chat UI, forms, etc.)
  modules/        # Context providers for auth and WebSocket
  constants/      # Configuration constants
  styles/         # TailwindCSS and global styles

Makefile        # Database and build operations
```

## Server Flow

The backend server follows a clear initialization and request handling flow:
1. **Connect to PostgreSQL:** Establishes a database connection for user management and (optionally) message storage.
2. **Initialize user repository, service, handler:** Sets up the layers for user registration, authentication, and management.
3. **Create and run WebSocket hub (goroutine):** Launches the central hub for managing WebSocket connections and message routing.
4. **Setup HTTP and WebSocket routes:** Defines REST and WebSocket endpoints for user and chat operations.
5. **Start server on port 8080:** Begins listening for client connections.

### Authentication
- **POST /signup:** Register a new user. Passwords are hashed with bcrypt, and a JWT token is issued upon success.
- **POST /login:** Authenticate an existing user. Password is verified, and a JWT token is returned.
- **GET /logout:** Logs out the user by clearing the JWT cookie.

### WebSocket Chat
- **POST /ws/createRoom:** Create a new chat room.
- **GET /ws/joinRoom/:roomId:** Join a chat room via WebSocket upgrade.
- **GET /ws/getRooms:** Retrieve a list of available chat rooms.
- **GET /ws/getClients/:roomId:** Get a list of users in a specific room.

## Database Schema

The project uses a simple, extensible schema for user management:

```sql
CREATE TABLE "users" (
  "id" bigserial PRIMARY KEY,
  "username" varchar NOT NULL,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL
);
```

Additional tables can be added for chat messages, rooms, and other features as needed.

## Getting Started

Follow these steps to set up and run the project locally:

### Prerequisites
- **Go:** Backend development
- **Node.js & npm:** Frontend development
- **Docker:** For running PostgreSQL database

### Database Setup

```bash
make postgresinit   # Start PostgreSQL container
make createdb       # Create database
make migrateup      # Run migrations
```

### Run Application

```bash
# Backend
cd server
go run cmd/main.go

# Frontend
cd client
npm install
npm run dev
```

## Configuration

- **PostgreSQL:** user=admin, password=123456, db=go-chat, port=5432
- **CORS:** Frontend origin http://localhost:3000, credentials enabled
- **WebSocket URL:** ws://127.0.0.1:8080

## Potential & Future Improvements

The following features are planned or recommended for future versions:
- Persistent chat history (save messages to DB)
- File/image upload
- Private messaging (1-on-1)
- User roles (admin, moderator)
- Message reactions (emoji)
- Push notifications
- Rate limiting
- End-to-end encryption
- Integration with third-party authentication providers (OAuth, Google, Facebook, etc.)
- Mobile app support (React Native or Flutter)
- Advanced moderation tools (message filtering, user bans)
- Analytics dashboard for chat activity
- Internationalization (i18n) and localization
- Accessibility enhancements
- Deployment scripts and CI/CD pipeline

---

*Document generated: 29/05/2025*
*Version: 1.0*
