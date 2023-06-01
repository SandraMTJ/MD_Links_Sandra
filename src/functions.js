const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

// Función validar si es archivo o directorio y muestra en array los .md
const validateFileDirectory = (absoluteRoute) => {
  let mdFiles = [];
  if (fs.lstatSync(absoluteRoute).isFile() && path.extname(absoluteRoute) === '.md') {
    mdFiles.push(absoluteRoute);
    // return console.log('Es un archivo');
  }
  if (fs.lstatSync(absoluteRoute).isDirectory()) {
    const routesArray = fs.readdirSync(absoluteRoute);
    routesArray.forEach((rt) => {
      const pathNew = path.join(absoluteRoute, rt);
      mdFiles = mdFiles.concat(validateFileDirectory(pathNew));
    });
  } else {
  //  return [];
  }
  return mdFiles;
};

const validate = (mdFiles) => {
  return new Promise((resolve) => {
    let fetchElement = mdFiles.map((element) => {
      return fetch(element.href)
        .then((res) => {
          element.status = res.status;
          element.message = res.statusText;
        })
        .catch((err) => {
          element.status = 'Not Found';
        });
    });
    return Promise.all(fetchElement).then(() => {
      resolve(mdFiles); 
    });
  });
};

// Función para leer y procesar los archivos Markdown
const processMarkdownFile = (filePath) => {
  return new Promise((resolve, reject) => {
    //console.log(filePath);
    fs.readFile(filePath, 'utf8', (error, markdownContent) => {
      if (error) {
        console.log(error);
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
          text: links.textContent.substring(0, 50),
          file: filePath
        };
        arrayElements.push(objectsElements);
      });
     // console.log(arrayElements);
      resolve(arrayElements);
    });
  });
};

// Función donde se obtienen los enlaces
const getAllLinks = (mdFiles) => {
  const arrayAllLinks = mdFiles.map((file) => {
    return processMarkdownFile(file);
  });
  return Promise.all(arrayAllLinks);
};

// Devuelve un objeto que proporciona información sobre cantidad total de enlaces y la cantidad de enlaces únicos en el array de objetos proporcionado
const stats = (arrayObjetcs) => {
  let uniqueSet = new Set(arrayObjetcs.map((link) => link.href)).size;
  return {
    Total: arrayObjetcs.length,
    Uniques: uniqueSet,
  };
};

// Devuelve un objeto que proporciona información sobre cantidad total de enlaces, la cantidad de enlaces únicos y enlaces rotos en el array de objetos proporcionado
const statsBroken = (arrayObjetcs) => {
  let uniqueSet = new Set(arrayObjetcs.map((link) => link.href)).size;
  return {
    Total: arrayObjetcs.length,
    Broken: (arrayObjetcs.filter(element => element.message ==='Not Found')).length,
    Uniques: uniqueSet,
  };
};

module.exports = {
validateFileDirectory, processMarkdownFile, getAllLinks, validate, stats, statsBroken
};
