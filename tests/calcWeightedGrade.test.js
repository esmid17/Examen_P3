const calcWeightedGrade = require('../src/utils/calcWeightedGrade');

describe('calcWeightedGrade', () => {
  // Casos de referencia
  describe('Casos de referencia', () => {
    test('debe calcular correctamente: [80(0.4) + 90(0.6)] = 86.00', () => {
      const items = [
        { score: 80, weight: 0.4 },
        { score: 90, weight: 0.6 },
      ];
      const result = calcWeightedGrade(items);
      expect(result).toBe(86.00);
    });

    test('debe retornar como número con máximo 2 decimales', () => {
      const items = [
        { score: 85, weight: 0.5 },
        { score: 90, weight: 0.5 },
      ];
      const result = calcWeightedGrade(items);
      // Verificar que cuando se convierte a string con toFixed(2), da 2 decimales
      expect(result.toFixed(2)).toMatch(/^\d+\.\d{2}$/);
    });
  });

  // Casos válidos
  describe('Casos válidos', () => {
    test('debe funcionar con un solo componente', () => {
      const items = [{ score: 100, weight: 1 }];
      expect(calcWeightedGrade(items)).toBe(100.00);
    });

    test('debe funcionar con tres componentes', () => {
      const items = [
        { score: 80, weight: 0.35 },
        { score: 85, weight: 0.35 },
        { score: 90, weight: 0.30 },
      ];
      const result = calcWeightedGrade(items);
      expect(result).toBeCloseTo(84.75, 2);
    });
  });

  // Validación de tipos
  describe('Validación de tipos', () => {
    test('debe lanzar TypeError si items no es un arreglo', () => {
      expect(() => calcWeightedGrade(null)).toThrow(TypeError);
      expect(() => calcWeightedGrade('not an array')).toThrow(TypeError);
    });

    test('debe lanzar TypeError si items está vacío', () => {
      expect(() => calcWeightedGrade([])).toThrow(TypeError);
    });

    test('debe lanzar TypeError si falta la propiedad score', () => {
      const items = [{ weight: 0.5 }];
      expect(() => calcWeightedGrade(items)).toThrow(TypeError);
    });

    test('debe lanzar TypeError si score no es un número', () => {
      const items = [{ score: 'eighty', weight: 0.5 }];
      expect(() => calcWeightedGrade(items)).toThrow(TypeError);
    });
  });

  // Validación de rangos
  describe('Validación de rangos', () => {
    test('debe lanzar RangeError si score < 0', () => {
      const items = [{ score: -1, weight: 1 }];
      expect(() => calcWeightedGrade(items)).toThrow(RangeError);
    });

    test('debe lanzar RangeError si score > 100', () => {
      const items = [{ score: 101, weight: 1 }];
      expect(() => calcWeightedGrade(items)).toThrow(RangeError);
    });

    test('debe lanzar RangeError si suma de pesos > 1.001', () => {
      const items = [
        { score: 80, weight: 0.6 },
        { score: 90, weight: 0.5 },
      ];
      expect(() => calcWeightedGrade(items)).toThrow(RangeError);
    });
  });
});
