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
      lines = text.split("\n");
      // Enviamos las rondas y obtenemos el resultado del jugador ganador
      let result = determineWinner(lines);

      // Creamos el documento de texto con los datos
      createDocument(result.player, result.diff);
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

  for (let index = 1; index < results.length; index++) {
    // Creamos un array dentro de la posicion del array  con un split para separa los numeros
    results[index] = results[index].split(" ");

    // Pasamos a enteros los numeros
    results[index] = results[index].map(number => {
      return parseInt(number);
    });

    // Validacion para determinar el puntje mas alto de los dos jugadores por ronda
    if (results[index][0] > results[index][1])
      // Jugador 1 ganador
      winner = 1;
    // jugador 2 ganador
    else winner = 2;

    // Validacion del ganador para determinar el orden de la resta para sacar la diferencia
    if (winner == 1) {
      // Sacamos la diferencia
      sum = results[index][0] - results[index][1];

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
      sum = results[index][1] - results[index][0];

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
