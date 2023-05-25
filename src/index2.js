const { existRoute } = require('./route.js');
const fs = require('fs');
const process = require('process');
const userPath = process.argv[2];
const path = require('path');
const { marked } = require('marked');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

// Función validar si es archivo o directorio y muestra en array los .md
const validateFileDirectory = (absoluteRoute) => {
  let mdFiles = [];
  if (fs.lstatSync(absoluteRoute).isFile() && path.extname(absoluteRoute) === '.md') {
    mdFiles.push(absoluteRoute);
  }
  if (fs.lstatSync(absoluteRoute).isDirectory()) {
    const routesArray = fs.readdirSync(absoluteRoute);
    routesArray.forEach((rt) => {
      const pathNew = path.join(absoluteRoute, rt);
      mdFiles = mdFiles.concat(validateFileDirectory(pathNew));
    });
  }
  return mdFiles;
};

// Función para leer y procesar los archivos Markdown
const processMarkdownFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (error, markdownContent) => {
      if (error) {
        reject(error);
        return;
      }
      const htmlContent = marked(markdownContent, { headerIds: false, mangle: false });
      const dom = new JSDOM(htmlContent);
      const linksA = dom.window.document.querySelectorAll('a');
      const arrayElements = [];
      linksA.forEach((links) => {
        const objectsElements = {
          href: links.href,
          text: links.textContent,
          file: filePath
        };
        arrayElements.push(objectsElements);
      });
      resolve(arrayElements);
    });
  });
};

const getAllLinks = (mdFiles) => {
  const arrayAllLinks = mdFiles.map((file) => {
    return processMarkdownFile(file);
  });
  return Promise.all(arrayAllLinks);
};

const validateLinks = (links) => {
  // Implementa la validación de los enlaces aquí
  // Retorna los enlaces validados
};

const getStatistics = (links) => {
  // Implementa el cálculo de estadísticas aquí
  // Retorna las estadísticas
};

const mdLinks = (userPath, validate = false, stats = false) => {
  return new Promise((resolve, reject) => {
    if (!existRoute(userPath)) {
      reject(new Error('Error, la ruta no existe'));
    } else {
      const arrayFiles = validateFileDirectory(userPath);
      if (validate && stats) {
        getAllLinks(arrayFiles)
          .then((res) => {
            const validatedLinks = validateLinks(res);
            const statistics = getStatistics(validatedLinks);
            resolve(statistics);
          })
          .catch((error) => {
            reject(error);
          });
      } else if (validate) {
        getAllLinks(arrayFiles)
          .then((res) => {
            const validatedLinks = validateLinks(res);
            resolve(validatedLinks);
          })
          .catch((error) => {
            reject(error);
          });
      } else if (stats) {
        getAllLinks(arrayFiles)
          .then((res) => {
            const statistics = getStatistics(res);
            resolve(statistics);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        getAllLinks(arrayFiles)
          .then((res) => {
            resolve(res.flat());
          })
          .catch((error) => {
            reject(error);
          });
      }
    }
  });
};

const args = process.argv.slice(2);
const userPath1 = args[0];

if (args.includes('--validate') && args.includes('--stats')) {
  mdLinks(userPath1, true, true)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
} else if (args.includes('--validate')) {
  mdLinks(userPath1, true)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
} else if (args.includes('--stats')) {
  mdLinks(userPath1, false, true)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
} else {
  mdLinks(userPath1)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
}

