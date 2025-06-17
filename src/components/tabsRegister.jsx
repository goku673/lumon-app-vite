import { useState } from "react";
import RegisterAreaLevelGradeComponent from "./areaLevelGradeRegister";
import Table from "./table";
import Button from "../common/button";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useGetAreaLevelsGradesQuery, useDeleteAreaLevelsGradesMutation } from "../app/redux/services/areaLevelsGrades";
import Modal from "./modal/modal";
import RegisterArea from "./areaRegister";
import RegisterGrade from "./gradeRegister";
import RegisterLevel from "./levelRegister";
import { TabsContent } from "./tabs/tabsContent";
import { TabsList } from "./tabs/tabsList";
import { TabsTrigger } from "./tabs/tabsTrigger";
import { Tabs } from "./tabs/tabs";
import TableExporter from "./tableExporter";

const TabsRegister = () => {
  const { data: areaLevelGrades, isLoading, isError, refetch } = useGetAreaLevelsGradesQuery();
  const [deleteAssociation] = useDeleteAreaLevelsGradesMutation();
  const [activeTab, setActiveTab] = useState("registerArea");
  const [modal, setModal] = useState({ open: false, title: '', type: 'info', message: '', id: null });

  const closeModal = () => setModal(prev => ({ ...prev, open: false, id: null }));

  const handleDelete = async () => {
    try {
      if (modal.id) {
        await deleteAssociation(modal.id).unwrap();
        setModal({ open: true, title: "Éxito", type: "success", message: "Asociación eliminada correctamente.", id: null });
        refetch();
      }
    } catch (error) {
      console.error("Error al eliminar asociación:", error);
      setModal({ open: true, title: "Error", type: "error", message: "No se pudo eliminar la asociación.", id: null });
    }
  };

  const flattenedData = areaLevelGrades?.flatMap((area) =>
    area.levels.flatMap((level) =>
      level.grades.map((grade) => ({
        id: grade.area_level_grade_id,
        name: area.name,
        nivel: level.name,
        grado: grade.name,
        costo: grade.price,
        description: "-",
      }))
    )
  ) || [];

  const columns = [
    { accessorKey: "id", header: "ID", cell: info => info.getValue() },
    { accessorKey: "name", header: "Área", cell: info => info.getValue() },
    { accessorKey: "nivel", header: "Nivel", cell: info => info.getValue() },
    { accessorKey: "grado", header: "Grado", cell: info => info.getValue() },
    { accessorKey: "costo", header: "Costo (Bs)", cell: info => info.getValue() },
    // { accessorKey: "description", header: "Descripción", cell: info => info.getValue() },
    {
      id: "actions",
      header: "Acciones",
      cell: info => {
        const id = info.row.original.id;
        return (
          <div className="flex space-x-2 justify-center">
            {/* <Button className="p-1 bg-[#00A86B] hover:bg-[#008f5b] text-white  rounded">
              <EditIcon />
            </Button> */}
            <Button
              onClick={() => setModal({ open: true, title: "Confirmar Eliminación", type: "warning", message: `¿Eliminar registro con ID ${id}?`, id })}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <DeleteIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  const transformDataForExport = (data) => {
    return data.map((item) => ({
      "ID": item.id,
      "Área": item.name,
      "Nivel": item.nivel,
      "Grado": item.grado,
      "Costo (Bs)": item.costo,
      "Descripción": item.description
    }));
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full flex justify-center">
          <TabsList className="mb-4 max-w-4xl w-full justify-center">
            <TabsTrigger value="registerArea">Registrar Área</TabsTrigger>
            <TabsTrigger value="registerGrade">Registrar Grado</TabsTrigger>
            <TabsTrigger value="registerLevel">Registrar Nivel</TabsTrigger>
            <TabsTrigger value="registerAreaLevelGrade">Registrar Área–Nivel–Grado</TabsTrigger>
            <TabsTrigger value="list">Ver Lista de Asociaciones</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="registerArea" className="w-full">
          <RegisterArea />
        </TabsContent>

        <TabsContent value="registerGrade" className="w-full">
          <RegisterGrade />
        </TabsContent>

        <TabsContent value="registerLevel" className="w-full">
          <RegisterLevel />
        </TabsContent>

        <TabsContent value="registerAreaLevelGrade" className="w-full">
          <RegisterAreaLevelGradeComponent />
        </TabsContent>

        <TabsContent value="list" className="w-full">
          <div className="w-full overflow-x-auto px-4 py-8 flex justify-center">
            <div className="w-full max-w-7xl">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold text-white">
                  Lista de Área–Nivel–Grado Registradas
                </h1>
                
                {!isLoading && !isError && flattenedData.length > 0 && (
                  <TableExporter 
                    data={flattenedData}
                    transformData={transformDataForExport}
                    fileName="area_nivel_grado"
                    sheetName="Asociaciones"
                    buttonText="Exportar a Excel"
                    className="bg-[#00A86B] hover:bg-[#008f5b] text-white font-bold py-2 px-4 rounded-md flex items-center"
                  />
                )}
              </div>
              
              {isLoading ? (
                <p className="text-center text-gray-500">Cargando datos...</p>
              ) : isError ? (
                <p className="text-center text-red-500">Error al cargar los datos</p>
              ) : (
                <Table columns={columns} data={flattenedData} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={modal.open}
        onClose={closeModal}
        title={modal.title}
        iconType={modal.type}
        primaryButtonText={modal.type === "warning" ? "Eliminar" : "Aceptar"}
        secondaryButtonText={modal.type === "warning" ? "Cancelar" : undefined}
        onPrimaryClick={modal.type === "warning" ? handleDelete : closeModal}
        onSecondaryClick={modal.type === "warning" ? closeModal : undefined}
      >
        <p className="text-gray-700">{modal.message}</p>
      </Modal>
    </div>
  );
};

export default TabsRegister;
