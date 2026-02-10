/**
 * Calcula la nota final ponderada a partir de componentes con peso.
 * @param {Array<{score: number, weight: number}>}
 * @returns {number}
 * @throws {TypeError}
 * @throws {RangeError}
 */
function calcWeightedGrade(items) {
  // Validar que items sea un arreglo
  if (!Array.isArray(items)) {
    throw new TypeError('items debe ser un arreglo');
  }

  if (items.length === 0) {
    throw new TypeError('items no puede estar vacío');
  }

  // Validar cada elemento
  items.forEach((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new TypeError(`Elemento en índice ${index} debe ser un objeto`);
    }

    if (!('score' in item) || !('weight' in item)) {
      throw new TypeError(`Elemento en índice ${index} debe tener propiedades 'score' y 'weight'`);
    }

    if (typeof item.score !== 'number') {
      throw new TypeError(`score en índice ${index} debe ser un número`);
    }

    if (typeof item.weight !== 'number') {
      throw new TypeError(`weight en índice ${index} debe ser un número`);
    }

    if (item.score < 0 || item.score > 100) {
      throw new RangeError(`score en índice ${index} debe estar entre 0 y 100`);
    }

    if (item.weight < 0 || item.weight > 1) {
      throw new RangeError(`weight en índice ${index} debe estar entre 0 y 1`);
    }
  });

  // Validar que la suma de pesos sea 1 ± 0.001
  const weightSum = items.reduce((sum, item) => sum + item.weight, 0);
  const WEIGHT_TOLERANCE = 0.001;

  if (Math.abs(weightSum - 1) > WEIGHT_TOLERANCE) {
    throw new RangeError(
      `La suma de pesos debe ser 1, suma obtenida: ${weightSum.toFixed(6)}`
    );
  }

  // Calcular la nota ponderada
  const weightedGrade = items.reduce((sum, item) => sum + item.score * item.weight, 0);

  // Retornar con 2 decimales
  return parseFloat(weightedGrade.toFixed(2));
}

module.exports = calcWeightedGrade;
