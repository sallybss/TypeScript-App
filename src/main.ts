import './style.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

let todos: Todo[] = [];

// HTML element references
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const dateInput = document.getElementById('date-input') as HTMLInputElement;
const prioritySelect = document.getElementById('priority-select') as HTMLSelectElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const clearAllButton = document.getElementById('clear-all') as HTMLButtonElement;
const toggleAllButton = document.getElementById('toggle-all') as HTMLButtonElement;

// Add a new todo
const addTodo = (text: string, dueDate?: string, priority?: 'High' | 'Medium' | 'Low'): void => {
  const newTodo: Todo = {
    id: Date.now(),
    title: text,
    completed: false,
    dueDate,
    priority
  };
  todos.push(newTodo);
  renderTodos();
  todoInput.value = '';
  dateInput.value = '';
  prioritySelect.value = '';
};

// Render the list of todos
const renderTodos = (): void => {
  sortTodosByPriority(); // Ensure todos are sorted before rendering
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} />
      <span class="${todo.completed ? 'completed' : ''}">${todo.title}</span>
      ${todo.dueDate ? `<span class="due-date">${todo.dueDate}</span>` : ''}
      ${todo.priority ? `<span class="priority ${todo.priority}">${todo.priority}</span>` : ''}
      <div class="button-container">
        <button class="edit-button">Edit</button>
        <button class="remove-button">Remove</button>
      </div>
    `;
    addCheckboxListener(li, todo.id);
    addEditButtonListener(li, todo.id);
    addRemoveButtonListener(li, todo.id);
    todoList.appendChild(li);
  });

  // Store todos in localStorage to persist between page reloads
  localStorage.setItem('todos', JSON.stringify(todos));

  // Update the visibility of the action buttons
  updateActionButtonsVisibility();
};

// Function to sort todos by priority
const sortTodosByPriority = (): void => {
  const priorityOrder: { [key: string]: number } = {
    High: 1,
    Medium: 2,
    Low: 3
  };

  todos.sort((a, b) => {
    if (a.priority && b.priority) {
      return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
    } else if (a.priority) {
      return -1;
    } else if (b.priority) {
      return 1;
    } else {
      return 0;
    }
  });
};

// Function to update the visibility of the action buttons
const updateActionButtonsVisibility = (): void => {
  const isVisible = todos.length > 0;
  clearAllButton.style.display = isVisible ? 'block' : 'none';
  toggleAllButton.style.display = isVisible ? 'block' : 'none';
};

// Add event listener to the form
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  const dueDate = dateInput.value.trim();
  const priority = prioritySelect.value as 'High' | 'Medium' | 'Low' | '';
  if (text !== '') {
    addTodo(text, dueDate || undefined, priority || undefined);
    errorMessage.style.display = 'none';
  } else {
    errorMessage.style.display = 'block';
  }
});

// Add event listener to checkbox
const addCheckboxListener = (li: HTMLLIElement, id: number) => {
  const checkbox = li.querySelector('input[type="checkbox"]') as HTMLInputElement;
  checkbox?.addEventListener('change', () => toggleTodoCompletion(id));
};

// Toggle the completed status of a todo item
const toggleTodoCompletion = (id: number): void => {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  renderTodos();
};

// Add event listener to remove button
const addRemoveButtonListener = (li: HTMLLIElement, id: number) => {
  const removeButton = li.querySelector('.remove-button');
  removeButton?.addEventListener('click', () => removeTodo(id));
};

// Remove a todo item
const removeTodo = (id: number): void => {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
};

// Add event listener to edit button
const addEditButtonListener = (li: HTMLLIElement, id: number) => {
  const editButton = li.querySelector('.edit-button');
  editButton?.addEventListener('click', () => editTodoTitle(id));
};

// Edit a todo item's title
const editTodoTitle = (id: number): void => {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    const newTitle = prompt('Edit todo', todo.title);
    if (newTitle !== null && newTitle.trim() !== '') {
      todo.title = newTitle.trim();
      renderTodos();
    }
  }
};

// Function to clear all todos
const clearAllTodos = (): void => {
  todos = [];
  renderTodos();
};

// Function to toggle the completion status of all todos
const toggleAllTodos = (): void => {
  const areAllCompleted = todos.every(todo => todo.completed);
  todos = todos.map(todo => ({ ...todo, completed: !areAllCompleted }));
  renderTodos();
};

// Add event listener to the clear all button
clearAllButton.addEventListener('click', () => {
  clearAllTodos();
});

// Add event listener to the toggle all button
toggleAllButton.addEventListener('click', () => {
  toggleAllTodos();
});

// Change background color using color picker
const changeBackgroundColor = (color: string): void => {
  document.body.style.backgroundColor = color;
};

const initializeColorPicker = (): void => {
  const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
  if (colorPicker) {
    colorPicker.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      changeBackgroundColor(target.value);
    });
  } else {
    console.error('Color picker element not found');
  }
};

// Initialize everything when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeColorPicker();
  renderTodos();
  updateActionButtonsVisibility(); // Ensure action buttons visibility is updated
});
