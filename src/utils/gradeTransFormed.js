/**
 * Transforma el nombre del grado agregando "de" y convirtiendo a minúsculas
 * @param {string} gradeName - Nombre del grado (ej: "6to Secundaria")
 * @returns {string} - Nombre transformado (ej: "6to de secundaria")
 */
export const transformGradeName = (gradeName) => {
  if (!gradeName) return ""

  // Dividir el nombre en partes
  const parts = gradeName.trim().split(/\s+/)

  if (parts.length >= 2) {
    // Si tiene al menos 2 partes, insertar "de" entre la primera y segunda parte
    const [first, ...rest] = parts
    return `${first} de ${rest.join(" ")}`.toLowerCase()
  }

  // Si solo tiene una parte, devolverla en minúsculas
  return gradeName.toLowerCase()
}

/**
 * Encuentra un grado por su descripción y devuelve el nombre transformado
 * @param {Array} grades - Array de grados
 * @param {string} description - Descripción del grado seleccionado
 * @returns {string} - Nombre del grado transformado
 */
export const getTransformedGradeNameByDescription = (grades, description) => {
  if (!grades || !description) return ""

  const grade = grades.find((g) => g.description === description)
  return grade ? transformGradeName(grade.name) : ""
}

/**
 * 🔥 Nueva función para transformación inversa
 * Encuentra la descripción original a partir del valor transformado
 * @param {Array} grades - Array de grados
 * @param {string} transformedValue - Valor transformado (ej: "6to de secundaria")
 * @returns {string} - Descripción original (ej: "Grado correspondiente a 6to de secundaria")
 */
export const getOriginalGradeDescriptionByTransformed = (grades, transformedValue) => {
  if (!grades || !transformedValue) return ""

  // Buscar el grado cuyo nombre transformado coincida con el valor buscado
  const foundGrade = grades.find((grade) => {
    const transformed = transformGradeName(grade.name)
    return transformed === transformedValue
  })

  return foundGrade ? foundGrade.description : transformedValue
}
