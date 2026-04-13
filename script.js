// Basic To-Do using DOM and localStorage
// Usage: type a task into the input, click the Add button or press Enter.
// Tasks persist in browser `localStorage` under `STORAGE_KEY`.

// Reference DOM elements used by the app
const input = document.getElementById('todo-input'); // text input for new tasks
const addBtn = document.getElementById('add-btn'); // add task button
const listEl = document.getElementById('todo-list'); // container for the todo list
const clearBtn = document.getElementById('clear-btn'); // clear-all button

// Key used to store todos in localStorage. Bump the version to reset storage.
const STORAGE_KEY = 'simple_todos_v1';

// Load saved todos (array of {text, done, createdAt}) or start with an empty array
let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Save the current `todos` array back to localStorage
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Re-render the entire list from the `todos` array.
// This approach is simple and works well for small lists.
function render() {
  // Clear previous content
  listEl.innerHTML = '';

  // Show a friendly message when there are no tasks
  if (todos.length === 0) {
    const p = document.createElement('li');
    p.className = 'todo-empty';
    p.textContent = 'No tasks yet — add one!';
    listEl.appendChild(p);
    return;
  }

  // Build each todo item and its controls
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');

    // The task text
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = todo.text;

    // Container for action buttons (Done/Undo, Edit, Delete)
    const btns = document.createElement('div');

    // Toggle done/undone
    const doneBtn = document.createElement('button');
    doneBtn.textContent = todo.done ? 'Undo' : 'Done';
    doneBtn.className = 'btn';
    doneBtn.addEventListener('click', () => {
      // Flip the `done` flag for this todo, persist and re-render
      todos[idx].done = !todos[idx].done;
      save();
      render();
    });

    // Edit the task text using a simple prompt (could be replaced with inline editing)
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn';
    editBtn.style.marginLeft = '6px';
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit task', todo.text);
      // If the user didn't cancel, update the task (trim whitespace)
      if (newText !== null) {
        todos[idx].text = newText.trim();
        save();
        render();
      }
    });

    // Delete the task after confirmation
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'btn btn-danger';
    delBtn.style.marginLeft = '6px';
    delBtn.addEventListener('click', () => {
      if (confirm('Delete this task?')) {
        todos.splice(idx, 1);
        save();
        render();
      }
    });

    // Visually mark completed tasks
    if (todo.done) {
      span.style.textDecoration = 'line-through';
      span.style.opacity = '0.6';
    }

    // Assemble and append this todo item
    btns.appendChild(doneBtn);
    btns.appendChild(editBtn);
    btns.appendChild(delBtn);

    li.appendChild(span);
    li.appendChild(btns);
    listEl.appendChild(li);
  });
}

// Add new todo when the Add button is clicked
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return; // ignore empty submissions
  todos.push({ text, done: false, createdAt: Date.now() });
  input.value = '';
  save();
  render();
});

// Support pressing Enter in the input to submit the new task
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

// Clear all tasks (with confirmation)
clearBtn.addEventListener('click', () => {
  if (!todos.length) return;
  if (confirm('Clear all tasks?')) {
    todos = [];
    save();
    render();
  }
});

// initial render
render();
