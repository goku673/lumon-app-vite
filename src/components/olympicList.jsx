import { useState } from "react"
import { useGetOlympicsQuery, useGetOlympicByIdQuery } from "../app/redux/services/olympicsApi"
import Badge from "../common/badge"
import Skeleton from "../common/skeleton"
import Modal from "./modal/modal"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./cards"
import { TabsContent } from "./tabs/tabsContent"
import { TabsList } from "./tabs/tabsList"
import { Tabs } from "./tabs/tabs"
import { TabsTrigger } from "./tabs/tabsTrigger"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import FilterListIcon from "@mui/icons-material/FilterList"
import VisibilityIcon from "@mui/icons-material/Visibility"
import SchoolIcon from "@mui/icons-material/School"
import ListAltIcon from "@mui/icons-material/ListAlt"
import SearchIcon from "@mui/icons-material/Search"
import ButtonSE from "../common/ButtonSE"
import Button from "../common/button"
import Input from "../common/input"
import Title from "../common/Title"
import { useDispatch, useSelector } from "react-redux"
import { setSelectedOlympic, clearSelectedOlympic } from "../app/redux/slice/olympicsSlice"

export default function OlympicsList() {
  const dispatch = useDispatch()
  const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic)

  const [selected, setSelected] = useState(null)
  const [isAreasModalOpen, setIsAreasModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: olympics = [], isLoading, error } = useGetOlympicsQuery()
  const { data: olympicDetails } = useGetOlympicByIdQuery(selectedOlympic?.id, {
    skip: !selectedOlympic?.id,
  })

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const handleViewAreas = () => {
    setIsAreasModalOpen(true)
    setSearchTerm("")
  }

  const closeAreasModal = () => {
    setIsAreasModalOpen(false)
    setSearchTerm("")
  }

  // Formatear áreas para el select
  const formatAreasForSelect = (areas) => {
    if (!areas) return []

    return areas.map((item) => ({
      id: item.id,
      label: `${item.area} - ${item.level} - ${item.grade}`,
      status: item.status,
      area: item.area,
      level: item.level,
      grade: item.grade,
    }))
  }

  const formattedAreas = formatAreasForSelect(olympicDetails?.areas_levels_grades)

  // Filtrar áreas basado en el término de búsqueda
  const filteredAreas = formattedAreas.filter((area) => area.label.toLowerCase().includes(searchTerm.toLowerCase()))

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">Error al cargar las olimpiadas</h3>
        <p className="mt-2 text-red-700">Por favor, intente nuevamente más tarde.</p>
      </div>
    )
  }

  const renderGrid = (list) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-gray-200">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    }

    if (!list.length) {
      return (
        <div className="text-center py-16">
          <FilterListIcon className="mx-auto mb-4 text-white" fontSize="large" />
          <h3 className="text-xl font-medium text-white">No hay olimpiadas</h3>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((o) => (
          <Card
            key={o.id}
            className={`border border-gray-200 group ${selected?.id === o.id ? "ring-2 ring-[#0f2e5a]" : ""}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex-1">{o.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {selected?.id === o.id && (
                 <Button
                  onClick={handleViewAreas}
                  className="bg-[#0f2e5a] hover:bg-[rgb(46,87,145)] text-white mb-2 rounded-full p-1 w-8 h-8 min-w-0 flex items-center justify-center"
                  title="Ver áreas registradas"
                >
                  <VisibilityIcon fontSize="inherit" />
                </Button>


                  )}
                  <Badge variant={o.status === "active" ? "default" : "secondary"}>
                    {o.status === "active" ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
              </div>
              <CardDescription>{o.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-md space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarTodayIcon className="text-gray-500" fontSize="small" />
                  <span>Inicio: {formatDate(o.date_ini)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarTodayIcon className="text-gray-500" fontSize="small" />
                  <span>Fin: {formatDate(o.date_fin)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <ButtonSE
                className="flex-1"
                style={{ backgroundColor: selected?.id === o.id ? "#0f2e5a" : undefined }}
                variant={selected?.id === o.id ? undefined : "outline"}
                onClick={() => {
                  if (selected?.id === o.id) {
                    dispatch(clearSelectedOlympic())
                    setSelected(null)
                  } else {
                    dispatch(setSelectedOlympic(o))
                    setSelected(o)
                  }
                }}
              >
                {selected?.id === o.id ? "Seleccionada" : "Seleccionar"}
              </ButtonSE>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="py-8 px-4 space-y-8">
      <div className="flex justify-center">
        <Title className="text-white" title="Lista de Olimpiadas" />
      </div>

      {/* Información de olimpiada seleccionada */}
      {selectedOlympic && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SchoolIcon className="text-[#0f2e5a]" />
              <div>
                <h3 className="font-semibold text-[#0f2e5a]">Olimpiada Seleccionada:</h3>
                <p className="text-blue-700">{selectedOlympic.name}</p>
              </div>
            </div>
            <Button
              onClick={handleViewAreas}
              className="bg-[#0f2e5a] hover:bg-[rgb(46,87,145)] text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <ListAltIcon fontSize="small" />
              Ver Áreas
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-auto mx-auto justify-center">
        <div className="flex justify-center mb-4">
          <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
            {["all", "active", "inactive"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className={`px-4 py-2 rounded-md`}>
                {tab === "all" ? "Todas" : tab === "active" ? "Activas" : "Inactivas"}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="all">{renderGrid(olympics)}</TabsContent>
        <TabsContent value="active">{renderGrid(olympics.filter((o) => o.status === "active"))}</TabsContent>
        <TabsContent value="inactive">{renderGrid(olympics.filter((o) => o.status === "inactive"))}</TabsContent>
      </Tabs>

      {/* Modal simple con select y scroll */}
      <Modal
        isOpen={isAreasModalOpen}
        onClose={closeAreasModal}
        title={`Áreas de ${selectedOlympic?.name || ""}`}
        iconType="info"
        primaryButtonText="Cerrar"
        onPrimaryClick={closeAreasModal}
        className="max-w-2xl"
      >
        <div className="space-y-4">
          {/* Información básica */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-sm text-gray-600">Total de áreas registradas:</span>
            <Badge variant="outline" className="font-semibold">
              {formattedAreas.length}
            </Badge>
          </div>

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

          {/* Lista con scroll */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {searchTerm ? `${filteredAreas.length} resultados` : "Todas las áreas"}
              </span>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredAreas.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredAreas.map((area) => (
                    <div
                      key={area.id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{area.label}</span>
                        
                      </div>
                      <Badge variant={area.status === "active" ? "default" : "secondary"} className="text-xs">
                        {area.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? "No se encontraron resultados" : "No hay áreas registradas"}
                </div>
              )}
            </div>
          </div>

          {/* Contador de resultados */}
          {searchTerm && (
            <div className="text-center text-sm text-gray-500">
              Mostrando {filteredAreas.length} de {formattedAreas.length} áreas
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
