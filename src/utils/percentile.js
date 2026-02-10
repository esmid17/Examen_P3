/**
 * @param {number} p - Percentil a calcular (0-100)
 * @param {Array<number>} values - Arreglo de números, longitud >= 1
 * @returns {number} El percentil con 2 decimales
 * @throws {TypeError} Si p o values tienen tipos inválidos
 * @throws {RangeError} Si p está fuera de rango o values está vacío
 */
function percentile(p, values) {

  if (typeof p !== 'number') {
    throw new TypeError('p debe ser un número');
  }

  if (!Array.isArray(values)) {
    throw new TypeError('Debe ser un arreglo');
  }

  if (values.length === 0) {
    throw new RangeError('No puede estar vacío');
  }

  // Validar que p sea finito
  if (!isFinite(p)) {
    throw new TypeError('p debe ser un número finito');
  }

  // Validar que todos los elementos sean números
  values.forEach((value, index) => {
    if (typeof value !== 'number' || !isFinite(value)) {
      throw new TypeError(`Elemento en índice ${index} debe ser un número finito`);
    }
  });

  // Validar que p esté entre 0 y 100
  if (p < 0 || p > 100) {
    throw new RangeError('p debe estar entre 0 y 100');
  }

  // Casos especiales para bordes
  if (p === 0) {
    const minValue = Math.min(...values);
    return parseFloat(minValue.toFixed(2));
  }

  if (p === 100) {
    const maxValue = Math.max(...values);
    return parseFloat(maxValue.toFixed(2));
  }

  // Ordenar valores en forma ascendente
  const sortedValues = [...values].sort((a, b) => a - b);
  const N = sortedValues.length;

  // Calcular el rango usando método nearest-rank con indexación 1..N
  // Rank será un número entre 1 y N
  const rank = Math.ceil((p / 100) * N);

  // Convertir a índice 0-based
  const index = rank - 1;

  // Obtener el valor en el índice
  const result = sortedValues[index];

  // Retornar con 2 decimales
  return parseFloat(result.toFixed(2));
}

module.exports = percentile;