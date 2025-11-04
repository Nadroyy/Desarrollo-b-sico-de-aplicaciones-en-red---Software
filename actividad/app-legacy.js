let buffer = '0';
let memoria = 0;
let ultimoOperador;
const historial = [];
const MAX_HISTORY_ITEMS = 5;

function handleNumber(numStr) {
  if (buffer === '0') {
    buffer = numStr;
  } else {
    buffer += numStr;
  }
  updateScreen();
}

function handleSymbol(symbol) {
  switch (symbol) {
    case 'C':
      buffer = '0';
      memoria = 0;
      ultimoOperador = null;
      break;
    case '=':
      if (ultimoOperador === null) return;
      flushOperationAndLog(parseInt(buffer));
      ultimoOperador = null;
      buffer = `${memoria}`;
      memoria = 0;
      break;
    case '+':
    case '-':
    case '*':
    case '/':
      handleMath(symbol);
      break;
    case 'sin':
    case 'cos':
    case 'tan':
      if (buffer === '0') return;
      const val = parseFloat(buffer);
      let cientificoResult;
      if (symbol === 'sin') cientificoResult = Math.sin(val);
      else if (symbol === 'cos') cientificoResult = Math.cos(val);
      else cientificoResult = Math.tan(val);

      buffer = `${cientificoResult}`;
      const logEntry = `${symbol}(${val}) = ${cientificoResult}`;
      logHistory(logEntry);
      break;
  }
  updateScreen();
}

function handleMath(symbol) {
  if (buffer === '0' && memoria === 0) return;
  const intBuffer = parseInt(buffer);
  if (memoria === 0) {
    memoria = intBuffer;
  } else {
    flushOperationAndLog(intBuffer);
  }
  ultimoOperador = symbol;
  buffer = '0';
}

function flushOperationAndLog(intBuffer) {
  const operacionPrevia = ultimoOperador;
  const memoriaPrevia = memoria;

  if (ultimoOperador === '+') memoria += intBuffer;
  else if (ultimoOperador === '-') memoria -= intBuffer;
  else if (ultimoOperador === '*') memoria *= intBuffer;
  else if (ultimoOperador === '/') memoria /= intBuffer;

  const logEntry = `${memoriaPrevia} ${operacionPrevia} ${intBuffer} = ${memoria}`;
  logHistory(logEntry);
}

function logHistory(logEntry) {
  historial.push(logEntry);
  if (historial.length > MAX_HISTORY_ITEMS) historial.shift();
  console.log(historial);
}

function updateScreen() {
  const displayElement = document.getElementById('display');
  if (displayElement) {
    displayElement.innerText = buffer;
  }
}

function initCalculadora() {
  const calculatorButtons = document.querySelector('.buttons');
  if (calculatorButtons) {
    calculatorButtons.addEventListener('click', (event) => {
      buttonClick(event.target.innerText);
    });
  }
}

function buttonClick(value) {
  if (isNaN(parseInt(value))) {
    handleSymbol(value);
  } else {
    handleNumber(value);
  }
}

// -----------------------------------------------------------
// MÓDULO DE TO-DO LIST (estandarizado)
// -----------------------------------------------------------

const todoList = [];
let userName = 'Default User';

function agregarTarea() {
  const inputElement = document.getElementById('todo-input');
  const textoTarea = inputElement.value;

  if (textoTarea === '') {
    alert('Error: La tarea no puede estar vacía.');
    return;
  }

  const duplicado = todoList.some((tarea) => tarea.texto === textoTarea);

  if (duplicado) {
    alert('Error: Tarea duplicada.');
    return;
  }

  const nuevaTarea = {
    id: Date.now(),
    texto: textoTarea,
    completada: false
  };

  todoList.push(nuevaTarea);
  inputElement.value = '';
  dibujarListaTareas();
}

function dibujarListaTareas() {
  const listaHtml = document.getElementById('todo-list');
  if (!listaHtml) return;

  listaHtml.innerHTML = '';

  todoList.forEach((tarea) => {
    const elementoLista = document.createElement('li');
    elementoLista.innerText = tarea.texto;

    if (tarea.completada) {
      elementoLista.style.textDecoration = 'line-through';
    }

    elementoLista.addEventListener('click', () => {
      tarea.completada = !tarea.completada;
      dibujarListaTareas();
    });

    listaHtml.appendChild(elementoLista);
  });
}

function initTodoList() {
  const botonAgregar = document.getElementById('add-task-btn');
  if (botonAgregar) {
    botonAgregar.addEventListener('click', agregarTarea);
  }
  dibujarListaTareas();
}

// Inicializar ambos módulos
initCalculadora();
initTodoList();
