
import { useState, useRef } from "react";
//import { Card, CardHeader, CardContent, CardFooter } from "@/components/cards";
import { Card, CardContent,CardDescription,CardFooter,CardHeader,CardTitle  } from "./cards";
import Input from "../common/input";
import Label from "../common/label";
import Textarea from "../common/textarea";
import Button from "../common/button";
import FormContainer from "../common/formContainer";
import FormContent from "../common/formContent";
import Modal from "./modal/modal";

const AnnouncementForm = ({
  onSubmit,
  isLoading,
  initialTitle = "",
  initialDescription = "",
  initialImage1 = null,
  initialImage2 = null,
  titleLabel = "Título del Anuncio",
  descriptionLabel = "Descripción",
  image1Label = "Imagen Principal",
  image2Label = "Imagen Secundaria (Opcional)",
  formTitle = "Crear Nuevo Anuncio",
  modalMessage,
  modalType,
  isModalOpen,
  closeModal,
  showModal,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [image1, setImage1] = useState(initialImage1);
  const [image2, setImage2] = useState(initialImage2);
  const [image1Preview, setImage1Preview] = useState(null);
  const [image2Preview, setImage2Preview] = useState(null);
  const [wordCount, setWordCount] = useState(
    initialDescription ? initialDescription.trim().split(/\s+/).length : 0
  );

  const image1Ref = useRef(null);
  const image2Ref = useRef(null);

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    const words = e.target.value.trim().split(/\s+/);
    setWordCount(e.target.value.trim() === "" ? 0 : words.length);
  };

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage1(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage1Preview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage2(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage2Preview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage1(null);
    setImage2(null);
    setImage1Preview(null);
    setImage2Preview(null);
    setWordCount(0);
    if (image1Ref.current) image1Ref.current.value = "";
    if (image2Ref.current) image2Ref.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showModal("Por favor, ingrese un título para el anuncio", "error");
      return;
    }
    if (!description.trim()) {
      showModal("Por favor, ingrese una descripción para el anuncio", "error");
      return;
    }
    await onSubmit({
      title,
      description,
      image1,
      image2,
      resetForm,
      showModal,
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-white">{formTitle}</h1>
        <FormContainer>
          <FormContent onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-xl font-medium text-[#0f2e5a]">Información del Anuncio</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">{titleLabel}</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Ingrese el título del anuncio"
                      value={title}
                      onChange={handleTitleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{descriptionLabel}</Label>
                    <Textarea
                      id="description"
                      placeholder="Ingrese la descripción del anuncio"
                      value={description}
                      onChange={handleDescriptionChange}
                      rows={5}
                      showWordCount={true}
                      wordCount={wordCount}
                      maxWords={500}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <h2 className="text-xl font-medium text-[#0f2e5a]">Imágenes del Anuncio</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="image1">{image1Label}</Label>
                    <Input
                      id="image1"
                      type="file"
                      accept="image/*"
                      onChange={handleImage1Change}
                      ref={image1Ref}
                      className="mb-2"
                    />
                    {image1Preview && (
                      <div className="mt-2 border rounded-md overflow-hidden">
                        <img
                          src={image1Preview}
                          alt="Vista previa de imagen 1"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image2">{image2Label}</Label>
                    <Input
                      id="image2"
                      type="file"
                      accept="image/*"
                      onChange={handleImage2Change}
                      ref={image2Ref}
                      className="mb-2"
                    />
                    {image2Preview && (
                      <div className="mt-2 border rounded-md overflow-hidden">
                        <img
                          src={image2Preview}
                          alt="Vista previa de imagen 2"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="px-6 py-2 bg-[#0f2e5a] text-white rounded-md hover:bg-[#0c2747] transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar Anuncio"}
                </Button>
              </CardFooter>
            </Card>
          </FormContent>
        </FormContainer>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalType === "success" ? "¡Éxito!" : modalType === "error" ? "Error" : "Información"}
        iconType={modalType}
        primaryButtonText="Aceptar"
        secondaryButtonText=""
        onPrimaryClick={closeModal}
      >
        <p className="text-gray-700">{modalMessage}</p>
      </Modal>
    </div>
  );
};

export default AnnouncementForm;