import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { nanoid } from "nanoid";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 4000;
const SUBSCRIBER_URL = process.env.SUBSCRIBER_URL || "http://subscriber:5000/api/todos";

// Serve modern gradient UI
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Publisher TODOs</title>
<script>
  async function addTodo() {
    const text = document.getElementById('todoInput').value.trim();
    if (!text) return alert('Enter a todo');
    const res = await fetch('/local/todos', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    document.getElementById('todoInput').value = '';
    loadTodos();
  }

  async function loadTodos() {
    const res = await fetch('/local/todos');
    const todos = await res.json();
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    todos.forEach(t => {
      list.innerHTML += \`<li class="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg my-2">\${t.text}</li>\`;
    });
  }

  window.onload = loadTodos;
</script>
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-r from-purple-500 to-indigo-600 min-h-screen flex flex-col items-center justify-center text-white font-sans">
  <div class="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96">
    <h1 class="text-3xl font-bold mb-4 text-center">Publisher TODOs</h1>
    <div class="flex space-x-2 mb-4">
      <input id="todoInput" type="text" placeholder="Add a task..." class="flex-1 px-3 py-2 rounded-lg text-gray-900 focus:outline-none">
      <button onclick="addTodo()" class="bg-gradient-to-r from-pink-500 to-yellow-400 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">Add</button>
    </div>
    <ul id="todoList" class="list-none"></ul>
  </div>
</body>
</html>
  `);
});

// API routes
app.get("/local/todos", async (req, res) => {
  await db.read();
  res.json(db.data.todos);
});

app.post("/local/todos", async (req, res) => {
  const todo = { id: nanoid(6), text: req.body.text, createdAt: Date.now() };
  await db.read();
  db.data.todos.push(todo);
  await db.write();

  let forwarded = null, error = null;
  try {
    const response = await fetch(SUBSCRIBER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    });
    forwarded = await response.json();
  } catch (err) {
    error = err.message;
  }

  res.json({ local: todo, forwarded, error });
});

app.listen(PORT, () => console.log(`Publisher running on port ${PORT}`));

