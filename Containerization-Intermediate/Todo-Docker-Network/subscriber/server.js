import express from "express";
import dotenv from "dotenv";
import db from "./db.js";
import { nanoid } from "nanoid";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Modern UI for Subscriber
app.get("/", async (req, res) => {
  await db.read();
  const todos = db.data.todos;
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Subscriber App</title>
      <script>
        async function loadTodos() {
          const res = await fetch('/api/todos');
          const data = await res.json();
          const list = document.getElementById('todos');
          list.innerHTML = data.map(t => \`<li class="p-2 bg-white/10 rounded-md">\${t.text}</li>\`).join('');
        }
        window.onload = loadTodos;
      </script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-r from-green-400 to-teal-500 min-h-screen text-white flex flex-col items-center justify-center">
      <div class="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-xl w-96 text-center">
        <h1 class="text-3xl font-bold mb-4">📩 Subscriber</h1>
        <ul id="todos" class="space-y-2 text-left"></ul>
      </div>
    </body>
    </html>
  `);
});

app.get("/api/todos", async (req, res) => {
  await db.read();
  res.json(db.data.todos);
});

app.post("/api/todos", async (req, res) => {
  const todo = { id: nanoid(), text: req.body.text, receivedAt: Date.now() };
  db.data.todos.push(todo);
  await db.write();
  res.json(todo);
});

app.listen(PORT, () => console.log(`📨 Subscriber running on port ${PORT}`));

