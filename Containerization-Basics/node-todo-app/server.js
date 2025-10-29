import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let todos = [];

// ✅ Get all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// ✅ Add a new todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  const todo = { id: nanoid(), text, completed: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// ✅ Toggle todo completion
app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  todo.completed = !todo.completed;
  res.json(todo);
});

// ✅ Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((t) => t.id !== req.params.id);
  res.status(204).end();
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Todo app running at http://localhost:${port}`);
});

