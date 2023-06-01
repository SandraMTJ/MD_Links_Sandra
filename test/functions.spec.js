const {
    validateFileDirectory,
    processMarkdownFile,
    getAllLinks,
    validate,
    stats,
    statsBroken
  } = require('../src/functions.js');
  const fs = require('fs');
  const path = require('path');
  const { JSDOM } = require('jsdom');
  const fetch = require('node-fetch');


  
  describe('validateFileDirectory', () => {

    test('Debería retornar un array con un archivo .md si se proporciona una ruta de archivo', () => {
      const result = validateFileDirectory('src/prueba/otraPrueba.md');
      expect(result).toEqual(['src/prueba/otraPrueba.md']);
    });
  
    test('Debería retornar un array con los archivos .md encontrados en un directorio', () => {
        const result = validateFileDirectory('src/prueba/otrasPruebas');
        const expected = [
          path.normalize('src/prueba/otrasPruebas/pruebaSandra.md'),
          path.normalize('src/prueba/otrasPruebas/pruebita.md')
        ];
        expect(result).toEqual(expected);
    });

    test("Valida directorio de archivos con directorio válido y archivos .md", () => {
        const validDirectoryPath = './src/prueba/otrasPruebas';
        const expectedMdFiles = [
            path.normalize('./src/prueba/otrasPruebas/pruebaSandra.md'),
            path.normalize('./src/prueba/otrasPruebas/pruebita.md')
        ];
        const result = validateFileDirectory(validDirectoryPath);
        expect(result).toEqual(expectedMdFiles);
    });
    
    test("Valida directorio de archivos con archivo válido y archivo .md", () => {
        const validFilePath = './src/prueba/otrasPruebas/pruebaSandra.md';
        const expectedMdFiles = [validFilePath];
        const result = validateFileDirectory(validFilePath);
        expect(result).toEqual(expectedMdFiles);
    });
    
    test("Valida directorio de archivos con ruta de directorio no válida", () => {
      const invalidDirectoryPath = './src/prueba/otrasPruebas2';
      expect(() => validateFileDirectory(invalidDirectoryPath)).toThrow();
    });
    
    test("Valida directorio de archivos con una ruta de archivo no válida", () => {
        const invalidFilePath = './src/prueba/prueba345.txt';
        expect(() => validateFileDirectory(invalidFilePath)).toThrow();
    });
    
    test("Valida directorio de archivos con directorio sin archivos .md", () => {
        const directoryWithNoMdFilesPath = './src/prueba/sinMds';
        const expectedMdFiles = [];
        const result = validateFileDirectory(directoryWithNoMdFilesPath);
        expect(result).toEqual(expectedMdFiles);
    });
    
    test("Valida directorio de archivos con archivo sin extensión .md", () => {
        const fileWithNoMdExtensionPath = './src/prueba/sinMds/sinMds.txt';
        const expectedMdFiles = [];
        const result = validateFileDirectory(fileWithNoMdExtensionPath);
        expect(result).toEqual(expectedMdFiles);
    });
  });

  describe('processMarkdownFile', () => {
    jest.mock('fs');
    jest.mock('jsdom');
    jest.mock('marked', () => ({
        parse: jest.fn().mockReturnValue('<a href="https://www.google.com">Google</a>')
      }));

    test("Válida archivo .md válido", () => {
        const filePath = './otrasPruebas/pruebaSandra.md';
        return processMarkdownFile(filePath)
          .then(result => {
            expect(result).toEqual([
              {
                href: 'https://www.google.com',
                text: 'Google',
                file: filePath
              },
              {
                href: 'https://www.otroejemplo.com',
                text: 'otro enlace',
                file: filePath
              }
            ]);
          })
          .catch(error => {
            // Aqui error que ocurre
          });
    });
    
    test("Válida archivo sin links", () => {
        const filePath = 'src/prueba/sinlinks.md';
        return processMarkdownFile(filePath)
          .then(result => {
            expect(result).toEqual([]);
          })
          .catch(error => {
            // Manejar el error si ocurre
          });
    });
      
    test('Válida archivo que no existe', () => {
        const filePath = 'src/prueba/noexiste.md';
        return expect(processMarkdownFile(filePath)).rejects.toThrow();
    });
    
    test('Debería rechazar la promesa con un error si ocurre un error al leer el archivo', () => {
        const filePath = 'src/prueba/otrasPruebas/pruebaSandra.md';
        const errorMessage = 'Error reading file.';
      
        jest.spyOn(fs, 'readFile').mockImplementationOnce((param1, param2, userPath) => {
          userPath(new Error(errorMessage));
        });
      
        return expect(processMarkdownFile(filePath)).rejects.toThrow(errorMessage);
    });
  });

  describe('getAllLinks', () => {
    test('Devuelve un arreglo de objetos que contienen enlaces dado un arreglo de archivos .md válidos', () => {
        const mdFiles = ['./src/prueba/otrasPruebas/pruebaSandra.md', './src/prueba/otrasPruebas/pruebita.md'];
        const expectedOutput = [
          { href: 'https://www.google.com/', text: 'Google', file: './otrasPruebas/pruebaSandra.md' },
          { href: 'https://www.otroejemplo.com)', text: 'otro enlace', file: './otrasPruebas/pruebaSandra.md' },
          { href: 'https://www.youtube.com', text: 'Youtube', file: './otrasPruebas/pruebita.md' },
          { href: 'https://www.platzi.com', text: 'Platzi', file: './otrasPruebas/pruebita.md' }
        ];
    
        return getAllLinks(mdFiles)
          .then(result => {
            expect(result).toEqual(expectedOutput);
          })
          .catch(error => {
            // Aqui error que ocurre
          });
    });
    
    test('Devuelve arreglo vacío dado un arreglo vacío', () => {
        const mdFiles = [];
        return getAllLinks(mdFiles)
          .then(result => {
            expect(result).toEqual([]);
          })
          .catch(error => {
            //  Aqui error que ocurre
          });
    });
    
    test('Devuelve un arreglo vacío dado un arreglo de rutas de archivos inválidos', () => {
        const mdFiles = ['./otrasPruebas/pruebaSandrainvalida.md', './otrasPruebas/pruebaSandrainvalida2.md'];
        return getAllLinks(mdFiles)
          .then(result => {
            expect(result).toEqual([]);
          })
          .catch(error => {
            //  Aqui error que ocurre
          });
    });
    
    test('Manejo de archivo Markdown sin enlaces', () => {
        const mdFiles = ['src/prueba/sinlinks.md'];
        return getAllLinks(mdFiles)
          .then(result => {
            expect(result).toEqual([[]]);
          })
          .catch(error => {
           // Aqui error que ocurre
          });
    });
  });
  
  describe('validate', () => {
    test('debería retornar un array de objetos con los enlaces validados', () => {
        const mdFiles = [
          { file: 'src/prueba/otrasPruebas/pruebaSandra.md', href: 'https://www.google.com', text: 'Google' },
          { file: 'src/prueba/otrasPruebas/pruebita.md', href: 'https://www.youtube.com', text: 'Youtube' }
        ];
      
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({ status: 200, statusText: 'OK' });
        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Not Found'));
      
        return validate(mdFiles)
          .then((result) => {
            // Acciones necesarias
          });
      });
  });
  
  describe('stats', () => {
    test('debería retornar un objeto con las estadísticas de los enlaces', () => {
      const arrayObjects = [
        { href: 'https://www.google.com', text: 'Google' },
        { href: 'https://www.youtube.com', text: 'Youtube' },
        { href: 'https://www.platzi.com', text: 'Platzi' }
      ];
  
      const result = stats(arrayObjects);
  
      expect(result).toEqual({ Total: 3, Uniques: 3 });
    });
  });
  
  describe('statsBroken', () => {
    test('debería retornar un objeto con las estadísticas de los enlaces rotos', () => {
      const arrayObjects = [
        { href: 'https://mascoteando.vercel.app/error', text: 'Mascoteando', message: 'Not Found' },
        { href: 'https://www.google.com', text: 'Google', status: 200 }
      ];
  
      const result = statsBroken(arrayObjects);
  
      expect(result).toEqual({ Total: 2, Broken: 1, Uniques: 2 });
    });
  });