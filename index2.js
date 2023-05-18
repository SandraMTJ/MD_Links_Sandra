const fs = require('fs'); // permite trabajar con el sistema de archivos
const path = require('path'); //  path proporciona utilidades para trabajar con rutas de archivos y directorios
const readline = require('readline'); // readline permite leer la entrada del usuario desde la terminal.

function validarRuta() {
  const userPath = readline.createInterface({ // Lee entrada de usuario desde la terminal
    input: process.stdin,
    output: process.stdout
  });
  // Obtener la ruta absoluta del archivo
  userPath.question('Ingrese la ruta del archivo: ', (ruta) => {
    const rutaAbsoluta = path.resolve(ruta); 

    if (!fs.existsSync(rutaAbsoluta)) {
      console.log(`La ruta '${rutaAbsoluta}' no existe.`);
    } else {
      const stats = fs.statSync(rutaAbsoluta); // Obtener información del archivo

      if (!stats.isFile()) {
        console.log(`La ruta '${rutaAbsoluta}' no es un archivo.`);
      } else {
        const extension = path.extname(rutaAbsoluta); // Obtener la extensión del archivo

        if (extension.toLowerCase() !== '.md') {
          console.log(`La ruta '${rutaAbsoluta}' no es un archivo .md.`);
        } else {
          console.log(`La ruta '${rutaAbsoluta}' es válida.`);
        }
      }
    }

    userPath.close();
  });
}

// Ejecutar la función
validarRuta();
