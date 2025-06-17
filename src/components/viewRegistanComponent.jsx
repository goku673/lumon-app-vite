import Input from "../common/input"
import SearchIcon from "@mui/icons-material/Search"
import Table from "./table"
import Modal from "./modal/modal"
import Title from "../common/title"
import Text from "../common/text"
import TableExporter from "./tableExporter"
import FormGroup from "./formGroup"
import Selector from "./selector"
import Select from "../common/select"
import TableLoadingSkeleton from "../common/tableLoadingSkeleton"

export default function ViewRegistrantComponent(props) {
  const {
    notification,
    searchTerm,
    setSearchTerm,
    filteredData,
    columns,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    confirmDelete,
    isEditModalOpen,
    setIsEditModalOpen,
    editFormData,
    handleEditChange,
    isSchoolsLoading,
    isSchoolsError,
    schools,
    handleSchoolSelect,
    handleSchoolRemove,
    isGradesLoading,
    isGradesError,
    grades,
    confirmEdit,
    transformDataForExport,
    isCompetitorsLoading, // Nueva prop para el estado de carga
  } = props

  return (
    <div className="min-h-screen">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
            notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="container mx-auto py-8 px-4">
        <Title title="Alumnos Registrados" className="text-2xl font-bold mb-6 text-white text-center" />
        <div className="flex flex-col items-center mb-8 gap-4">
          <div className="relative w-full max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Buscar por nombre, carnet, email o colegio"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
          </div>

          {!isCompetitorsLoading && filteredData.length > 0 && (
            <TableExporter
              data={filteredData}
              transformData={transformDataForExport}
              fileName="alumnos_registrados"
              sheetName="Alumnos"
              buttonText="Exportar a Excel"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
            />
          )}
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {isCompetitorsLoading ? (
            <TableLoadingSkeleton rows={10} cols={columns.length > 0 ? columns.length : 7} />
          ) : (
            <Table columns={columns} data={filteredData} />
          )}
        </div>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Eliminación"
          iconType="warning"
          primaryButtonText="Eliminar"
          secondaryButtonText="Cancelar"
          onPrimaryClick={confirmDelete}
          onSecondaryClick={() => setIsDeleteModalOpen(false)}
        >
          <Text text="¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer." />
        </Modal>
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Competidor"
          iconType="info"
          primaryButtonText="Guardar Cambios"
          secondaryButtonText="Cancelar"
          onPrimaryClick={confirmEdit}
          onSecondaryClick={() => setIsEditModalOpen(false)}
        >
          <div className="space-y-4">
            <FormGroup label="Nombre:">
              <Input
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </FormGroup>

            <FormGroup label="Apellido:">
              <Input
                name="last_name"
                value={editFormData.last_name}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </FormGroup>

            <FormGroup label="Email:">
              <Input
                name="email"
                value={editFormData.email}
                readOnly
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
              <Text text="El email no se puede modificar" className="text-xs text-gray-500 mt-1 text-left" />
            </FormGroup>

            <FormGroup label="Teléfono:">
              <Input
                name="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </FormGroup>

            <FormGroup label="Seleccione Colegio:">
              {isSchoolsLoading ? (
                <Text text="Cargando colegios..." className="text-sm text-gray-500 text-left" />
              ) : isSchoolsError ? (
                <Text text="Error al cargar colegios." className="text-sm text-red-500 text-left" />
              ) : (
                <Selector
                  items={schools}
                  selectedItems={editFormData.colegio ? [editFormData.colegio] : []}
                  onSelect={handleSchoolSelect}
                  onRemove={handleSchoolRemove}
                  isMultiSelect={false}
                  placeholder="Buscar colegio..."
                  labelKey="name"
                />
              )}
            </FormGroup>

            <FormGroup label="Curso:">
              <Select
                name="curso"
                options={
                  isGradesLoading
                    ? [{ value: "", label: "Cargando cursos..." }]
                    : isGradesError
                      ? [{ value: "", label: "Error al cargar cursos" }]
                      : grades?.map((g) => ({ value: g.description, label: g.description })) || []
                }
                value={editFormData.curso}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </FormGroup>
          </div>
        </Modal>
      </div>
    </div>
  )
}
