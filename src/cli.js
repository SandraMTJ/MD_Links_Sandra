#!/usr/bin/env node
const { mdLinks } = require('./index.js');
const { statsBroken } = require('./functions.js');
const process = require('process');
const userPath = process.argv[2];
let objOptions = { validate: false, stats: false };
const options = process.argv;
const colors = require('colors');

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
    if (objOptions.stats === true) {
      const totalStats = statsBroken(result);
      const totalColor = colors.bgYellow.black(` Total: ${totalStats.Total} `);
      const uniqueColor = colors.bgMagenta.black(` Unique: ${totalStats.Uniques} `);
      const brokenColor = colors.bgBlue.black(` Broken: ${totalStats.Broken} `);
      console.log(`${totalColor.black} || ${uniqueColor.black}${totalStats.Broken ? ` || ${brokenColor.black}` : ''}`);
    } else if (objOptions.validate === true) {
      result.forEach((link) => {
        const hrefText = colors.cyan(link.href);
        const statusText = link.status >= 200 && link.status < 400 ? colors.green(link.status) : colors.red(link.status);
        const statusMessage = link.status >= 200 && link.status < 400 ? colors.green(link.message) : colors.red(link.message);
        console.log(`(HREF: ${hrefText}) || (STATUS: ${statusText}) || (MESSAGE: ${statusMessage})`);
      });
    }
    else{
      console.log(result);
    }
  })
  .catch((error) => {
    return error;
  });

