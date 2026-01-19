## API Endpoints

Base URL prefix (from `config/app.js`): **`/api/v1`**

Swagger UI: **`GET /api/doc`**

---

### Health / Root

- **GET** `/`
  - **Description**: Simple health check, returns `"Hello Express Backend 🚀"`.
  - **Auth**: Not required.

---

### Swagger

- **GET** `/api/doc`
  - **Description**: Swagger UI (OpenAPI) documentation.
  - **Auth**: Not required.

---

### Authentication

- **POST** `/api/v1/auth/signin`
  - **Description**: Sign in with email and password.
  - **Auth**: Not required.
  - **Body (JSON)**:
    - `email` (string, required)
    - `password` (string, required)
  - **Response (200)**:
    - `token` (string, JWT)
    - `name` (string)
    - `createdAt` (string, ISO date)
    - `verified` (boolean)
    - `id` (string, user id)

- **POST** `/api/v1/auth/signup`
  - **Description**: Register new user.
  - **Auth**: Not required.
  - **Body (JSON)**:
    - `name` (string, optional)
    - `username` (string, required, unique)
    - `email` (string, required, unique)
    - `password` (string, required)
  - **Response (200)**:
    - `message: "Sign up successfully"`

---

### Users

- **GET** `/api/v1/user/list`
  - **Description**: Get all users (for now returns all users without password).
  - **Auth**: Not required (you may want to protect this later).
  - **Query params**: none.
  - **Response (200)**: `User[]` without `password`.

- **GET** `/api/v1/user/search/:id`
  - **Description**: Get user by MongoDB `_id`.
  - **Auth**: Not required.
  - **Path params**:
    - `id` (string, required) – user `_id`.
  - **Response (200)**: `User` without `password`, or **404** if not found.

- **GET** `/api/v1/user/search`
  - **Description**: Search users by keyword (username, name, or email; case-insensitive).
  - **Auth**: Not required (you may want to protect this later).
  - **Query params**:
    - `q` (string, required) – search keyword.
  - **Response (200)**: `User[]` without `password`.

- **PUT** `/api/v1/user/update/:id`
  - **Description**: Update user by id (no validation of fields yet).
  - **Auth**: Not required (you may want to protect this later).
  - **Path params**:
    - `id` (string, required) – user `_id`.
  - **Body (JSON)**:
    - Any subset of user fields to update (e.g. `name`, `username`, `email`).
  - **Response (200)**:
    - `message: "User updated successfully"`
    - `id` (string) – updated user id.

---

### Friends

All `/friends` endpoints are protected by `authDecode` and `isUser`:
- Requires header: `Authorization: Bearer <JWT>`.

- **POST** `/api/v1/friends/requests`
  - **Description**: Create a friend request from current user to another user.
  - **Body (JSON)**:
    - `toUserId` (string, required) – target user id.
  - **Response (201)**: Created `FriendRequest` object.

- **GET** `/api/v1/friends/requests`
  - **Description**: List all friend requests where current user is sender or receiver.
  - **Query params**: none.
  - **Response (200)**:
    - `FriendRequest[]` with populated `from` and `to` (fields: `username`, `name`, `email`).

- **POST** `/api/v1/friends/requests/:id/accept`
  - **Description**: Accept a pending friend request (only receiver can accept).
  - **Path params**:
    - `id` (string, required) – friend request id.
  - **Body**: none.
  - **Response (200)**:
    - `message: "Friend request accepted"`
    - Also updates both users’ `friends` list.

- **POST** `/api/v1/friends/requests/:id/reject`
  - **Description**: Reject a pending friend request (only receiver can reject).
  - **Path params**:
    - `id` (string, required) – friend request id.
  - **Body**: none.
  - **Response (200)**:
    - `message: "Friend request rejected"`

- **GET** `/api/v1/friends`
  - **Description**: Get current user’s friends list.
  - **Query params**: none.
  - **Response (200)**:
    - `User[]` – friends with fields `username`, `name`, `email`.

---

### Chats & Messages

All `/chats` endpoints are protected by `authDecode` and `isUser`:
- Requires header: `Authorization: Bearer <JWT>`.

