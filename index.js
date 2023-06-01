const fs = require('fs'); // permite trabajar con el sistema de archivos
const path = require('path'); //  path proporciona utilidades para trabajar con rutas de archivos y directorios
const readline = require('readline'); // readline permite leer la entrada del usuario desde la terminal.

/* Función readUserPath() lee entrada de usuario desde 'process.stdin' cómo entrada estándar y escribir en 'process.stdout' cómo salida */
function readUserPath() {
  const userPath = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  /* Dentro de la promesa se invoca método 'question()' para mostrar mensaje de ingreso de ruta y esperar su entrada, luego se pasa función 
  de devolución de llamada que se se ejecuta cuando el usuario ingrese el dato,  recibe el dato cómo argumento y se cierra con el método 'close()'*/
  return new Promise((resolve, reject) => {
    userPath.question('Ingrese ruta del archivo: ', (route) => {
      userPath.close();

      /* Se valida si la ruta ingresada por el usuario está vacía (!route). Si es así, se rechaza promesa con mensaje de error 'No se ha proporcionado 
      ninguna ruta de archivo .md'. Si la ruta no está vacía, se resuelve la promesa con el valor de la ruta ingresada por el usuario (resolve(route)).*/
      if (!route) {
        reject('No se ha proporcionado ninguna ruta de archivo .md');
      } else {
        resolve(route);
      }
    });
  });
}

// parámetro 'route' representa ruta de archivo a validar
function verifyExistencePath(route) {
  const absolutePath = path.resolve(route); // Obtiene la ruta absoluta del archivo

  /* Dentro de la promesa el método 'fs.access()' verifica existencia de archivo en ruta absoluta, se pasa 'fs.constants.F_OK' cómo segundo argumento para 
  indicar que se quiere comprobar si archivo existe */
  const verifyExistencePath = new Promise((resolve, reject) => {
    fs.access(absolutePath, fs.constants.F_OK, (error) => {
      if (error) { // Si ocurre error en verificación de acceso a archivo, se rechaza promesa con mensaje
        reject(`La ruta '${absolutePath}' no existe.`);
      } else { // Si no hay error con 'path.extname()' se obtiene extensión de archivo a partir de ruta absoluta
        const extension = path.extname(absolutePath); // Obtiene la extensión del archivo

        // Se compara extensión obtenida con .md, si no coincide se rechaza promesa con mensaje y si coincide se resuelve promesa con mensaje 'es válida' 
        if (extension.toLowerCase() !== '.md') {
          reject(`La ruta '${absolutePath}' no es un archivo Markdown.`);
        } else {
          resolve(`La ruta '${absolutePath}' es válida.`);
        }
      }
    });
  });

  // Si la promesa se resuelve, se muestra mensaje de éxito en consola y si se rechaza, se muestra mensaje de error
  verifyExistencePath
    .then((message) => {
      console.log(message);
    })
    .catch((error) => {
      console.log(error);
    });
}

/*'process.argv' es una matriz que contiene los argumentos de línea de comando proporcionados al ejecutar el script y el 
elemento 2 corresponde al primer argumento después del nombre del script, que se espera se la ruta de archivo .md */
function checkRouteMDLinks() {
  const route = process.argv[2]; // Obtener la ruta del archivo Markdown desde process.argv

  //Si ruta esta vacía ó no se proporciona, se ejecuta el if
  if (!route) {
    /* Se encadena un then() a la promesa devuelta por readUserPath(). El valor resuelto de la promesa (ruta ingresada por usuario) 
    se pasa como argumento a la función y adentro se llama a verifyExistencePath() pasando la ruta ingresada como argumento. */
    readUserPath().then((entryRoute) => { 
        verifyExistencePath(entryRoute);
      })
      .catch((error) => { // Si la promesa se rechaza, se captura error en catch() y se muestra en consola
        console.log(error);
      });
  } else { // Si se proporcina ruta de archivo .md se ejecuta bloque de código de else
    verifyExistencePath(route); // se llama a verifyExistencePath() pasando ruta como argumento.
  }
}

// Ejecutar la función
checkRouteMDLinks();