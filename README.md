# Toy-Robot Simulator

An interactive 5×5 robot simulation built using React (frontend) and Express with SQLite (backend)

---
## Running the Project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

---
## Running the API Server

The backend server is built with Express and SQLite. To run the server:

```bash
cd server
npm install
npm start
```

This will start the API server on [http://localhost:3001](http://localhost:3001) by default. Make sure the frontend and backend are running in separate terminals.

The database file (`robot.db`) will be created automatically in the `server` directory.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
