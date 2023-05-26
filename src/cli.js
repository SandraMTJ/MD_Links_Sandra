const { mdLinks } = require('./index.js');
const process = require('process');
const userPath = process.argv[2];
let objOptions = { validate: false };
const options = process.argv;
//console.log(options, 8);

if(options.includes('--validate')){
    objOptions.validate = true;
} else {
    objOptions.validate = false;
}

mdLinks(userPath, objOptions)
  .then((result) => {
    console.log('Array de Objetos:', result);
  })
  .catch((error) => {
    return error;
  });