const percentile = require('../src/utils/percentile');

describe('percentile', () => {
  // Casos de referencia
  describe('Casos de referencia', () => {
    test('percentile(0, [1,2,3]) debe retornar 1.00 (mínimo)', () => {
      const result = percentile(0, [1, 2, 3]);
      expect(result).toBe(1.00);
    });

    test('percentile(100, [1,2,3]) debe retornar 3.00 (máximo)', () => {
      const result = percentile(100, [1, 2, 3]);
      expect(result).toBe(3.00);
    });

    test('percentile(50, [1,2,3,4]) debe retornar 2.00 (nearest-rank)', () => {
      const result = percentile(50, [1, 2, 3, 4]);
      expect(result).toBe(2.00);
    });
  });

  // Casos válidos - bordes
  describe('Casos válidos - bordes (p=0 y p=100)', () => {
    test('p=0 debe retornar el mínimo', () => {
      expect(percentile(0, [5, 10, 15, 20])).toBe(5.00);
    });

    test('p=100 debe retornar el máximo', () => {
      expect(percentile(100, [5, 10, 15, 20])).toBe(20.00);
    });
  });

  // Casos válidos - percentiles diversos
  describe('Casos válidos - percentiles diversos', () => {
    test('percentile(50) - mediana', () => {
      const values = [10, 20, 30, 40, 50];
      expect(percentile(50, values)).toBe(30.00);
    });
  });

  // Validación de tipos - p
  describe('Validación de tipos - p', () => {
    test('debe lanzar TypeError si p no es un número', () => {
      expect(() => percentile('50', [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile(null, [1, 2, 3])).toThrow(TypeError);
    });

    test('debe lanzar TypeError si p es Infinity', () => {
      expect(() => percentile(Infinity, [1, 2, 3])).toThrow(TypeError);
    });
  });

  // Validación de tipos - values
  describe('Validación de tipos - values', () => {
    test('debe lanzar TypeError si values no es un arreglo', () => {
      expect(() => percentile(50, null)).toThrow(TypeError);
      expect(() => percentile(50, 'not an array')).toThrow(TypeError);
    });

    test('debe lanzar RangeError si values está vacío', () => {
      expect(() => percentile(50, [])).toThrow(RangeError);
    });

    test('debe lanzar TypeError si un elemento de values no es un número', () => {
      expect(() => percentile(50, [1, 'two', 3])).toThrow(TypeError);
    });
  });

  // Validación de rangos
  describe('Validación de rangos', () => {
    test('debe lanzar RangeError si p < 0', () => {
      expect(() => percentile(-1, [1, 2, 3])).toThrow(RangeError);
    });

    test('debe lanzar RangeError si p > 100', () => {
      expect(() => percentile(101, [1, 2, 3])).toThrow(RangeError);
    });
  });

  // Casos especiales
  describe('Casos especiales', () => {
    test('debe funcionar con un solo valor', () => {
      expect(percentile(50, [42])).toBe(42.00);
    });
  });
});