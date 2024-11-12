let currentDate = new Date().toISOString().split('T')[0];
let data = {};
let isEditMode = false;
const password = '@The_yuvaraj';

async function fetchData(date) {
  const response = await fetch(`/api/data/${date}`);
  return response.json();
}

async function saveData(date, data) {
  const response = await fetch(`/api/data/${date}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

async function fetchGlobalNote() {
  const response = await fetch('/api/note');
  return response.text();
}

async function saveGlobalNote(note) {
  const response = await fetch('/api/note', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note }),
  });
  return response.text();
}

async function renderAll() {
  data = await fetchData(currentDate);
  document.getElementById('dateInput').value = currentDate;
  renderMood();
  renderEnergyLevel();
  renderWeather();
  renderSleepSchedule();
  renderTodoList();
  renderMotivation();
  renderGoals();
  renderExpenseTracker();
  renderHabits();
  renderWaterIntake();
  renderNotes();
  renderMeals();
  updateEditableState();
  renderCalendar();
  updateNoteButtonState();
  showNoteOnVisit();
}

function updateEditableState() {
  const editableElements = document.querySelectorAll('input:not([type="date"]), textarea, select, .addMeal, #addTodo, #addGoal, #addTransaction, .habit-checkbox, .water-btn');
  editableElements.forEach(el => {
    el.disabled = !isEditMode;
  });
  document.getElementById('saveButton').disabled = !isEditMode;
}

function setMood(mood) {
  if (isEditMode) {
    data.mood = mood;
    renderMood();
  }
}

function renderMood() {
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mood === data.mood);
  });
}

function setEnergyLevel(level) {
  if (isEditMode) {
    data.energyLevel = level;
    renderEnergyLevel();
  }
}

function renderEnergyLevel() {
  document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.energy <= (data.energyLevel || 0));
  });
}

function setWeather(weather) {
  if (isEditMode) {
    data.weather = weather;
    renderWeather();
  }
}

function renderWeather() {
  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.weather === data.weather);
  });
}

function renderSleepSchedule() {
  document.getElementById('wakeTime').value = data.wakeTime || '';
  document.getElementById('sleepTime').value = data.sleepTime || '';
}

function addTodo() {
  if (isEditMode) {
    if (!data.todos) data.todos = [];
    data.todos.push({ text: '', completed: false });
    renderTodoList();
  }
}

function renderTodoList() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';
  data.todos?.forEach((todo, index) => {
    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item d-flex align-items-center mb-2';
    todoItem.innerHTML = `
      <input type="checkbox" ${todo.completed ? 'checked' : ''} class="form-check-input me-2">
      <input type="text" value="${todo.text}" placeholder="Enter task..." class="form-control me-2">
      <button class="btn btn-danger btn-sm">Delete</button>
    `;
    todoItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      if (isEditMode) {
        data.todos[index].completed = e.target.checked;
      }
    });
    todoItem.querySelector('input[type="text"]').addEventListener('input', (e) => {
      if (isEditMode) {
        data.todos[index].text = e.target.value;
      }
    });
    todoItem.querySelector('button').addEventListener('click', () => {
      if (isEditMode) {
        data.todos.splice(index, 1);
        renderTodoList();
      }
    });
    todoList.appendChild(todoItem);
  });
}

function renderMotivation() {
  document.getElementById('motivation').value = data.motivation || '';
}

function addGoal() {
  if (isEditMode) {
    if (!data.goals) data.goals = [];
    data.goals.push({ text: '', completed: false });
    renderGoals();
  }
}

function renderGoals() {
  const goalList = document.getElementById('goalList');
  goalList.innerHTML = '';
  data.goals?.forEach((goal, index) => {
    const goalItem = document.createElement('div');
    goalItem.className = 'goal-item d-flex align-items-center mb-2';
    goalItem.innerHTML = `
      <input type="checkbox" ${goal.completed ? 'checked' : ''} class="form-check-input me-2">
      <input type="text" value="${goal.text}" placeholder="Enter goal..." class="form-control me-2">
      <button class="btn btn-danger btn-sm">Delete</button>
    `;
    goalItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      if (isEditMode) {
        data.goals[index].completed = e.target.checked;
      }
    });
    goalItem.querySelector('input[type="text"]').addEventListener('input', (e) => {
      if (isEditMode) {
        data.goals[index].text = e.target.value;
      }
    });
    goalItem.querySelector('button').addEventListener('click', () => {
      if (isEditMode) {
        data.goals.splice(index, 1);
        renderGoals();
      }
    });
    goalList.appendChild(goalItem);
  });
}

function addTransaction() {
  if (isEditMode) {
    const type = document.getElementById('transactionType').value;
    const category = document.getElementById('category').value;
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;

    if (category && amount) {
      if (!data.transactions) data.transactions = [];
      data.transactions.push({ type, category, amount, description });
      renderExpenseTracker();
    }
  }
}

function renderExpenseTracker() {
  const transactionList = document.getElementById('transactionList');
  transactionList.innerHTML = '';
  let balance = 0;
  data.transactions?.forEach((transaction, index) => {
    const transactionItem = document.createElement('div');
    transactionItem.className = `transaction-item d-flex justify-content-between align-items-center mb-2 ${transaction.type}`;
    transactionItem.innerHTML = `
      <div>
        <strong>${transaction.category}</strong>
        <p class="mb-0">${transaction.description}</p>
      </div>
      <div>
        <span class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
          ${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}
        </span>
        <button class="btn btn-danger btn-sm ms-2">Delete</button>
      </div>
    `;
    transactionItem.querySelector('button').addEventListener('click', () => {
      if (isEditMode) {
        data.transactions.splice(index, 1);
        renderExpenseTracker();
      }
    });
    transactionList.appendChild(transactionItem);
    balance += transaction.type === 'income' ? parseFloat(transaction.amount) : -parseFloat(transaction.amount);
  });
  document.getElementById('balance').textContent = `Balance: $${balance.toFixed(2)}`;
}

function renderHabits() {
  const habitList = document.getElementById('habitList');
  habitList.innerHTML = '';
  const habits = ['Exercise', 'Read', 'Meditate', 'Journal', 'Learn'];
  habits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.className = 'form-check';
    habitItem.innerHTML = `
      <input class="form-check-input habit-checkbox" type="checkbox" id="habit${index}" ${data.habits?.[index] ? 'checked' : ''} ${isEditMode ? '' : 'disabled'}>
      <label class="form-check-label" for="habit${index}">${habit}</label>
    `;
    habitItem.querySelector('input').addEventListener('change', (e) => {
      if (isEditMode) {
        if (!data.habits) data.habits = [];
        data.habits[index] = e.target.checked;
      }
    });
    habitList.appendChild(habitItem);
  });
}

function renderWaterIntake() {
  const waterIntake = document.getElementById('waterIntake');
  waterIntake.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const waterButton = document.createElement('button');
    waterButton.className = `btn btn-outline-primary water-btn ${data.waterIntake?.[i] ? 'active' : ''} ${isEditMode ? '' : 'disabled'}`;
    waterButton.innerHTML = '<i class="fas fa-tint"></i>';
    waterButton.addEventListener('click', () => {
      if (isEditMode) {
        if (!data.waterIntake) data.waterIntake = [];
        data.waterIntake[i] = !data.waterIntake[i];
        renderWaterIntake();
      }
    });
    waterIntake.appendChild(waterButton);
  }
}

function renderNotes() {
  document.getElementById('notes').value = data.notes || '';
}

function addMeal(meal) {
  if (isEditMode) {
    if (!data.meals) data.meals = {};
    if (!data.meals[meal]) data.meals[meal] = [];
    data.meals[meal].push({ text: '' });
    renderMeals();
  }
}

function renderMeals() {
  const meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
  meals.forEach(meal => {
    const mealItems = document.getElementById(`${meal}Items`);
    mealItems.innerHTML = '';
    data.meals?.[meal]?.forEach((item, index) => {
      const mealItem = document.createElement('div');
      mealItem.className = 'meal-item d-flex align-items-center mb-2';
      mealItem.innerHTML = `
        <input type="text" value="${item.text}" placeholder="Enter meal..." class="form-control me-2">
        <button class="btn btn-danger btn-sm">Delete</button>
      `;
      mealItem.querySelector('input').addEventListener('input', (e) => {
        if (isEditMode) {
          data.meals[meal][index].text = e.target.value;
        }
      });
      mealItem.querySelector('button').addEventListener('click', () => {
        if (isEditMode) {
          data.meals[meal].splice(index, 1);
          renderMeals();
        }
      });
      mealItems.appendChild(mealItem);
    });
  });
}

async function saveAllData() {
  if (isEditMode) {
    await saveData(currentDate, data);
    alert('Data saved successfully!');
    isEditMode = false;
    updateEditableState();
    renderCalendar();
  }
}

async function updateNote() {
  if (isEditMode) {
    const noteContent = prompt('Enter your note:', await fetchGlobalNote() || '');
    if (noteContent !== null) {
      await saveGlobalNote(noteContent);
      document.getElementById('noteContent').textContent = noteContent;
      document.getElementById('modalNoteContent').textContent = noteContent;
      updateNoteButtonState();
    }
  } else {
    alert('Please enable edit mode to update the note.');
  }
}

async function showNoteOnVisit() {
  const globalNote = await fetchGlobalNote();
  if (globalNote) {
    document.getElementById('modalNoteContent').textContent = globalNote;
    const noteModal = new bootstrap.Modal(document.getElementById('noteModal'));
    noteModal.show();
  }
}

function renderCalendar() {
  const calendarContainer = document.getElementById('calendar-container');
  calendarContainer.innerHTML = '';
  const calendar = document.createElement('div');
  calendar.id = 'calendar';
  calendarContainer.appendChild(calendar);

  new Datepicker(calendar, {
    autohide: true,
    format: 'yyyy-mm-dd',
    todayHighlight: true,
    weekStart: 1,
  });

  calendar.addEventListener('changeDate', (e) => {
    currentDate = e.date.toISOString().split('T')[0];
    renderAll();
  });
}

async function updateNoteButtonState() {
  const noteButton = document.getElementById('noteHighlight');
  const noteBadge = document.getElementById('noteBadge');
  const globalNote = await fetchGlobalNote();
  
  if (globalNote) {
    noteButton.classList.add('has-note');
    noteBadge.style.display = 'block';
  } else {
    noteButton.classList.remove('has-note');
    noteBadge.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => setMood(btn.dataset.mood));
  });

  document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.addEventListener('click', () => setEnergyLevel(btn.dataset.energy));
  });

  document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.addEventListener('click', () => setWeather(btn.dataset.weather));
  });

  document.getElementById('wakeTime').addEventListener('change', (e) => {
    if (isEditMode) data.wakeTime = e.target.value;
  });

  document.getElementById('sleepTime').addEventListener('change', (e) => {
    if (isEditMode) data.sleepTime = e.target.value;
  });

  document.getElementById('addTodo').addEventListener('click', addTodo);

  document.getElementById('motivation').addEventListener('input', (e) => {
    if (isEditMode) data.motivation = e.target.value;
  });

  document.getElementById('addGoal').addEventListener('click', addGoal);

  document.getElementById('addTransaction').addEventListener('click', addTransaction);

  document.getElementById('notes').addEventListener('input', (e) => {
    if (isEditMode) data.notes = e.target.value;
  });

  document.querySelectorAll('.addMeal').forEach(btn => {
    btn.addEventListener('click', () => addMeal(btn.dataset.meal));
  });

  document.getElementById('saveButton').addEventListener('click', saveAllData);

  document.getElementById('editButton').addEventListener('click', () => {
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    passwordModal.show();
  });

  document.getElementById('submitPassword').addEventListener('click', () => {
    const enteredPassword = document.getElementById('passwordInput').value;
    if (enteredPassword === password) {
      isEditMode = true;
      updateEditableState();
      bootstrap.Modal.getInstance(document.getElementById('passwordModal')).hide();
    } else {
      alert('Incorrect password. Please try again.');
    }
  });

  document.getElementById('prevDay').addEventListener('click', () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    currentDate = date.toISOString().split('T')[0];
    renderAll();
  });

  document.getElementById('nextDay').addEventListener('click', () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 1);
    currentDate = date.toISOString().split('T')[0];
    renderAll();
  });

  document.getElementById('dateInput').addEventListener('change', (e) => {
    currentDate = e.target.value;
    renderAll();
  });

  document.getElementById('noteHighlight').addEventListener('click', () => {
    const noteCard = document.getElementById('noteCard');
    noteCard.style.display = noteCard.style.display === 'none' ? 'block' : 'none';
  });

  renderAll();
});
