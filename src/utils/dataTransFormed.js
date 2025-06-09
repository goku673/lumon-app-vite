/**
 * Transforma los datos del formulario al formato requerido por el backend
 * @param {Object} formData - Datos del formulario
 * @param {Array} guardians - Array de tutores
 * @param {number} olympicId - ID de la olimpiada
 * @returns {Object} - Datos transformados para el backend
 */
export const transformCompetitorDataForBackend = (formData, guardians = [], olympicId) => {
  // Extraer IDs de area_level_grades
  const areaLevelGradeIds = formData.area_level_grades?.map((grade) => grade.id) || []

  // Extraer IDs de guardians
  const guardianIds = guardians?.map((guardian) => guardian.id) || []

  // Extraer school_id del objeto colegio
  const schoolId = formData.colegio?.id || null

  // Combinar nombre y apellidos
  const fullName = `${formData.nombres || ""}`.trim()
  const fullLastName = `${formData.apellidoPaterno || ""} ${formData.apellidoMaterno || ""}`.trim()

  // Transformar fecha de DD/MM/YYYY a YYYY-MM-DD
  const transformBirthday = (dateString) => {
    if (!dateString) return ""

    // Si ya está en formato YYYY-MM-DD, devolverla tal como está
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString
    }

    // Si está en formato DD/MM/YYYY, transformarla
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split("/")
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }

    return dateString
  }

  const transformedData = {
    name: fullName,
    last_name: fullLastName,
    ci: formData.cedula || "",
    birthday: transformBirthday(formData.fechaNacimiento),
    phone: formData.celular || "",
    email: formData.email || "",
    school_id: schoolId,
    curso: formData.curso || "",
    guardian_ids: guardianIds,
    olympic_id: olympicId,
    area_level_grade_ids: areaLevelGradeIds,
  }

  return transformedData
}

/**
 * Transforma datos para crear solo el competidor (sin inscripción)
 * @param {Object} formData - Datos del formulario
 * @param {Array} guardians - Array de tutores
 * @returns {Object} - Datos del competidor
 */
export const transformCompetitorOnlyData = (formData, guardians = []) => {
  // Extraer IDs de guardians
  const guardianIds = guardians?.map((guardian) => guardian.id) || []

  // Extraer school_id del objeto colegio
  const schoolId = formData.colegio?.id || null

  // Combinar nombre y apellidos
  const fullName = `${formData.nombres || ""}`.trim()
  const fullLastName = `${formData.apellidoPaterno || ""} ${formData.apellidoMaterno || ""}`.trim()

  // Transformar fecha de DD/MM/YYYY a YYYY-MM-DD
  const transformBirthday = (dateString) => {
    if (!dateString) return ""

    // Si ya está en formato YYYY-MM-DD, devolverla tal como está
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString
    }

    // Si está en formato DD/MM/YYYY, transformarla
    if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = dateString.split("/")
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }

    return dateString
  }

  return {
    name: fullName,
    last_name: fullLastName,
    ci: formData.cedula || "",
    birthday: transformBirthday(formData.fechaNacimiento),
    phone: formData.celular || "",
    email: formData.email || "",
    school_id: schoolId,
    curso: formData.curso || "",
    guardian_ids: guardianIds,
  }
}

/**
 * Transforma datos para crear inscripción separada
 * @param {string} ci - CI del competidor
 * @param {number} olympicId - ID de la olimpiada
 * @param {Array} areaLevelGradeIds - IDs de área-nivel-grado
 * @returns {Object} - Datos de inscripción
 */
export const transformInscriptionData = (ci, olympicId, areaLevelGradeIds) => {
  return {
    ci: ci,
    olympic_id: olympicId,
    area_level_grade_ids: areaLevelGradeIds,
  }
}

/**
 * Valida que los datos transformados tengan todos los campos requeridos
 * @param {Object} transformedData - Datos transformados
 * @returns {Object} - Resultado de la validación
 */
export const validateTransformedData = (transformedData) => {
  const errors = []

  if (!transformedData.name?.trim()) {
    errors.push("El nombre es requerido")
  }

  if (!transformedData.last_name?.trim()) {
    errors.push("Los apellidos son requeridos")
  }

  if (!transformedData.ci?.trim()) {
    errors.push("La cédula es requerida")
  }

  if (!transformedData.birthday) {
    errors.push("La fecha de nacimiento es requerida")
  }

  if (!transformedData.phone?.trim()) {
    errors.push("El teléfono es requerido")
  }

  if (!transformedData.email?.trim()) {
    errors.push("El email es requerido")
  }

  if (!transformedData.school_id) {
    errors.push("El colegio es requerido")
  }

  if (!transformedData.curso?.trim()) {
    errors.push("El curso es requerido")
  }

  if (!transformedData.guardian_ids?.length) {
    errors.push("Al menos un tutor es requerido")
  }

  if (!transformedData.olympic_id) {
    errors.push("La olimpiada es requerida")
  }

  if (!transformedData.area_level_grade_ids?.length) {
    errors.push("Al menos un área-nivel-grado es requerido")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
