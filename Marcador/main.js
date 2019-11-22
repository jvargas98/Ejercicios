// Check for the various File API support.
function readFile() {
  var preview = document.getElementById("show-text");
  var file = document.querySelector("input[type=file]").files[0];
  var reader = new FileReader();

  var textFile = /text.*/;

  if (file.type.match(textFile)) {
    reader.onload = function(event) {
      let text = event.target.result;

      // Hace un split para sacar las lineas (rondas)
      let lines = text.split("\n");

      console.log(lines);

      let validData = validateData(lines);

      if (validData === true) {
        // Enviamos las rondas y obtenemos el resultado del jugador ganador
        let result = determineWinner(lines);

        // Creamos el documento de texto con los datos
        createDocument(result.player, result.diff);
      } else {
        alert(validData);
        location.reload();
      }
    };
  } else {
    alert("Formato incorrecto");
  }
  reader.readAsText(file);
}

// Funcion general para evaluar las instrucciones, regresa SI y NO segun la instruccion

function determineWinner(results) {
  console.log(results);
  let higher = 0;
  let winner = 0;
  let sum = 0;
  let acumulado = [0, 0];

  for (let index = 1; index < results.length; index++) {
    // Creamos un array dentro de la posicion del array  con un split para separa los numeros

    acumulado[0] += results[index][0];
    acumulado[1] += results[index][1];

    console.log(acumulado);

    // Validacion para determinar el puntje mas alto de los dos jugadores por ronda
    if (acumulado[0] > acumulado[1])
      // Jugador 1 ganador
      winner = 1;
    // jugador 2 ganador
    else winner = 2;

    // Validacion del ganador para determinar el orden de la resta para sacar la diferencia
    if (winner == 1) {
      // Sacamos la diferencia
      sum = acumulado[0] - acumulado[1];

      // Validacion para saber si es la maxima diferencia
      if (sum > higher) {
        higher = sum;

        // Guardamos en el objeto player los datos del ganador con mayor diferencia
        player = {
          diff: sum,
          player: 1
        };
      }
    } else {
      // Sacamo la diferencia
      sum = acumulado[1] - acumulado[0];

      // Validacion para saber si es la maxima diferencia
      if (sum > higher) {
        higher = sum;

        // Guardamos en el objeto player los datos del ganador con mayor diferencia
        player = {
          diff: sum,
          player: 2
        };
      }
    }
  }
  return player;
}

function validateData(data) {
  let expRg = /^[0-9]*$/;
  let characteresInRounds = 0;

  if (!expRg.test(data[0].trim(" "))) return "caracter en total de rondas";

  data[0] = parseInt(data[0]);

  if (data[0] >= 10000) return "la cantidad de rondas es invalida";

  if (data[0] != data.length - 1)
    return "la cantidad de entradas no coinicide con el numero de rondas";

  for (let index = 1; index < data.length; index++) {
    // Creamos un array dentro de la posicion del array  con un split para separa los numeros
    data[index] = data[index].split(" ");

    // Pasamos a enteros los numeros
    data[index] = data[index].map(number => {
      number = number.trim(" ");
      let result = expRg.test(number);
      if (!result) {
        characteresInRounds++;
      }
      return parseInt(number);
    });
  }

  console.log(characteresInRounds);

  if (data[0] > data.length - 1)
    return "el numero de entradas es mayor que el numero de rondas";
  if (data[0] < data.length - 1)
    return "el numero de entradas es menor que el numero de rondas";
  if (characteresInRounds > 0) return "caracter en valor de ronda";
  return true;
}

// Funcion para crear el archivo de texto
function createDocument(player, diff) {
  var filename = "marcador.txt";
  var text = player + " " + diff;

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
