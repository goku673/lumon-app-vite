import { useState } from "react"
import { useGetCompetitorsQuery,useDeleteCompetitorMutation, useUpdateCompetitorMutation } from "../../redux/services/competitorsApi"
import { useGetSchoolsQuery } from "../../redux/services/schoolApi"
import { useGetGradesQuery } from "../../redux/services/register"
import { format } from "date-fns"
import ViewRegistrantComponent from "../../../components/viewRegistanComponent"
import Button from "../../../common/button"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AuthGuard from "../../../components/AuthGuard"

const ViewRegistrant = () => {
  const { data: competitors = [], refetch } = useGetCompetitorsQuery()
  const { data: schools, isLoading: isSchoolsLoading, isError: isSchoolsError } = useGetSchoolsQuery()
  const { data: grades, isLoading: isGradesLoading, isError: isGradesError } = useGetGradesQuery()
  const [deleteCompetitor] = useDeleteCompetitorMutation()
  const [updateCompetitor] = useUpdateCompetitorMutation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' })
  const [editFormData, setEditFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    curso: "",
    school_id: "",
    colegio: null
  })

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const filteredData = competitors
    .map((c) => ({
      id: c.id,
      name: `${c.name} ${c.last_name}`,
      email: c.email || "-",
      carnet: c.ci,
      birthday: c.birthday ? format(new Date(c.birthday), "dd/MM/yyyy") : "-",
      phone: c.phone || "-",
      curso: c.curso || "-",
      colegio: c.school?.name || "Sin colegio",
      school_id: c.school?.id || "",
      provincia: c.school?.province_id || "-",
      area: c.area_level_grades?.map((a) => a.name).join(", ") || "-",
      tutores: c.guardians?.map((g) => `${g.name} ${g.last_name} (${g.type})`).join(", ") || "Sin tutores",
      estado: "CONFIRMADO",
      fechaRegistro: c.created_at ? format(new Date(c.created_at), "dd/MM/yyyy HH:mm") : "-",
      original: {
        name: c.name || "",
        last_name: c.last_name || "",
        email: c.email || "",
        phone: c.phone || "",
        curso: c.curso || "",
        school_id: c.school?.id || "",
        school: c.school || null
      }
    }))
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.carnet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.colegio.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const openDeleteModal = (id) => {
    setSelectedId(id)
    setIsDeleteModalOpen(true)
  }

  const openEditModal = (id) => {
    const competitor = filteredData.find(c => c.id === id)
    if (competitor) {
      setSelectedId(id)
      setEditFormData({
        name: competitor.original.name,
        last_name: competitor.original.last_name,
        email: competitor.original.email,
        phone: competitor.original.phone,
        curso: competitor.original.curso,
        school_id: competitor.original.school_id,
        colegio: competitor.original.school
      })
      setIsEditModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteCompetitor(selectedId).unwrap()
      refetch()
      setIsDeleteModalOpen(false)
      showNotification("Competidor eliminado con éxito", "success")
    } catch (error) {
      console.error(error);
      showNotification("Error al eliminar el competidor", "error")
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSchoolSelect = school => {
    setEditFormData(prev => ({
      ...prev,
      colegio: school,
      school_id: school.id
    }))
  }

  const handleSchoolRemove = () => {
    setEditFormData(prev => ({
      ...prev,
      colegio: null,
      school_id: ""
    }))
  }

  const confirmEdit = async () => {
    try {
      const dataToUpdate = {
        name: editFormData.name,
        last_name: editFormData.last_name,
        phone: editFormData.phone,
        curso: editFormData.curso,
        school_id: editFormData.school_id
      }
      
      await updateCompetitor({
        id: selectedId,
        data: dataToUpdate
      }).unwrap()
      refetch()
      setIsEditModalOpen(false)
      showNotification("Competidor actualizado con éxito", "success")
    } catch (error) {
      console.error(error);
      showNotification("Error al actualizar el competidor", "error")
    }
  }

  const transformDataForExport = (data) => {
    return data.map((item) => ({
      "ID": item.id,
      "Nombre y Apellido": item.name,
      "Email": item.email,
      "Carnet": item.carnet,
      "Fecha de Nacimiento": item.birthday,
      "Teléfono": item.phone,
      "Curso": item.curso,
      "Colegio": item.colegio,
      "Área": item.area,
      "Tutores": item.tutores,
      "Estado": item.estado,
      "Fecha de Registro": item.fechaRegistro,
    }))
  }

  const columns = [
    { accessorKey: "id", header: "#ID", cell: (info) => info.getValue() },
    { accessorKey: "name", header: "Nombre y apellido", cell: (info) => info.getValue() },
    { accessorKey: "email", header: "Email", cell: (info) => info.getValue() },
    { accessorKey: "carnet", header: "Carnet", cell: (info) => info.getValue() },
    { accessorKey: "birthday", header: "Fecha Nacimiento", cell: (info) => info.getValue() },
    { accessorKey: "phone", header: "Teléfono", cell: (info) => info.getValue() },
    { accessorKey: "curso", header: "Curso", cell: (info) => info.getValue() },
    { accessorKey: "colegio", header: "Colegio", cell: (info) => info.getValue() },
    { accessorKey: "area", header: "Área", cell: (info) => info.getValue() },
    {
      accessorKey: "fechaRegistro",
      header: "Fecha de Registro",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: (info) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          {info.getValue()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (info) => {
        const registrantId = info.row.original.id
        return (
          <div className="flex space-x-2 justify-center">
            <Button 
              onClick={() => openEditModal(registrantId)}
              className="p-1 mb-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              onClick={() => openDeleteModal(registrantId)}
              className="p-1 mb-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
  <AuthGuard>
    <ViewRegistrantComponent
      notification={notification}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filteredData={filteredData}
      columns={columns}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      confirmDelete={confirmDelete}
      isEditModalOpen={isEditModalOpen}
      setIsEditModalOpen={setIsEditModalOpen}
      editFormData={editFormData}
      handleEditChange={handleEditChange}
      isSchoolsLoading={isSchoolsLoading}
      isSchoolsError={isSchoolsError}
      schools={schools}
      handleSchoolSelect={handleSchoolSelect}
      handleSchoolRemove={handleSchoolRemove}
      isGradesLoading={isGradesLoading}
      isGradesError={isGradesError}
      grades={grades}
      confirmEdit={confirmEdit}
      transformDataForExport={transformDataForExport}
      openEditModal={openEditModal}
      openDeleteModal={openDeleteModal}
    />
  </AuthGuard>
  )
}

export default ViewRegistrant;