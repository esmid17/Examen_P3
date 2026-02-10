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
      // N=4, rank = ceil(50/100 * 4) = ceil(2) = 2, índice 1 -> valor 2
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

    test('p=0 con un solo valor', () => {
      expect(percentile(0, [42])).toBe(42.00);
    });

    test('p=100 con un solo valor', () => {
      expect(percentile(100, [42])).toBe(42.00);
    });
  });

  // Casos válidos - percentiles diversos
  describe('Casos válidos - percentiles diversos', () => {
    test('percentile(25) en un conjunto de datos', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8];
      // rank = ceil(25/100 * 8) = ceil(2) = 2, índice 1 -> valor 2
      expect(percentile(25, values)).toBe(2.00);
    });

    test('percentile(50) - mediana', () => {
      const values = [10, 20, 30, 40, 50];
      // rank = ceil(50/100 * 5) = ceil(2.5) = 3, índice 2 -> valor 30
      expect(percentile(50, values)).toBe(30.00);
    });

    test('percentile(75)', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8];
      // rank = ceil(75/100 * 8) = ceil(6) = 6, índice 5 -> valor 6
      expect(percentile(75, values)).toBe(6.00);
    });

    test('percentile(90)', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      // rank = ceil(90/100 * 10) = ceil(9) = 9, índice 8 -> valor 9
      expect(percentile(90, values)).toBe(9.00);
    });
  });

  // Casos válidos - datos desordenados
  describe('Casos válidos - datos desordenados', () => {
    test('debe ordenar datos antes de calcular percentil', () => {
      const values = [50, 10, 30, 20, 40];
      // Ordenado: [10, 20, 30, 40, 50]
      // p=50: rank = ceil(50/100 * 5) = ceil(2.5) = 3, índice 2 -> 30
      expect(percentile(50, values)).toBe(30.00);
    });

    test('debe funcionar con datos duplicados', () => {
      const values = [1, 2, 2, 2, 3];
      expect(percentile(50, values)).toBe(2.00);
    });
  });

  // Casos válidos - datos con decimales
  describe('Casos válidos - datos con decimales', () => {
    test('debe funcionar con números decimales', () => {
      const values = [1.5, 2.5, 3.5, 4.5];
      // rank = ceil(50/100 * 4) = 2, índice 1 -> 2.5
      expect(percentile(50, values)).toBe(2.50);
    });

    test('debe retornar resultado con 2 decimales', () => {
      const values = [1.111, 2.222, 3.333];
      const result = percentile(50, values);
      const decimalPart = result.toString().split('.')[1];
      expect(decimalPart.length).toBe(2);
    });
  });

  // Validación de tipos - p
  describe('Validación de tipos - p', () => {
    test('debe lanzar TypeError si p no es un número', () => {
      expect(() => percentile('50', [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile(null, [1, 2, 3])).toThrow(TypeError);
      expect(() => percentile(undefined, [1, 2, 3])).toThrow(TypeError);
    });

    test('debe lanzar TypeError si p es Infinity', () => {
      expect(() => percentile(Infinity, [1, 2, 3])).toThrow(TypeError);
    });

    test('debe lanzar TypeError si p es NaN', () => {
      expect(() => percentile(NaN, [1, 2, 3])).toThrow(TypeError);
    });
  });

  // Validación de tipos - values
  describe('Validación de tipos - values', () => {
    test('debe lanzar TypeError si values no es un arreglo', () => {
      expect(() => percentile(50, null)).toThrow(TypeError);
      expect(() => percentile(50, 'not an array')).toThrow(TypeError);
      expect(() => percentile(50, 123)).toThrow(TypeError);
      expect(() => percentile(50, {})).toThrow(TypeError);
    });

    test('debe lanzar RangeError si values está vacío', () => {
      expect(() => percentile(50, [])).toThrow(RangeError);
    });

    test('debe lanzar TypeError si un elemento de values no es un número', () => {
      expect(() => percentile(50, [1, 'two', 3])).toThrow(TypeError);
      expect(() => percentile(50, [1, null, 3])).toThrow(TypeError);
    });

    test('debe lanzar TypeError si values contiene Infinity', () => {
      expect(() => percentile(50, [1, Infinity, 3])).toThrow(TypeError);
    });

    test('debe lanzar TypeError si values contiene NaN', () => {
      expect(() => percentile(50, [1, NaN, 3])).toThrow(TypeError);
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

    test('debe aceptar p = 0 y p = 100', () => {
      expect(() => percentile(0, [1, 2, 3])).not.toThrow();
      expect(() => percentile(100, [1, 2, 3])).not.toThrow();
    });
  });

  // Casos especiales
  describe('Casos especiales', () => {
    test('debe funcionar con un solo valor', () => {
      expect(percentile(50, [42])).toBe(42.00);
    });

    test('debe funcionar con valores negativos', () => {
      const values = [-10, -5, 0, 5, 10];
      expect(percentile(0, values)).toBe(-10.00);
      expect(percentile(100, values)).toBe(10.00);
    });

    test('debe funcionar con valores muy grandes', () => {
      const values = [1000000, 2000000, 3000000];
      expect(percentile(50, values)).toBe(2000000.00);
    });

    test('debe funcionar con valores muy pequeños', () => {
      const values = [0.0001, 0.0002, 0.0003];
      expect(percentile(50, values)).toBe(0.00);
    });
  });
});