- **POST** `/api/v1/chats`
  - **Description**: Create a new chat (direct or group).
  - **Body (JSON)**:
    - For direct chat:
      - `type: "direct"`
      - `participantId` (string, required) – other user id.
    - For group chat:
      - `type: "group"`
      - `name` (string, optional but recommended) – group name.
      - `participantIds` (string[], required) – member ids (current user added automatically).
  - **Response (201)**: Created `Chat` object.

- **GET** `/api/v1/chats`
  - **Description**: List chats that current user participates in.
  - **Query params**: none.
  - **Response (200)**:
    - `Chat[]` with:
      - `participants` populated (`username`, `name`, `email`)
      - `lastMessage` populated (with `sender` basic info)
      - Sorted by `updatedAt` desc.

- **GET** `/api/v1/chats/:chatId`
  - **Description**: Get a specific chat if current user is a participant.
  - **Path params**:
    - `chatId` (string, required) – chat id.
  - **Response (200)**:
    - `Chat` with populated `participants`.

- **PATCH** `/api/v1/chats/:chatId`
  - **Description**: Update chat info (mainly for group chats).
  - **Path params**:
    - `chatId` (string, required) – chat id.
  - **Body (JSON)** (all optional):
    - `name` (string) – new group name (only used when `type === "group"`).
    - `addParticipants` (string[]) – user ids to add.
    - `removeParticipants` (string[]) – user ids to remove.
  - **Response (200)**: Updated `Chat`.

- **GET** `/api/v1/chats/:chatId/messages`
  - **Description**: List messages in a chat, with simple pagination.
  - **Path params**:
    - `chatId` (string, required) – chat id.
  - **Query params** (optional):
    - `before` (string, ISO date) – only messages created before this time.
    - `limit` (number, default `20`) – max number of messages to return.
  - **Response (200)**:
    - `Message[]` with `sender` populated (`username`, `name`, `email`), sorted newest first.

- **POST** `/api/v1/chats/:chatId/messages`
  - **Description**: Create/send a new message in a chat.
  - **Path params**:
    - `chatId` (string, required) – chat id.
  - **Body (JSON)**:
    - `content` (string, required) – message text.
    - `type` (string, optional, default `"text"`) – message type.
  - **Response (201)**:
    - Created `Message` with populated `sender`.
    - Also updates chat `lastMessage` and `lastMessageAt`.

- **POST** `/api/v1/chats/:chatId/messages/:messageId/read`
  - **Description**: Mark a message as read by current user.
  - **Path params**:
    - `chatId` (string, required) – chat id.
    - `messageId` (string, required) – message id.
  - **Body**: none.
  - **Response (200)**:
    - `message: "Message marked as read"`

---

### Socket.io (Real-time)

Socket auth:
- Provide JWT via one of:
  - `io(url, { auth: { token } })`
  - `io(url, { query: { token } })`
  - `Authorization: Bearer <token>` header

Rooms:
- Clients should join chat rooms to receive real-time events for those chats.

#### Events (client -> server)

- **`chats:join`**
  - **Payload**: `{ chatIds: string[] }`
  - **Description**: Join multiple chat rooms.

- **`message:send`**
  - **Payload**: `{ chatId: string, content: string, type?: "text" }`
  - **Ack callback (optional)**: `(ack) => { ack = { data } | { error } }`
  - **Description**: Send a message. Server persists it in MongoDB and broadcasts `message:new` to that chat room.

- **`typing:start`**
  - **Payload**: `{ chatId: string }`
  - **Description**: Broadcast typing started to other users in the chat room.

- **`typing:stop`**
  - **Payload**: `{ chatId: string }`
  - **Description**: Broadcast typing stopped to other users in the chat room.

#### Events (server -> client)

- **`message:new`**
  - **Payload**: `Message` (populated with `sender` basic fields)
  - **Description**: Emitted when a new message is created (via socket `message:send` or HTTP `POST /api/v1/chats/:chatId/messages`).

- **`message:read`**
  - **Payload**: `{ chatId: string, messageId: string, userId: string }`
  - **Description**: Emitted when a user marks a message as read (via HTTP read endpoint).

- **`typing:start`**
  - **Payload**: `{ chatId: string, userId: string }`
  - **Description**: Another user started typing in the chat.

- **`typing:stop`**
  - **Payload**: `{ chatId: string, userId: string }`
  - **Description**: Another user stopped typing in the chat.


