const { validateFileDirectory, validate, getAllLinks, stats, statsBroken } = require('./functions.js');
const { existRoute } = require('./route.js');

// Función MD-Links
const mdLinks = (userPath, options) => {
  return new Promise((resolve, reject) => {
    if (!existRoute(userPath)) {
      reject(new Error('Error, la ruta no existe'));
    } else if (options.validate === true && options.stats === false) {
      const arrayFiles = validateFileDirectory(userPath);
      getAllLinks(arrayFiles)
        .then((links) => {
          validate(links.flat())
            .then((validatedLinks) => {
              if(options.stats){
                resolve(stats(validatedLinks));
              } else {
                resolve(validatedLinks);
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } else if (options.validate === true && options.stats === true) {
      const arrayFiles = validateFileDirectory(userPath);
      getAllLinks(arrayFiles)
        .then((links) => {
          validate(links.flat())
            .then((validatedLinks) => {
              if(options.stats){
                resolve(statsBroken(validatedLinks));
              } else {
                resolve(validatedLinks);
              }
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      const arrayFiles = validateFileDirectory(userPath);
      getAllLinks(arrayFiles)
        .then((links) => {
          if (options.stats){
            resolve(stats(links.flat()));
          } else {
            resolve(links.flat());
          }  
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

module.exports = { mdLinks };
