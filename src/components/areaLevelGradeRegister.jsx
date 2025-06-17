import { useState } from "react"
import { usePostAreaLevelsGradesMutation } from "../app/redux/services/areaLevelsGrades"
import Button from "../common/button"
import Selector from "./selector"
import Modal from "./modal/modal"
import { useGetAreasQuery } from "../app/redux/services/areaApi"
import { useGetLevelsQuery } from "../app/redux/services/levelsApi"
import { useGetGradesQuery } from "../app/redux/services/gradesApi"
import SaveIcon from "@mui/icons-material/Save"

const RegisterAreaLevelGradeComponent = () => {
  const [createAssociation] = usePostAreaLevelsGradesMutation()
  const { data: areas } = useGetAreasQuery()
  const { data: levels } = useGetLevelsQuery()
  const { data: grades } = useGetGradesQuery()

  const [selectedArea, setSelectedArea] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedGrades, setSelectedGrades] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [modalType, setModalType] = useState("success")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedArea || !selectedLevel || selectedGrades.length === 0) {
      setModalType("error")
      setModalMessage("Debe seleccionar todas las opciones requeridas")
      setIsModalOpen(true)
      return
    }

    try {
      await createAssociation({
        area_id: selectedArea.id,
        level_id: selectedLevel.id,
        grade_ids: selectedGrades.map((grade) => grade.id),
      }).unwrap()
      setModalType("success")
      setModalMessage("Asociación creada exitosamente!")
      setIsModalOpen(true)
      setSelectedArea(null)
      setSelectedLevel(null)
      setSelectedGrades([])
    } catch (error) {
      console.error("Error creating association:", error)
      setModalType("error")
      setModalMessage(error.data?.message || "Error al crear la asociación")
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Asociar Área con Nivel y Grados</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione un Área</label>
            <Selector
              items={areas || []}
              selectedItems={selectedArea ? [selectedArea] : []}
              onSelect={(item) => setSelectedArea(item)}
              onRemove={() => setSelectedArea(null)}
              placeholder="Buscar área..."
              isMultiSelect={false}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione un Nivel</label>
            <Selector
              items={levels || []}
              selectedItems={selectedLevel ? [selectedLevel] : []}
              onSelect={(item) => setSelectedLevel(item)}
              onRemove={() => setSelectedLevel(null)}
              placeholder="Buscar nivel..."
              isMultiSelect={false}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione Grados</label>
          <Selector
            items={grades || []}
            selectedItems={selectedGrades}
            onSelect={(item) => setSelectedGrades((prev) => [...prev, item])}
            onRemove={(item) => setSelectedGrades((prev) => prev.filter((g) => g.id !== item.id))}
            placeholder="Buscar grados..."
            isMultiSelect={true}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#0f2e5a] hover:bg-white border-[#0f2e5a] border-2 hover:text-[#0f2e5a] text-white px-6 py-2 rounded-md transition-colors"
            disabled={!selectedArea || !selectedLevel || selectedGrades.length === 0}
          >
            <SaveIcon className="mr-2" fontSize="small" />
            Crear Asociación
          </Button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === "success" ? "Éxito" : modalType === "warning" ? "Advertencia" : "Error"}
        iconType={modalType}
        primaryButtonText="Aceptar"
        onPrimaryClick={handleCloseModal}
      >
        <p className="text-gray-700">{modalMessage}</p>
      </Modal>
    </div>
  )
}

export default RegisterAreaLevelGradeComponent
