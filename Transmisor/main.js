// Check for the various File API support.
function readFile() {
  var preview = document.getElementById("show-text");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  var textFile = /text.*/;

  if (file.type.match(textFile)) {
    reader.onload = function(event) {
      let code = event.target.result;
      let validMessage = validateCode(code);

      if (validMessage === true) {
        let results = decrypt(code);
        if (results[0] == results[1]) alert("Se encontraron dos instrucciones");
        else createDocument(results[0], results[1]);
      } else {
        alert(validMessage);

        location.reload();
      }
    };
  } else {
    alert("Formato incorrecto");
  }
  reader.readAsText(file);
}

// Funcion general para evaluar las instrucciones, regresa SI y NO segun la instruccion

function decrypt(code) {
  console.log(code);

  [firstLine, firstInstruction, secondInstruction, message] = getValues(code);

  // Llamada a la funcion fixCode para obtener el mensaje sin duplicaciones de caracteres
  message = fixCode(message);

  console.log(message);

  instruction1Found = searchInstruction(firstInstruction, message);
  instruction2Found = searchInstruction(secondInstruction, message);

  return [instruction1Found, instruction2Found];
}

// Funcion para eliminar los caracteres duplicados regresa el string sin duplicaciones
function fixCode(instruction) {
  //String a Array
  instruction = instruction.split("");

  // Ciclo para recorrer caracter por caracter
  for (let i = 0; i < instruction.length; i++) {
    // Validacion si el siguiente caracteres es igual al acutal
    if (instruction[i] == instruction[i + 1]) {
      // Inicializa un indice para el ciclo while en 1
      let index = 1;

      // Ciclo para determinar las repeticiones del caracter, mientras sea menor al tamaño del array y el siguiente caracter sea igual al primero
      while (
        index < instruction.length &&
        instruction[i] == instruction[i + index]
      ) {
        // Indice aumenta en 1
        index++;
      }

      // Ciclo para realizar un recorrimiento de los elementos a la derecha hacia la izquierda
      // El ciclo comienza una posicion despues del caracter repetido (primer repeticion)
      // El numnero de recorridos de elementos sera igual a la cantidad de repeticiones

      for (let j = i + 1; j < instruction.length; j++) {
        instruction[j] = instruction[j + index - 1];
      }
      index = 0;
    }
  }

  //De Array a String
  instruction = instruction.join("");
  return instruction;
}

// Funcion para determinar si se encuentra la instruccion en el mensaje
function searchInstruction(instruction, message) {
  if (message.includes(instruction)) return "SI";
  return "NO";
}

function getValues(code) {
  code = code.split("\n");

  // Destructuring para sacar cada posicion del code y asignarla a cada variable
  [firstLine, firstInstruction, secondInstruction, message] = code;

  // Split para sacar cada numero seperado por espacio
  firstLine = firstLine.split(" ");

  // Pasa de string a int los numeros
  firstLine = firstLine.map(number => {
    return parseInt(number);
  });

  firstInstruction = firstInstruction.slice(0, -1);
  secondInstruction = secondInstruction.slice(0, -1);

  return [firstLine, firstInstruction, secondInstruction, message];
}

function validateCode(code) {
  let expRg = /^[A-z0-9]*$/;

  [firstLine, firstInstruction, secondInstruction, message] = getValues(code);

  // Destructuring para asignar cada variable el valor de cada posicion

  [m1, m2, n] = firstLine;

  if (!(Number.isInteger(m1) && Number.isInteger(m2) && Number.isInteger(n)))
    return "tipo de dato invalido para el numero de caracteres";
  if (!(firstInstruction.length == m1))
    return "la longitud de caracteres para la primera instruccion no concuerda con la longitud de la instruccion 1";
  if (!(secondInstruction.length == m2))
    return "la longitud de caracteres para la segunda instruccion no concuerda con la longitud de la instruccion 2";
  if (!(message.length == n))
    return "la longitud de caracteres no concuerda con la longitud del mensaje";

  if (lookForRepetitions(firstInstruction))
    return "la primera instruccion contiene caracteres repetidos";
  if (lookForRepetitions(secondInstruction))
    return "la segunda instruccion contiene caracteres repetidos";

  if (!(n >= 3 && n <= 5000))
    return "longitud de caracteres invalida para el mensaje";
  if (!(firstInstruction.length >= 2 && firstInstruction.length <= 50))
    return "longitud de caracteres invalida para la primera instruccion";
  if (!(secondInstruction.length >= 2 && secondInstruction.length <= 50))
    return "longitud de caracteres invalida para la segunda instruccion";
  if (!expRg.test(message)) return "el mensaje contiene caracteres invalidos";
  return true;
}

function lookForRepetitions(instruction) {
  let instructionArray = instruction.split("");
  let countRepetitions = 0;

  for (let index = 0; index < instructionArray.length; index++) {
    if (instructionArray[index] == instructionArray[index + 1])
      countRepetitions++;
  }

  if (countRepetitions > 0) return true;
  return false;
}

// Funcion para crear el archivo de texto
function createDocument(message1, message2) {
  var filename = "transmisor.txt";
  var text = message1 + "\n" + message2;

  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  location.reload();
}
