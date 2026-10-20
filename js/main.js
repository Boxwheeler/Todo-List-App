let todos = [];
const savedTodos = localStorage.getItem('todos');
if (savedTodos) {
    todos = JSON.parse(savedTodos);
}

function saveToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
}

const toggleButton = document.querySelector('.theme-toggle');

function updateTheme() {
    const isLight = document.documentElement.classList.contains('light-mode');
    const icon = toggleButton.querySelector('img');

    icon.src = isLight ? 'images/icon-sun.svg' : 'images/icon-moon.svg';
}

toggleButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');

    const isLight = document.documentElement.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    updateTheme();

});

updateTheme();

const inputTodo = document.querySelector('#todo-today');
const form = document.querySelector('.input-text');
const filterButtons =  document.querySelectorAll('.todo-categories .filter');
let currentFilter = 'all';
const clearButton = document.querySelector('.clear-completed');

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveToLocalStorage();
    render();
}

clearButton.addEventListener('click', () => {
    clearCompleted();
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        render();
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = inputTodo.value.trim();
    
    if (text !== "") {
        todos.push({
        id: Date.now(),
        text: text,
        completed: false
        });
        saveToLocalStorage();
        

    }
    inputTodo.value = "";
    render();    
});


let draggedTodo = null;

function render() {
    const list = document.querySelector('.todo-list');
    const remainingTask = document.querySelector('.todo-remaining');
    let filteredTodos = todos;
    list.innerHTML = '';

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    let remaining = 0;


    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.draggable = currentFilter === 'all';
        li.addEventListener('dragstart', () => {
            draggedTodo = todo;
            li.classList.add('dragging');
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        li.addEventListener('drop', () => {
            if (draggedTodo && draggedTodo.id !== todo.id) {
                const from = todos.findIndex(t => t.id === draggedTodo.id);
                const to = todos.findIndex(t => t.id === todo.id);

                const moved = todos.splice(from, 1)[0];
                todos.splice(to, 0, moved);
                saveToLocalStorage();
                render();
            }
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        const checkbox = document.createElement('input');
        checkbox.classList.add('check');
        checkbox.type = 'checkbox';
        checkbox.id = `todo-${todo.id}`;
        checkbox.checked = todo.completed;

        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            saveToLocalStorage();
            render();
        });

        const label = document.createElement('label');
        label.classList.add('todo-text');
        label.htmlFor = `todo-${todo.id}`;
        label.textContent = todo.text;
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        const img = document.createElement('img');
        img.src = 'images/icon-cross.svg';
        img.alt = '';
        deleteButton.addEventListener('click', () => {
            deleteTodo(todo.id);
        });
        deleteButton.appendChild(img);
        deleteButton.setAttribute('aria-label', 'delete todo');

        if (todo.completed) {
            li.classList.add('completed');
        }


        li.appendChild(checkbox);
        li.appendChild(label);
        li.appendChild(deleteButton);
        list.appendChild(li);
    });

    todos.forEach(todo => {
        if(!todo.completed) {
            remaining++;
        }
    });

    remainingTask.textContent = `${remaining} items left`;
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    render();
}

render();