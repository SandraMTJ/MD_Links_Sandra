const { existRoute, absoluteRoute } = require('../src/route.js');
const path = require('path');

describe('existRoute', () => {
  test('debería retornar true si la ruta existe', () => {
    const result = existRoute('./src/prueba/otrasPruebas/pruebaSandra.md');
    expect(result).toBe(true);
  });

  test('debería retornar false si la ruta no existe', () => {
    const result = existRoute('./src/prueba/noExiste/pruebaSandra.md');
    expect(result).toBe(false);
  });
});

describe('absoluteRoute', () => {
    test('debería retornar la ruta absoluta si se proporciona una ruta relativa', () => {
        const result = absoluteRoute('./src/prueba/otrasPruebas/pruebaSandra.md');
        const expected = path.resolve('D:/BOOTCAMP/MD_Links/MD_Links_Sandra/src/prueba/otrasPruebas/pruebaSandra.md');
        expect(result).toBe(expected);
      });
    
      test('debería retornar la misma ruta si ya es una ruta absoluta', () => {
        const result = absoluteRoute('./src/prueba/prueba.md');
        const expected = path.resolve('./src/prueba/prueba.md');
        expect(result).toBe(expected);
  });
});
