import DetailField from "./form/DetailField";
import NameFields   from "./form/nameFields"
import { useState } from "react";
import Input from "../common/input";
import Button from "../common/button";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptIcon from '@mui/icons-material/Receipt';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import { format } from "date-fns";
import DetailSection from "./form/detailSection"
import { Card, CardContent, CardDescription,CardFooter,CardHeader, CardTitle } from "./cards";
import { es } from 'date-fns/locale';
import { useSearchCompetitorByCiQuery } from "../app/redux/services/competitorsApi";

const DetailInscription = () => {
  const [competitorCi, setCompetitorCi] = useState("");
  const [searchCi, setSearchCi] = useState("");
  
  const { data: competitors, isLoading, isError, error } = useSearchCompetitorByCiQuery(
    searchCi, 
    { skip: !searchCi }
  );
  

  const competitor = competitors && competitors.length > 0 ? competitors[0] : null;

  const splitLastName = (fullLastName) => {
    if (!fullLastName) return { firstLastName: "-", secondLastName: "-" };
    
    const parts = fullLastName.split(" ");
    if (parts.length === 1) {
      return { firstLastName: parts[0], secondLastName: "-" };
    } else {
      const firstLastName = parts[0];
      const secondLastName = parts.slice(1).join(" ");
      return { firstLastName, secondLastName };
    }
  };

  const handleSearch = () => {
    if (competitorCi) {
      setSearchCi(competitorCi);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Función para permitir solo números en el input
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setCompetitorCi(value);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      console.error(error);
      return dateString;
    }
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case "pending":
        return { text: "Pendiente", color: "text-yellow-500", bgColor: "bg-yellow-100" };
      case "completed":
      case "paid":
        return { text: "Completa", color: "text-green-500", bgColor: "bg-green-100" };
      case "rejected":
        return { text: "Rechazada", color: "text-red-500", bgColor: "bg-red-100" };
      default:
        return { text: status || "Desconocido", color: "text-gray-500", bgColor: "bg-gray-100" };
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">Ver Detalle de Inscripción</h1>
        
        <Card className="mb-8 shadow-lg border-t-4 border-t-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <h2 className="text-xl font-medium text-center text-[#0f2e5a]">Buscar Inscripción</h2>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md mx-auto">
                <Input
                  type="text"
                  placeholder="Ingrese CI del competidor"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={competitorCi}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <div 
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={handleSearch}
                >
                  <SearchIcon className="text-gray-400 hover:text-blue-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="mb-8 shadow-md animate-pulse">
            <CardContent>
              <div className="text-center text-lg text-blue-800">
                <div className="inline-block mr-2 animate-spin">⟳</div>
                Cargando datos del competidor...
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="mb-8 shadow-md border-l-4 border-l-red-500">
            <CardContent>
              <div className="text-center text-red-500 text-lg">
                Error al buscar el competidor: {error?.data?.message || "No se encontró el competidor"}
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && competitor && (
          <>
            <DetailSection title={
              <div className="flex items-center text-white">
                <PersonIcon className="mr-2 text-white" /> DATOS DEL COMPETIDOR
              </div>
            } className="shadow-md border-l-4 border-l-blue-500">
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                {competitor.last_name && competitor.last_name.includes(" ") ? (
                  <div>
                    <h3 className="text-blue-800 font-semibold mb-2">Nombre del Competidor:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <DetailField 
                        label="Nombre:" 
                        value={competitor.name || "-"} 
                        className="bg-white shadow-sm rounded-lg p-3"
                      />
                      <DetailField 
                        label="Primer Apellido:" 
                        value={splitLastName(competitor.last_name).firstLastName} 
                        className="bg-white shadow-sm rounded-lg p-3"
                      />
                      <DetailField 
                        label="Segundo Apellido:" 
                        value={splitLastName(competitor.last_name).secondLastName} 
                        className="bg-white shadow-sm rounded-lg p-3"
                      />
                    </div>
                  </div>
                ) : (
                  <NameFields 
                    title="Nombre del Competidor:" 
                    lastName={competitor.last_name || "-"} 
                    middleName="" 
                    firstName={competitor.name || "-"} 
                    className="text-blue-800 font-semibold"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <DetailField 
                  label="Correo Electrónico:" 
                  value={competitor.email || "-"} 
                  className="bg-white shadow-sm rounded-lg p-3"
                />
                <DetailField 
                  label="Cédula Identidad:" 
                  value={competitor.ci || "-"} 
                  className="bg-white shadow-sm rounded-lg p-3"
                />
                <DetailField 
                  label="Fecha de nacimiento:" 
                  value={formatDate(competitor.birthday)} 
                  className="bg-white shadow-sm rounded-lg p-3"
                />
              </div>

              <DetailField 
                label="Colegio:" 
                value={competitor.school?.name || "Sin colegio asignado"} 
                className="bg-white shadow-sm rounded-lg p-3 mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <DetailField 
                  label="Curso:" 
                  value={competitor.curso || "-"} 
                  className="bg-white shadow-sm rounded-lg p-3"
                />
                <DetailField 
                  label="Departamento:" 
                  value={competitor.department?.name || "-"} 
                  className="bg-white shadow-sm rounded-lg p-3"
                />
                <DetailField 
                  label="Provincia:" 
                  value={competitor.province?.name || "-"} 
                  className="bg-white shadow-sm rounded-lg p-3"
                />
              </div>

              {competitor.olympics && competitor.olympics.length > 0 && (
                <DetailField 
                  label="Área a la que se Inscribe:" 
                  value={competitor.olympics[0]?.name || "Sin inscripción"} 
                  className="bg-blue-100 shadow-sm rounded-lg p-3 font-medium"
                />
              )}
            </DetailSection>

            {competitor?.guardians && competitor.guardians.length > 0 && (
              <DetailSection title={
                <div className="flex items-center text-white">
                  <SchoolIcon className="mr-2 text-white" /> DATOS DE PROFESOR O TUTOR
                </div>
              } className="shadow-md border-l-4 border-l-green-500 mt-8">
                {competitor?.guardians?.map((guardian, index) => (
                  <div key={guardian.id || index} className={index > 0 ? "mt-6 pt-6 border-t" : ""}>
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      {guardian.last_name && guardian.last_name.includes(" ") ? (
                        <div>
                          <h3 className="text-green-800 font-semibold mb-2">{`Nombre del ${guardian.type || "Tutor"}:`}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <DetailField 
                              label="Nombre:" 
                              value={guardian.name || "-"} 
                              className="bg-white shadow-sm rounded-lg p-3"
                            />
                            <DetailField 
                              label="Primer Apellido:" 
                              value={splitLastName(guardian.last_name).firstLastName} 
                              className="bg-white shadow-sm rounded-lg p-3"
                            />
                            <DetailField 
                              label="Segundo Apellido:" 
                              value={splitLastName(guardian.last_name).secondLastName} 
                              className="bg-white shadow-sm rounded-lg p-3"
                            />
                          </div>
                        </div>
                      ) : (
                        <NameFields
                          title={`Nombre del ${guardian.type || "Tutor"}:`}
                          lastName={guardian.last_name || "-"}
                          middleName=""
                          firstName={guardian.name || "-"}
                          className="text-green-800 font-semibold"
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailField 
                        label="Correo electrónico:" 
                        value={guardian.email || "-"} 
                        className="bg-white shadow-sm rounded-lg p-3"
                      />
                      <DetailField 
                        label="Celular:" 
                        value={guardian.phone || "-"} 
                        className="bg-white shadow-sm rounded-lg p-3"
                      />
                    </div>
                  </div>
                ))}
              </DetailSection>
            )}

            {competitor.olympics && competitor.olympics.length > 0 && competitor.olympics[0].inscriptions && (
              <DetailSection title={
                <div className="flex items-center text-white">
                  <EventIcon className="mr-2 text-white" /> INFORMACIÓN DE INSCRIPCIÓN
                </div>
              } className="shadow-md border-l-4 border-l-purple-500 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <DetailField 
                    label="Fecha de inscripción:" 
                    value={formatDate(competitor.olympics[0].date_ini)} 
                    className="bg-white shadow-sm rounded-lg p-3"
                  />
                  
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Estado Inscripción:</label>
                    <div className={`w-full px-3 py-2 border rounded-md text-left ${getStatusInfo(competitor.olympics[0].inscriptions[0].status).bgColor} ${getStatusInfo(competitor.olympics[0].inscriptions[0].status).color} font-medium`}>
                      {getStatusInfo(competitor.olympics[0].inscriptions[0].status).text}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Comprobante de pago</label>
                    <button 
                      className={`w-full px-3 py-2 border rounded-md text-left flex items-center justify-between ${competitor.olympics[0].inscriptions[0].payment_order_id ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "bg-gray-100 text-gray-500"} transition-colors`}
                      disabled={!competitor.olympics[0].inscriptions[0].payment_order_id}
                    >
                      <span>{competitor.olympics[0].inscriptions[0].payment_order_id ? "Ver Comprobante" : "Sin comprobante"}</span>
                      {competitor.olympics[0].inscriptions[0].payment_order_id && <ReceiptIcon />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <DetailField 
                    label="Número Comprobante:" 
                    value={competitor.olympics[0].inscriptions[0].payment_order_id || "-"} 
                    className="bg-white shadow-sm rounded-lg p-3"
                  />
                  <DetailField 
                    label="Nombre del Pagador:" 
                    value={competitor.guardians?.[0] ? 
                           `${competitor.guardians[0].name} ${competitor.guardians[0].last_name}` : 
                           "-"} 
                    className="bg-white shadow-sm rounded-lg p-3"
                  />
                  <DetailField 
                    label="Área de Inscripción:" 
                    value={competitor.olympics[0].inscriptions[0].areas?.area?.name || "-"} 
                    className="bg-purple-100 shadow-sm rounded-lg p-3 font-medium"
                  />
                </div>
                
                {competitor.olympics[0] && (
                  <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-purple-800">Detalles de la Olimpiada:</h3>
                    <p className="mb-2"><span className="font-medium">Nombre:</span> {competitor.olympics[0].name}</p>
                    <p className="mb-2"><span className="font-medium">Descripción:</span> {competitor.olympics[0].description}</p>
                    <p className="mb-2">
                      <span className="font-medium">Fechas:</span> Del {formatDate(competitor.olympics[0].date_ini)} al {formatDate(competitor.olympics[0].date_fin)}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Nivel:</span> {competitor.olympics[0].inscriptions[0].areas?.level?.name || "-"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Grado:</span> {competitor.olympics[0].inscriptions[0].areas?.grade?.name || "-"}
                    </p>
                  </div>
                )}
              </DetailSection>
            )}
          </>
        )}

        {!isLoading && !isError && (!competitors || competitors.length === 0) && searchCi && (
          <Card className="mb-8 shadow-md border-l-4 border-l-red-500">
            <CardContent>
              <div className="text-center text-red-500 text-lg">
                No se encontró ningún competidor con el CI: {searchCi}
              </div>
            </CardContent>
          </Card>
        )}

        {!searchCi && (
          <Card className="mb-8 shadow-md border-l-4 border-l-blue-300">
            <CardContent>
              <div className="text-center text-lg text-blue-800">
                Ingrese un CI de competidor para ver sus detalles
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DetailInscription;