const { validateFileDirectory, validate, getAllLinks, stats, statsBroken } = require('./functions.js');
const { existRoute, absoluteRoute } = require('./route.js');

// Función MD-Links
const mdLinks = (userPath, options) => {
  const route = absoluteRoute(userPath);
  return new Promise((resolve, reject) => {
    if (!existRoute(userPath)) {
      reject(new Error('Error, la ruta no existe'));
    }

    if (options.validate === true ) {
      const arrayFiles = validateFileDirectory(route);
      getAllLinks(arrayFiles)
      .then((link) => {
        resolve(validate(link.flat()));
      });

    } else {
      const arrayFiles = validateFileDirectory(route);
      getAllLinks(arrayFiles)
      .then((res) => {
        resolve(res.flat());
      });
      }
  });
};

module.exports = {
  mdLinks
};
