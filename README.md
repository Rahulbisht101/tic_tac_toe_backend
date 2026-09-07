# Multiplayer Tic-Tac-Toe Realtime API

A robust Node.js backend providing RESTful APIs and real-time Socket.IO communication for a Tic-Tac-Toe gaming application. Includes user authentication, profile management with Cloudinary image uploads, room creation (Player vs Player or Player vs Bot), and live game state synchronization.

---

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication for securing endpoints.
- **Media Storage**: Profile picture upload handling using `Multer` (in-memory) and storage via `Cloudinary`.
- **Validation**: Schema-based request body validation powered by `Zod`.
- **Game & Room Management**:
  - Create custom game rooms with game mode selection (`bot` or `player`), color selection, and unique room codes.
  - Join rooms using room codes.
  - Real-time game board state updates & win/draw calculation.
- **Real-Time WebSockets**: Powered by `Socket.IO` for instantaneous room updates and turn-by-turn table events.
- **Database**: MongoDB with Mongoose object data modeling.

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB (Mongoose ODM)
- **Real-Time Engine**: Socket.IO
- **Authentication**: JSON Web Tokens (jsonwebtoken)
- **Validation**: Zod
- **File Uploads**: Multer & Cloudinary
- **Dev Tooling**: Nodemon

---

## 📂 Project Structure

```text
practice/
├── app.js                   # Server entry point & Socket.IO event setup
├── package.json             # Project dependencies and npm scripts
├── .env                     # Environment variables configuration
└── src/
    ├── config/
    │   ├── db.js            # MongoDB connection configuration
    │   └── cloudinary.js    # Cloudinary SDK configuration
    ├── controllers/
    │   ├── room.controllers.js
    │   └── user.controllers.js
    ├── middleware/
    │   ├── upload.js        # Multer memory storage middleware
    │   └── user.middleware.js # JWT Bearer token authentication middleware
    ├── models/
    │   ├── room.model.js    # Schema for rooms & game state
    │   └── user.model.js    # Schema for users
    ├── routes/
    │   ├── room.route.js    # Room & game API endpoints
    │   └── user.routes.js   # User auth & profile API endpoints
    ├── service/
    │   ├── room.service.js
    │   └── user.service.js
    ├── utils/
    │   ├── game.js          # Tic-Tac-Toe win & draw checking logic
    │   ├── jwt.js           # Token generation helpers
    │   └── uploadToCloudinary.js # Buffer upload helper for Cloudinary
    └── validations/
        ├── room.validation.js # Zod schemas for room endpoints
        └── user.validation.js # Zod schemas for user endpoints
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚙️ Installation & Setup

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Set up your `.env` file as shown above.

3. **Run the server in development mode**:
   ```bash
   npm run dev
   ```

4. **Run the server in production mode**:
   ```bash
   npm start
   ```

Default server port will be `http://localhost:8080` (or as defined in your `.env`).

---

## 📡 API Endpoints

### 👤 User Endpoints (`/user`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/register` | No | Register a new user (`multipart/form-data` with `profilePic`) |
| `POST` | `/user/login` | No | Authenticate user & return JWT token |
| `GET` | `/user/` | Yes | Get list of all users |
| `GET` | `/user/:id` | Yes | Get details of a specific user |
| `POST` | `/user/` | Yes | Update user details & profile picture |
| `DELETE`| `/user/:id` | Yes | Delete user by ID |

*Note: For authenticated routes, pass `Authorization: Bearer <token>` in headers.*

---

### 🎮 Room Endpoints (`/room`)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/room/create` | Yes | Create a new game room |
| `POST` | `/room/join` | Yes | Join an existing room via code |
| `GET` | `/room/` | Yes | Retrieve room list |
| `GET` | `/room/:id` | Yes | Get room details by room ID |
| `POST` | `/room/updateTable` | Yes | Update game board state & check game result |

---

## 🔌 Socket.IO Events

Connect to the Socket.IO server on `http://localhost:8080`.

### Client Listener Events
- `joined_room`: Emitted to room members when a new player enters.
- `receive_table`: Emitted to room members when game board state is updated.

### Client Emitter Events
- `join_room` (`roomId`): Joins a specific Socket room.
- `send_table` (`{ roomId, message }`): Broadcasts updated game payload to other player in the room.

---

## 📝 License

This project is open source and available under the [ISC License](LICENSE).
