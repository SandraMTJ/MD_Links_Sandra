const fetch = require('node-fetch');

const validate = (link) => {
    return new Promise((resolve) => {
      let fetchLinks = link.map((element) => {
        return fetch(element.href)
          .then((res) => {
            element.status = res.status;
            element.statusText = res.statusText;
          })
          .catch((err) => {
            element.status = err;
          });
      });
      Promise.all(fetchLinks).then(() => {
        resolve(link);
      });
    });
  };

  const links = [
    {
      href: 'https://www.google.com/',  
      text: 'Google',
      file: './otrasPruebas/pruebaSandra.md'        
    },
    {
      href: 'https://www.youtube.com',      
      text: 'Youtube',
      file: './otrasPruebas/pruebita.md'
    },
    {
      href: 'https://mascoteando.vercel.app/error',
      text: 'Mascoteando',
      file: 'src/prueba/prueba.md'
    }
  ];
  
  validate(links)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });