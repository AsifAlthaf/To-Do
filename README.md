# To-Do
A simple React ToDo application with a backend in server.js  that manages and saves to-dos using MongoDB Atlas.

# Fullstack Todo App (React + Node + MongoDB)

This workspace contains a minimal fullstack todo application.

Backend: [server/index.js](server/index.js)
Frontend: [client/src/App.jsx](client/src/App.jsx)

Quick start

1. Start MongoDB locally or create an Atlas cluster and get a connection URI.
2. Create a `.env` file in the `server/.env` and set `MONGO_URI` and `PORT`.

Backend

```bash
cd server
npm install
npm run dev
```

Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 to use the app. The backend runs on port 5000 by default.
