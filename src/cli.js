const { mdLinks } = require('./index.js');
const { stats, statsBroken } = require('./functions.js');
const process = require('process');
const userPath = process.argv[2];
let objOptions = { validate: false, stats: false };
const options = process.argv;

//console.log(options, 8);

  if(options.includes('--validate') && (!options.includes('--stats'))){
    objOptions.validate = true;
  } else if(!options.includes('--validate') && (options.includes('--stats'))){
    objOptions.stats = true;
  } else if(options.includes('--validate') && (options.includes('--stats'))){
    objOptions.validate = true;
    objOptions.stats = true;
  } else {
    objOptions.validate = false;
    objOptions.stats = false;
  }

mdLinks(userPath, objOptions)
  .then((result) => {
    console.log('Estadisticas de links:', result);

    if(options.includes('--stats')){
      if(options.includes('--validate')){
       // console.log('Estadisticas de los links: ');
       console.log(stats(result));
      } else {
       console.log('Estadisticas de los links rotos: ');
       console.log(statsBroken(result));
      }
    }
  })
  .catch((error) => {
    return error;
  });

  if(options.includes('--stats')){
    objOptions.validate = true;
} else {
    objOptions.validate = false;
}

