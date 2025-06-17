"use client"

import { useState } from "react"
import {
  useGetCompetitorsQuery,
  useDeleteCompetitorMutation,
  useUpdateCompetitorMutation,
} from "../../redux/services/competitorsApi"
import { useGetSchoolsQuery } from "../../redux/services/schoolApi"
import { useGetGradesQuery } from "../../redux/services/register" // Asumo que es gradesApi o similar
import { format } from "date-fns"
import ViewRegistrantComponent from "../../../components/viewRegistanComponent"
import Button from "../../../common/button"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import AuthGuard from "../../../components/AuthGuard"

const ViewRegistrant = () => {
  const { data: competitors = [], isLoading: isCompetitorsLoading, refetch } = useGetCompetitorsQuery()
  const { data: schools, isLoading: isSchoolsLoading, isError: isSchoolsError } = useGetSchoolsQuery()
  const { data: grades, isLoading: isGradesLoading, isError: isGradesError } = useGetGradesQuery() // Asegúrate que el path sea correcto
  const [deleteCompetitor] = useDeleteCompetitorMutation()
  const [updateCompetitor] = useUpdateCompetitorMutation()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" })
  const [editFormData, setEditFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    curso: "",
    school_id: "",
    colegio: null,
  })

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" })
    }, 3000)
  }

  const filteredData = competitors
    .map((c) => {
      // Lógica para obtener el estado de la primera inscripción de la primera olimpiada
      let paymentStatus = "Desconocido"
      let paymentStatusText = "Desconocido"
      let olympicName = "N/A"
      let inscriptionDetails = "N/A"

      if (c.olympics && c.olympics.length > 0) {
        const firstOlympic = c.olympics[0]
        olympicName = firstOlympic.name || "Sin nombre"
        if (firstOlympic.inscriptions && firstOlympic.inscriptions.length > 0) {
          const firstInscription = firstOlympic.inscriptions[0]
          paymentStatus = firstInscription.status // "unpaid", "paid", etc.

          // Formatear el texto del estado
          if (paymentStatus === "unpaid") {
            paymentStatusText = "No Pagado"
          } else if (paymentStatus === "paid") {
            paymentStatusText = "Pagado"
          } else {
            paymentStatusText = paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1) // Capitalizar
          }

          // Detalles de la inscripción (área, nivel, grado)
          if (firstInscription.areas) {
            const { area, level, grade } = firstInscription.areas
            inscriptionDetails = `${area?.name || "N/A"} - ${level?.name || "N/A"} - ${grade?.name || "N/A"}`
          }
        } else {
          paymentStatusText = "Sin Inscripción"
        }
      } else {
        paymentStatusText = "Sin Olimpiada"
      }

      return {
        id: c.id,
        name: `${c.name} ${c.last_name}`,
        email: c.email || "-",
        carnet: c.ci,
        birthday: c.birthday ? format(new Date(c.birthday), "dd/MM/yyyy") : "-",
        phone: c.phone || "-",
        curso: c.curso || "-",
        colegio: c.school?.name || "Sin colegio",
        school_id: c.school?.id || "",
        // provincia: c.school?.province_id || "-", // Eliminado según solicitud implícita de simplificar
        // area: c.area_level_grades?.map((a) => a.name).join(", ") || "-", // Eliminado
        tutores: c.guardians?.map((g) => `${g.name} ${g.last_name} (${g.type})`).join(", ") || "Sin tutores",
        // estado: "CONFIRMADO", // Reemplazado por paymentStatusText
        // fechaRegistro: c.created_at ? format(new Date(c.created_at), "dd/MM/yyyy HH:mm") : "-", // Eliminado
        paymentStatus: paymentStatus, // "unpaid", "paid"
        paymentStatusText: paymentStatusText, // "No Pagado", "Pagado"
        olympicName: olympicName,
        inscriptionDetails: inscriptionDetails,
        original: {
          name: c.name || "",
          last_name: c.last_name || "",
          email: c.email || "",
          phone: c.phone || "",
          curso: c.curso || "",
          school_id: c.school?.id || "",
          school: c.school || null,
        },
      }
    })
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.carnet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.colegio && item.colegio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.olympicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.paymentStatusText.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const openDeleteModal = (id) => {
    setSelectedId(id)
    setIsDeleteModalOpen(true)
  }

  const openEditModal = (id) => {
    const competitor = filteredData.find((c) => c.id === id)
    if (competitor) {
      setSelectedId(id)
      setEditFormData({
        name: competitor.original.name,
        last_name: competitor.original.last_name,
        email: competitor.original.email,
        phone: competitor.original.phone,
        curso: competitor.original.curso,
        school_id: competitor.original.school_id,
        colegio: competitor.original.school,
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
      console.error(error)
      showNotification("Error al eliminar el competidor", "error")
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSchoolSelect = (school) => {
    setEditFormData((prev) => ({
      ...prev,
      colegio: school,
      school_id: school.id,
    }))
  }

  const handleSchoolRemove = () => {
    setEditFormData((prev) => ({
      ...prev,
      colegio: null,
      school_id: "",
    }))
  }

  const confirmEdit = async () => {
    try {
      const dataToUpdate = {
        name: editFormData.name,
        last_name: editFormData.last_name,
        phone: editFormData.phone,
        curso: editFormData.curso,
        school_id: editFormData.school_id,
      }

      await updateCompetitor({
        id: selectedId,
        data: dataToUpdate,
      }).unwrap()
      refetch()
      setIsEditModalOpen(false)
      showNotification("Competidor actualizado con éxito", "success")
    } catch (error) {
      console.error(error)
      showNotification("Error al actualizar el competidor", "error")
    }
  }

  const transformDataForExport = (data) => {
    return data.map((item) => ({
      ID: item.id,
      "Nombre y Apellido": item.name,
      Carnet: item.carnet,
      Teléfono: item.phone,
      Colegio: item.colegio,
      Curso: item.curso,
      Olimpiada: item.olympicName,
      "Inscripción (Área-Nivel-Grado)": item.inscriptionDetails,
      "Estado Pago": item.paymentStatusText,
      // "Email": item.email, // Opcional
      // "Fecha de Nacimiento": item.birthday, // Opcional
      // "Tutores": item.tutores, // Opcional
    }))
  }

  const columns = [
    { accessorKey: "id", header: "#ID", cell: (info) => info.getValue() },
    { accessorKey: "name", header: "Nombre y Apellido", cell: (info) => info.getValue() },
    { accessorKey: "carnet", header: "Carnet", cell: (info) => info.getValue() },
    { accessorKey: "phone", header: "Teléfono", cell: (info) => info.getValue() },
    { accessorKey: "colegio", header: "Colegio", cell: (info) => info.getValue() },
    { accessorKey: "curso", header: "Curso", cell: (info) => info.getValue() },
    { accessorKey: "olympicName", header: "Olimpiada", cell: (info) => info.getValue() },
    { accessorKey: "inscriptionDetails", header: "Inscripción (Área-Nivel-Grado)", cell: (info) => info.getValue() },
    {
      accessorKey: "paymentStatusText", // Usar el texto formateado
      header: "Estado Pago",
      cell: (info) => {
        const status = info.row.original.paymentStatus // Usar el status original para la lógica de color
        let textColor = "text-gray-800"
        let bgColor = "bg-gray-100"

        if (status === "unpaid") {
          textColor = "text-red-800"
          bgColor = "bg-red-100"
        } else if (status === "paid") {
          textColor = "text-green-800"
          bgColor = "bg-green-100"
        } else if (status === "pending") {
          textColor = "text-yellow-800"
          bgColor = "bg-yellow-100"
        }

        return (
          <span
            className={`inline-block px-3 py-1 ${bgColor} ${textColor} rounded-full text-xs font-semibold whitespace-nowrap min-w-[80px] text-center`}
          >
            {info.getValue()}
          </span>
        )
      },
    },
    // { accessorKey: "email", header: "Email", cell: (info) => info.getValue() }, // Opcional, si se quiere mantener
    // { accessorKey: "birthday", header: "Fecha Nacimiento", cell: (info) => info.getValue() }, // Opcional
    // { accessorKey: "tutores", header: "Tutores", cell: (info) => info.getValue() }, // Opcional
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
              aria-label="Editar"
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              onClick={() => openDeleteModal(registrantId)}
              className="p-1 mb-1 bg-red-500 text-white rounded hover:bg-red-600"
              aria-label="Eliminar"
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
        isCompetitorsLoading={isCompetitorsLoading}
      />
    </AuthGuard>
  )
}

export default ViewRegistrant