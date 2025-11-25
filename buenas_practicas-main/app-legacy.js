let buffer = '0';
let memoria = 0;
let ultimoOperador;
let historial = [];
const MAX_HISTORY_ITEMS = 5; 

function handleNumber(numStr) {
  if (buffer === '0') { buffer = numStr; } else { buffer += numStr; }
  updateScreen();
}

function handleSymbol(symbol) {
  switch (symbol) {
    case 'C':
      buffer = '0'; memoria = 0; ultimoOperador = null;
      break;
    case '=':
      if (ultimoOperador === null) { return; }
      flushOperationAndLog(parseInt(buffer));
      ultimoOperador = null;
      buffer = '' + memoria;
      memoria = 0;
      break;
    case '+': case '-': case '*': case '/':
      handleMath(symbol);
      break;
    case 'sin': case 'cos': case 'tan':
      if (buffer === '0') return;
      let cientificoResult;
      let val = parseFloat(buffer);
      if (symbol === 'sin') { cientificoResult = Math.sin(val); }
      else if (symbol === 'cos') { cientificoResult = Math.cos(val); }
      else if (symbol === 'tan') { cientificoResult = Math.tan(val); }
      buffer = '' + cientificoResult;
      let logEntry = symbol + '(' + val + ') = ' + cientificoResult;
      logHistory(logEntry);
      break;
  }
  updateScreen();
}

function handleMath(symbol) {
  if (buffer === '0' && memoria === 0) { return; }
  let intBuffer = parseInt(buffer);
  if (memoria === 0) {
    memoria = intBuffer;
  } else {
    flushOperationAndLog(intBuffer);
  }
  ultimoOperador = symbol;
  buffer = '0';
}

function flushOperationAndLog(intBuffer) {
  let operacionPrevia = ultimoOperador;
  let memoriaPrevia = memoria;

  if (ultimoOperador === '+') { memoria += intBuffer; }
  else if (ultimoOperador === '-') { memoria -= intBuffer; }
  else if (ultimoOperador === '*') { memoria *= intBuffer; }
  else if (ultimoOperador === '/') { memoria /= intBuffer; }

  let logEntry = memoriaPrevia + ' ' + operacionPrevia + ' ' + intBuffer + ' = ' + memoria;
  logHistory(logEntry);
}

function logHistory(logEntry) {
    historial.push(logEntry);
    if (historial.length > MAX_HISTORY_ITEMS) { 
        historial.shift(); 
    }
    console.log(historial);
}

function updateScreen(){

  let displayElement = document.getElementById('display');
  if (displayElement !== null) {
      displayElement.innerText = buffer;
  }
}

function initCalculadora(){
  let calculatorButtons = document.querySelector('.buttons');
  if (calculatorButtons !== null) {
      calculatorButtons.addEventListener('click', function(event) {
        buttonClick(event.target.innerText);
      });
  }
}
function buttonClick(value) {
  if (isNaN(parseInt(value))) { handleSymbol(value); } else { handleNumber(value); }
}

let todoList = []; 
let userName = 'Default User'; 

function agregarTarea() {
    let inputElement = document.getElementById('todo-input');
    let textoTarea = inputElement.value;

    if (textoTarea === '') {
        alert('Error: La tarea no puede estar vacía.');
        return;
    }

    let duplicado = false;
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].texto === textoTarea) {
            duplicado = true;
            break;
        }
    }

    if (duplicado === true) {
        alert('Error: Tarea duplicada.');
        return;
    }

    let nuevaTarea = {
        'id': Date.now(),
        'texto': textoTarea,
        'completada': false
    };

    todoList.push(nuevaTarea);
    inputElement.value = ''; 
    dibujarListaTareas();
}

function dibujarListaTareas() {
    let listaHtml = document.getElementById('todo-list');
    if (listaHtml === null) return; 

    listaHtml.innerHTML = ''; 

    for (let i = 0; i < todoList.length; i++) {
        let tareaActual = todoList[i];
        let elementoLista = document.createElement('li');

        elementoLista.innerText = tareaActual.texto;

        if (tareaActual.completada === true) {
            elementoLista.style.textDecoration = 'line-through';
        }

        elementoLista.addEventListener('click', function() {

        });

        listaHtml.appendChild(elementoLista);
    }
}

function initTodoList(){
    let botonAgregar = document.getElementById('add-task-btn');
    if (botonAgregar !== null) {
        botonAgregar.addEventListener('click', agregarTarea);
    }
    dibujarListaTareas(); 
}

initCalculadora();
initTodoList();
