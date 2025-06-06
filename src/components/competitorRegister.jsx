import { useState } from "react";
import { useGetGradesQuery } from "../app/redux/services/register";
import { useGetProvincesQuery } from "../app/redux/services/areaApi";
import { useGetAreaLevelsGradesQuery } from "../app/redux/services/areaLevelsGrades";
import { useGetDepartmentsQuery } from "../app/redux/services/areaApi";
import { useGetSchoolsQuery } from "../app/redux/services/schoolApi";
import SaveIcon from "@mui/icons-material/Save";
import { ArrowBack } from "@mui/icons-material";
import Button from "@mui/material/Button";
import FormGroup from "./formGroup";
import FormContainer from "../common/formContainer";
import FormContent from "../common/formContent";
import Title from "../common/title";
import RenderComponent from "./RenderComponent";
import { inputFieldsCompetitor, renderField } from "../utils/inputFieldsCompetitor";
import { useSelector } from "react-redux";
import Input from "../common/input";
import Select from "../common/select";
import Selector from "./selector";


const CompetitorRegister = ({ onSubmit, onBack, initialData = {}, guardians = [] }) => {
  const selectedOlympic = useSelector((state) => state.olympic.selectedOlympic);
  const { data: grades, isLoading: isGradesLoading, isError: isGradesError } = useGetGradesQuery();
  const { data: areaLevelGrades, isLoading: isAreaLevelGradesLoading, isError: isAreaLevelGradesError } = useGetAreaLevelsGradesQuery();
  const { data: schools, isLoading: isSchoolsLoading, isError: isSchoolsError } = useGetSchoolsQuery();
  const { data: departments, isLoading: isDepartmentsLoading, isError: isDepartmentsError,  } = useGetDepartmentsQuery();
  const { data: provinces, isLoading: isProvincesLoading, isError: isProvincesError } = useGetProvincesQuery();


  
  const [formData, setFormData] = useState({
    apellidoPaterno: "",
    apellidoMaterno: "",
    nombres: "",
    email: "",
    cedula: "",
    fechaNacimiento: "",
    celular: "",
    colegio: null,
    curso: "",
    departamento: "",
    provincia: "",
    area_level_grades: [],
    wordCount: 0,
    ...initialData,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    const words = value.trim().split(/\s+/).filter(Boolean);
    setFormData(prev => ({ 
      ...prev, 
      description: value,
      wordCount: words.length
    }));
  };

  const handleSchoolSelect = school => setFormData(prev => ({ ...prev, colegio: school }));
  const handleSchoolRemove = ()    => setFormData(prev => ({ ...prev, colegio: null }));

  const flattenedGrades = areaLevelGrades?.flatMap((area) => 
    area.levels.flatMap((level) => 
      level.grades.map((grade) => ({
        id: grade.area_level_grade_id,
        name: `${area.name} - ${level.name} - ${grade.name}`,
      }))
    )
  ) || [];

  const handleGradeSelect = grade => setFormData(prev => ({
    ...prev,
    area_level_grades: [...prev.area_level_grades, grade]
  }));

  const handleGradeRemove = grade => setFormData(prev => ({
    ...prev,
    area_level_grades: prev.area_level_grades.filter(g => g.id !== grade.id)
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const transformedData = {
      name: formData.nombres,
      last_name: `${formData.apellidoPaterno} ${formData.apellidoMaterno}`.trim(),
      ci: formData.cedula,
      birthday: formatDateForAPI(formData.fechaNacimiento),
      phone: formData.celular,
      email: formData.email,
      school_id: formData.colegio?.id || null,
      curso: formData.curso,
      guardian_ids: guardians.map(guardian => guardian.id),
      olympic_id: selectedOlympic?.id,
      area_level_grade_ids: formData.area_level_grades.map(grade => grade.id)
    };
    
    onSubmit(transformedData);
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return dateString; 
    
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const renderComponent = (fieldConfig) => {
    const handlers = {
      handleChange,
      handleDescriptionChange,
      handleSchoolSelect,
      handleSchoolRemove,
      handleGradeSelect,
      handleGradeRemove
    };
    
    const dataProviders = {
      grades,
      isGradesLoading,
      isGradesError,
      schools,
      isSchoolsLoading,
      isSchoolsError,
      departments,
      isDepartmentsLoading,
      isDepartmentsError,
      provinces,
      isProvincesLoading,
      isProvincesError,
      flattenedGrades,
      isAreaLevelGradesLoading,
      isAreaLevelGradesError
    };
    
    if (typeof RenderComponent === 'function') {
      try {
        return (
          <RenderComponent
            fieldConfig={fieldConfig}
            formData={formData}
            handlers={handlers}
            dataProviders={dataProviders}
            renderField={renderField}
          />
        );
      } catch (error) {
        console.error("Error en RenderComponent:", error);
      }
    }
    
    const { component, props, message } = renderField(fieldConfig, formData, handlers, dataProviders);
    
    switch (component) {
      case "Selector":
        return <Selector {...props} />;
      case "Select":
        return <Select {...props} />;
      case "Input":
        return <Input {...props} />;
      case "Loading":
        return <p>{message || "Cargando..."}</p>;
      case "Error":
        return <p>{message || "Error al cargar datos"}</p>;
      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <Title title="DATOS DEL COMPETIDOR" />

      <FormContent onSubmit={handleSubmit}>
        {inputFieldsCompetitor.map((group, idx) => (
          <FormGroup key={idx} label={group.groupLabel}>
            <div className={group.layout || ""}>
              {group.fields.map((field, fieldIdx) => (
                <div key={`${field.name || field.type}-${fieldIdx}`}>
                  {renderComponent(field)}
                </div>
              ))}
            </div>
          </FormGroup>
        ))}

        <div className="flex justify-between mt-6 border-t border-gray-300 pt-4">
            <Button 
              type="button" 
              onClick={onBack} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center mr-4"
            >
              <ArrowBack className="mr-2" />
              Volver
            </Button>
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center"
            >
              <SaveIcon className="mr-2" />
              Guardar los datos de inscripción
            </Button>
        </div>
      </FormContent>
    </FormContainer>
  );
};

export default CompetitorRegister;
