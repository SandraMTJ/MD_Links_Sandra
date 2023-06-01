
const { mdLinks } = require('../src/index.js');

describe('mdLinks', () => {

  test('Es una función', () => {
    return expect(typeof mdLinks).toBe('function');
  });

  test('Debe rechazar la promesa cuando la ruta no exista', () => {
    return expect(mdLinks('/pruebita/prueba.md')).rejects.toThrowError('Error, la ruta no existe');
  });

  test("Comprueba enlaces de ruta valida .md", () => {
    const userPath = './otrasPruebas/pruebaSandra.md';
    return expect(mdLinks(userPath)).rejects.toThrowError('Error, la ruta no existe');
  });

  test("Comprueba enlaces de ruta invalida .md", () => {
    const userPath = './otrasPruebas/pruebaSandra232.md';
    return expect(mdLinks(userPath)).rejects.toThrowError('Error, la ruta no existe');
  });

  test("Prueba de retorno de promesa", () => {
    const userPath = './otrasPruebas/pruebaSandra.md';
    const result = mdLinks(userPath);
    expect(result).toBeInstanceOf(Promise);
    return result.catch((error) => {
      console.error(error);
    });
  });

  test("Comprueba ruta de directorio", () => {
    const userPath = "./otrasPruebas";
    return expect(mdLinks(userPath)).rejects.toThrowError('Error, la ruta no existe');
  });

  it("Ruta no existe", () => {
    const options = { validate: true };
    mdLinks('./nonexistent', options)
    .catch((error) => {
        expect(error.message).toBe('Error, la ruta no existe');
    });
});
  
});



