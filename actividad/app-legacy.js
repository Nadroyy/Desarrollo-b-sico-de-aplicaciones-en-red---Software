// MODULO DE CALCULADORA v2 - LEGACY
var buffer = "0";
var memoria = 0;
var ultimo_operador;
var historial = [];
const MAX_HISTORY_ITEMS = 5; // El dev anterior al menos puso una const

function handleNumber(numStr) {
  if (buffer == "0") {
    buffer = numStr;
  } else {
    buffer += numStr;
  }
  updateScreen();
}

function handleSymbol(symbol) {
  switch (symbol) {
    case "C":
      buffer = "0";
      memoria = 0;
      ultimo_operador = null;
      break;
    case "=":
      if (ultimo_operador == null) {
        return;
      }
      flushOperationAndLog(parseInt(buffer));
      ultimo_operador = null;
      buffer = "" + memoria;
      memoria = 0;
      break;
    case "+":
    case "-":
    case "*":
    case "/":
      handleMath(symbol);
      break;
    case "sin":
    case "cos":
    case "tan":
      if (buffer == "0") return;
      var cientifico_result;
      var val = parseFloat(buffer);
      if (symbol == "sin") {
        cientifico_result = Math.sin(val);
      } else if (symbol == "cos") {
        cientifico_result = Math.cos(val);
      } else if (symbol == "tan") {
        cientifico_result = Math.tan(val);
      }
      buffer = "" + cientifico_result;
      var logEntry = symbol + "(" + val + ") = " + cientifico_result;
      logHistory(logEntry);
      break;
  }
  updateScreen();
}

function handleMath(symbol) {
  if (buffer == "0" && memoria == 0) {
    return;
  }
  var intBuffer = parseInt(buffer);
  if (memoria == 0) {
    memoria = intBuffer;
  } else {
    flushOperationAndLog(intBuffer);
  }
  ultimo_operador = symbol;
  buffer = "0";
}

function flushOperationAndLog(intBuffer) {
  var operacionPrevia = ultimo_operador;
  var memoriaPrevia = memoria;

  if (ultimo_operador == "+") {
    memoria += intBuffer;
  } else if (ultimo_operador == "-") {
    memoria -= intBuffer;
  } else if (ultimo_operador == "*") {
    memoria *= intBuffer;
  } else if (ultimo_operador == "/") {
    memoria /= intBuffer;
  }

  var logEntry =
    memoriaPrevia + " " + operacionPrevia + " " + intBuffer + " = " + memoria;
  logHistory(logEntry);
}

function logHistory(logEntry) {
  historial.push(logEntry);
  if (historial.length > MAX_HISTORY_ITEMS) {
    historial.shift();
  }
  console.log(historial);
}

function updateScreen() {
  // Error común: El ID "display" no existe en el HTML del To-Do.
  // Esto es un error de lógica, pero hoy nos enfocamos en ESTILO.
  var display_element = document.getElementById("display");
  if (display_element != null) {
    display_element.innerText = buffer;
  }
}

function init_calculadora() {
  var calculator_buttons = document.querySelector(".buttons");
  if (calculator_buttons != null) {
    calculator_buttons.addEventListener("click", function (event) {
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
// MODULO DE TO-DO LIST (en el mismo archivo... ¡qué horror!)
// -----------------------------------------------------------

var todo_list = []; // Lista de tareas
var user_name = "Default User"; // Otro var

function agregar_tarea() {
  var input_element = document.getElementById("todo-input");
  var texto_tarea = input_element.value;

  if (texto_tarea == "") {
    alert("Error: La tarea no puede estar vacía.");
    return;
  }

  // Chequeo de duplicados (escrito con 'var' y '==')
  var duplicado = false;
  for (var i = 0; i < todo_list.length; i++) {
    if (todo_list[i].texto == texto_tarea) {
      duplicado = true;
      break;
    }
  }

  if (duplicado == true) {
    alert("Error: Tarea duplicada.");
    return;
  }

  var nueva_tarea = {
    id: Date.now(),
    texto: texto_tarea,
    completada: false,
  };

  todo_list.push(nueva_tarea);
  input_element.value = ""; // Limpiar el input
  dibujar_lista_tareas();
}

function dibujar_lista_tareas() {
  var lista_html = document.getElementById("todo-list");
  if (lista_html == null) return; // Salir si no estamos en la página del To-Do

  lista_html.innerHTML = ""; // Limpiar la lista

  for (var i = 0; i < todo_list.length; i++) {
    var tarea_actual = todo_list[i];
    var elemento_lista = document.createElement("li");

    elemento_lista.innerText = tarea_actual.texto;

    if (tarea_actual.completada == true) {
      elemento_lista.style.textDecoration = "line-through";
    }

    // Evento para borrar (mala práctica, pero la dejamos por ahora)
    elemento_lista.addEventListener("click", function () {
      // Esto es complejo, pero nos enfocamos en el estilo
      // (Encontrar el índice y borrarlo)
    });

    lista_html.appendChild(elemento_lista);
  }
}

function init_todo_list() {
  var boton_agregar = document.getElementById("add-task-btn");
  if (boton_agregar != null) {
    boton_agregar.addEventListener("click", agregar_tarea);
  }
  dibujar_lista_tareas(); // Dibujar al cargar
}

// Inicializar AMBOS módulos
init_calculadora();
init_todo_list();
