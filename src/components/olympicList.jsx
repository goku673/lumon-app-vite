import { useState } from "react"
import { useGetOlympicsQuery } from "../app/redux/services/olympicsApi"
import Badge from "../common/badge"
import Skeleton from "../common/skeleton"
import { Card, 
         CardContent, 
         CardDescription, 
         CardFooter, 
         CardHeader, 
         CardTitle } from "./cards"

import { TabsContent } from "./tabs/tabsContent"
import { TabsList } from "./tabs/tabsList"
import { Tabs } from "./tabs/tabs"
import { TabsTrigger } from "./tabs/tabsTrigger"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import FilterListIcon from "@mui/icons-material/FilterList"
import ButtonSE from "../common/ButtonSE"
import FormContainer from "../common/formContainer"
import Title from "../common/title"
import { useDispatch } from "react-redux";
import { setSelectedOlympic,clearSelectedOlympic } from "../app/redux/slice/olympicsSlice"

export default function OlympicsList() {
    const dispatch = useDispatch();
    //const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic);
    const { data: olympics = [], isLoading, error } = useGetOlympicsQuery()
    const [selected, setSelected] = useState(null)
  
    const formatDate = (date) =>
      new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
  
    if (error) {
      return (
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">
            Error al cargar las olimpiadas
          </h3>
          <p className="mt-2 text-red-700">Por favor, intente nuevamente más tarde.</p>
        </div>
      )
    }
  
    const renderGrid = (list) => {
      if (isLoading) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
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
            <FilterListIcon className="mx-auto  mb-4 text-white" fontSize="large" />
            <h3 className="text-xl font-medium text-white">No hay olimpiadas</h3>
          </div>
        )
      }
  
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(o => (
            <Card
              key={o.id}
              className={`border border-gray-200 group ${
                selected?.id === o.id ? "ring-2 ring-[#0f2e5a]" : ""
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{o.name}</CardTitle>
                  <Badge variant={o.status === "active" ? "default" : "secondary"}>
                    {o.status === "active" ? "Activa" : "Inactiva"}
                  </Badge>
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
              <CardFooter>
                <ButtonSE
                  className="w-full"
                  style={{ backgroundColor: selected?.id === o.id ? "#0f2e5a" : undefined }}
                  variant={selected?.id === o.id ? undefined : "outline"}
                  onClick={() => {
                    if (selected?.id === o.id) {
                      dispatch(clearSelectedOlympic());
                      setSelected(null);
                    } else {
                      dispatch(setSelectedOlympic(o));
                      setSelected(o);
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

        <Tabs defaultValue="all" className="w-auto mx-auto justify-center">
            <div className="flex justify-center mb-4"> 
            <TabsList className="mb-6 bg-gray-100 p-1 rounded-lg">
            {["all", "active", "inactive"].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={`px-4 py-2 rounded-md`}
              >
                {tab === "all"
                  ? "Todas"
                  : tab === "active"
                  ? "Activas"
                  : "Inactivas"}
              </TabsTrigger>
            ))}
          </TabsList>
            </div>
          <TabsContent value="all">
            {renderGrid(olympics)}
          </TabsContent>
          <TabsContent value="active">
            {renderGrid(olympics.filter(o => o.status === "active"))}
          </TabsContent>
          <TabsContent value="inactive">
            {renderGrid(olympics.filter(o => o.status === "inactive"))}
          </TabsContent>
        </Tabs>
      </div>
    )
}