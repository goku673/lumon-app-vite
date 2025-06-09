// 🔥 Función existente (la que ya tienes)
export const getTransformedGradeNameByDescription = (grades, description) => {
  // Tu lógica actual aquí
  // Ejemplo: "Grado correspondiente a 6to de primaria" → "6to de primaria"
}

// 🔥 Nueva función para transformación inversa
export const getOriginalGradeDescriptionByTransformed = (grades, transformedValue) => {
  // Buscar en los grades el que tenga la descripción que al transformarse dé el valor buscado
  const foundGrade = grades.find((grade) => {
    const transformed = getTransformedGradeNameByDescription(grades, grade.description)
    return transformed === transformedValue
  })

  return foundGrade ? foundGrade.description : transformedValue
}
