# Toy-Robot Simulator

An interactive 5×5 robot simulation built with React (frontend) and Express + SQLite (backend).

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd robot-interview
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend API server

Open a new terminal and run:

```bash
cd server
npm install
npm start
```

The API server will run at [http://localhost:4000](http://localhost:4000) and create a `robot.db` file in the `server` directory.

### 4. Start the frontend (Next.js)

In the main project directory, run:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

---

## How to Use

1. Open [http://localhost:3000/robot](http://localhost:3000/robot) in your browser.
2. Click any cell to place the robot.
3. Use the Left, Move, and Right buttons to control the robot.
4. Click "Report" to see the robot's current position and direction.

The robot's position is saved in the database and restored on refresh.

---

## Project Structure

- `src/app/robot/` — Frontend React components and logic
- `server/` — Express API and SQLite database

---

## Troubleshooting

- Make sure both the frontend and backend servers are running in separate terminals.
- If you change backend code, restart the API server.
- If you see CORS or network errors, check that the backend is running on port 4000.

---

## License

MIT
