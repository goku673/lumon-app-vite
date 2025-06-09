import { useState, useEffect } from "react"
import { usePostIncriptionOlympicsMutation } from "../app/redux/services/olympicsApi"
import { useGetAreaLevelsGradesQuery } from "../app/redux/services/areaLevelsGrades"
import FormContainer from "../common/formContainer"
import FormContent from "../common/formContent"
import FormGroup from "./formGroup"
import Modal from "./modal/modal"
import Input from "../common/input"
import Button from "../common/button"
import Textarea from "../common/textarea"
import ButtonSE from "../common/ButtonSE"
import Title from "../common/title"
import Badge from "../common/badge"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import AutorenewIcon from "@mui/icons-material/Autorenew"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import SearchIcon from "@mui/icons-material/Search"

const MAX_WORDS = 20

const RegisterOlympic = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date_ini: "",
    date_fin: "",
    status: "inactive",
    areas_levels_grades: [], // Array de IDs
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState("success")
  const [modalMessage, setModalMessage] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState([]) // Array de objetos completos para mostrar

  const [postIncriptionOlympics, { isLoading }] = usePostIncriptionOlympicsMutation()
  const {
    data: areaLevelsGrades = [],
    isLoading: isLoadingAreas,
    isError: isErrorAreas,
  } = useGetAreaLevelsGradesQuery()

  // Aplanar los datos para facilitar la búsqueda y selección
  const flattenedItems = areaLevelsGrades.flatMap((area) =>
    area.levels.flatMap((level) =>
      level.grades.map((grade) => ({
        id: grade.area_level_grade_id,
        displayName: `${area.name} - ${level.name} - ${grade.name}`,
        area: area.name,
        level: level.name,
        grade: grade.name,
        price: grade.price,
      })),
    ),
  )

  // Filtrar elementos basado en el término de búsqueda
  const filteredItems = flattenedItems.filter((item) =>
    item.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    const words = formData.description.trim() ? formData.description.trim().split(/\s+/) : []
    setWordCount(words.length)
  }, [formData.description])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (e) => {
    const newText = e.target.value
    const words = newText.trim() ? newText.trim().split(/\s+/) : []

    if (words.length <= MAX_WORDS) {
      setFormData((prev) => ({ ...prev, description: newText }))
    }
  }

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
    }))
  }

  const handleSelectItem = (item) => {
    // Verificar si ya está seleccionado
    if (formData.areas_levels_grades.includes(item.id)) {
      return
    }

    // Agregar a los arrays
    const newSelectedItems = [...selectedItems, item]
    const newSelectedIds = [...formData.areas_levels_grades, item.id]

    setSelectedItems(newSelectedItems)
    setFormData((prev) => ({
      ...prev,
      areas_levels_grades: newSelectedIds,
    }))
  }

  const handleRemoveItem = (itemId) => {
    // Remover de los arrays
    const newSelectedItems = selectedItems.filter((item) => item.id !== itemId)
    const newSelectedIds = formData.areas_levels_grades.filter((id) => id !== itemId)

    setSelectedItems(newSelectedItems)
    setFormData((prev) => ({
      ...prev,
      areas_levels_grades: newSelectedIds,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const currentWords = formData.description.trim().split(/\s+/).filter(Boolean).length
    if (currentWords > MAX_WORDS) {
      setModalType("error")
      setModalMessage(`El límite máximo es de ${MAX_WORDS} palabras`)
      setIsModalOpen(true)
      return
    }

    if (new Date(formData.date_fin) < new Date(formData.date_ini)) {
      setModalType("error")
      setModalMessage("La fecha de finalización no puede ser anterior a la de inicio")
      setIsModalOpen(true)
      return
    }

    if (formData.areas_levels_grades.length === 0) {
      setModalType("error")
      setModalMessage("Debe seleccionar al menos un área-nivel-grado")
      setIsModalOpen(true)
      return
    }

    try {
      console.log("Datos a enviar:", formData)
      await postIncriptionOlympics(formData).unwrap()
      setModalType("success")
      setModalMessage("¡Registro exitoso! La olimpiada ha sido creada correctamente.")
      setIsModalOpen(true)
      setFormData({
        name: "",
        description: "",
        date_ini: "",
        date_fin: "",
        status: "inactive",
        areas_levels_grades: [],
      })
      setSelectedItems([])
      setWordCount(0)
    } catch (error) {
      console.error("Error al registrar:", error)
      setModalType("error")
      setModalMessage(error.message || "Error al registrar. Por favor verifica los datos e intenta nuevamente.")
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <FormContainer className="max-w-4xl mx-auto rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-center mb-8 bg-blue-50 py-4 rounded-lg">
        <EmojiEventsIcon className="text-[#0f2e5a] mr-2" fontSize="large" />
        <Title title="Registro de Olimpiada" className="text-[#0f2e5a]" />
      </div>

      <FormContent onSubmit={handleSubmit} className="space-y-6">
        <FormGroup label="Nombre de la Olimpiada">
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="focus:ring-blue-500"
            placeholder="Ingrese el nombre de la olimpiada"
          />
        </FormGroup>

        <FormGroup label="Descripción">
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleDescriptionChange}
            rows={4}
            placeholder="Describe los detalles de la olimpiada..."
            wordCount={wordCount}
            maxWords={MAX_WORDS}
            showWordCount={true}
            showIcon={true}
            required
          />
        </FormGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Fecha de inicio">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <CalendarTodayIcon fontSize="small" />
              </div>
              <Input
                id="date_ini"
                name="date_ini"
                type="date"
                value={formData.date_ini}
                onChange={handleChange}
                required
                className="pl-10 focus:ring-blue-500"
              />
            </div>
          </FormGroup>

          <FormGroup label="Fecha de finalización">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                <CalendarTodayIcon fontSize="small" />
              </div>
              <Input
                id="date_fin"
                name="date_fin"
                type="date"
                value={formData.date_fin}
                onChange={handleChange}
                required
                className="pl-10 focus:ring-blue-500"
              />
            </div>
          </FormGroup>
        </div>

        <FormGroup label="Estado">
          <div className="flex gap-4 mt-2">
            <ButtonSE
              type="button"
              variant={formData.status === "active" ? "default" : "outline"}
              onClick={() => handleStatusChange("active")}
              className={`px-6 py-2.5 ${
                formData.status === "active" ? "bg-green-600 hover:bg-green-700 text-white" : ""
              }`}
            >
              {formData.status === "active" && <CheckCircleIcon fontSize="small" className="mr-2" />}
              Activo
            </ButtonSE>

            <ButtonSE
              type="button"
              variant={formData.status === "inactive" ? "destructive" : "outline"}
              onClick={() => handleStatusChange("inactive")}
            >
              {formData.status === "inactive" && <CancelIcon fontSize="small" className="mr-2" />}
              Inactivo
            </ButtonSE>
          </div>
          <div className="mt-3">
            <Badge variant={formData.status === "active" ? "default" : "destructive"} className="mt-2">
              {formData.status === "active" ? "Estado: Activo" : "Estado: Inactivo"}
            </Badge>
          </div>
        </FormGroup>

        {/* Selector de Áreas-Niveles-Grados */}
        <FormGroup label={`Áreas-Niveles-Grados (${selectedItems.length} seleccionados)`}>
          {isLoadingAreas ? (
            <div className="text-center py-4">Cargando áreas...</div>
          ) : isErrorAreas ? (
            <div className="text-red-500 text-center py-4">Error al cargar áreas</div>
          ) : (
            <div className="space-y-4">
              {/* Buscador */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <SearchIcon fontSize="small" />
                </div>
                <Input
                  placeholder="Buscar área, nivel o grado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Elementos seleccionados */}
              {selectedItems.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">Elementos seleccionados:</h4>
                  <div className="grid gap-2">
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-3 rounded border border-blue-200"
                      >
                        <div className="flex-1">
                          <span className="text-sm font-medium">{item.displayName}</span>
                          <span className="text-xs text-gray-500 ml-2">Bs. {item.price}</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de elementos disponibles */}
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <h4 className="font-semibold text-gray-800 mb-3">Elementos disponibles:</h4>
                <div className="grid gap-2">
                  {filteredItems
                    .filter((item) => !formData.areas_levels_grades.includes(item.id))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between bg-white p-3 rounded border hover:border-blue-300 transition-colors"
                      >
                        <div className="flex-1">
                          <span className="text-sm">{item.displayName}</span>
                          <span className="text-xs text-gray-500 ml-2">Bs. {item.price}</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleSelectItem(item)}
                          className="bg-green-500 hover:bg-green-600 text-white p-1 rounded"
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </div>
                    ))}
                </div>
                {filteredItems.filter((item) => !formData.areas_levels_grades.includes(item.id)).length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    {searchTerm ? "No se encontraron elementos" : "Todos los elementos están seleccionados"}
                  </div>
                )}
              </div>
            </div>
          )}
        </FormGroup>

        <div className="flex justify-end pt-4 border-t">
          <ButtonSE
            type="submit"
            disabled={isLoading}
            variant="default"
            className="bg-[#0f2e5a] hover:bg-[#0c2747] text-white px-8 py-3 rounded-md transition-colors font-medium flex items-center justify-center min-w-[180px]"
          >
            {isLoading ? (
              <>
                <AutorenewIcon fontSize="small" className="animate-spin mr-2" />
                Registrando...
              </>
            ) : (
              <>
                Registrar Olimpiada
                <ArrowForwardIcon fontSize="small" className="ml-2" />
              </>
            )}
          </ButtonSE>
        </div>
      </FormContent>

      {/* Debug: Mostrar datos actuales */}
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-bold mb-2">Vista previa de datos a enviar:</h3>
        <pre className="text-sm overflow-auto">{JSON.stringify(formData, null, 2)}</pre>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === "success" ? "Éxito" : "Error"}
        iconType={modalType}
        primaryButtonText="Aceptar"
        onPrimaryClick={handleCloseModal}
      >
        <p className="text-gray-700">{modalMessage}</p>
      </Modal>
    </FormContainer>
  )
}

export default RegisterOlympic
