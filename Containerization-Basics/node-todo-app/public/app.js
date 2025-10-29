// public/app.js
const form = document.getElementById('todoForm')
const input = document.getElementById('todoInput')
const list = document.getElementById('todoList')

function createTodoElement(todo) {
  const li = document.createElement('li')
  li.className = 'flex items-center justify-between p-3 rounded-lg border'
  li.dataset.id = todo.id
  li.innerHTML = `
    <div class="flex items-center gap-3">
      <input type="checkbox" class="todo-check" ${todo.done ? 'checked' : ''}/>
      <span class="todo-text ${todo.done ? 'line-through text-gray-400' : ''}">${escapeHtml(todo.text)}</span>
    </div>
    <div class="flex items-center gap-2">
      <button class="delete-btn text-red-500">Delete</button>
    </div>
  `
  attachHandlers(li)
  return li
}

function escapeHtml(s){
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
}

function attachHandlers(li){
  const checkbox = li.querySelector('.todo-check')
  const del = li.querySelector('.delete-btn')
  checkbox.addEventListener('change', async () => {
    const id = li.dataset.id
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ done: checkbox.checked })
    })
    li.querySelector('.todo-text').classList.toggle('line-through', checkbox.checked)
    li.querySelector('.todo-text').classList.toggle('text-gray-400', checkbox.checked)
  })
  del.addEventListener('click', async () => {
    const id = li.dataset.id
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    li.remove()
  })
}

async function init(){
  // load initial items (server rendered included), but fetch live to be safe
  try {
    const res = await fetch('/api/todos')
    const todos = await res.json()
    list.innerHTML = ''
    todos.forEach(t => list.appendChild(createTodoElement(t)))
  } catch (e) {
    // fallback to server-injected
    (window.__INITIAL_TODOS__ || []).forEach(t => list.appendChild(createTodoElement(t)))
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text) return
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text })
  })
  const todo = await res.json()
  list.prepend(createTodoElement(todo))
  input.value = ''
})

init()

