import { useState } from "react";
import { useCreateAnnouncementMutation } from "../../redux/services/anuncementsApi";
import AnnouncementForm from "../../../components/announcementForm";
import AuthGuard from "../../../components/AuthGuard";

const AnnouncementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("info");
  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const showModal = (message, type = "info") => {
    setModalMessage(message);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async ({ title, description, image1, image2, resetForm, showModal }) => {
    try {
      const formData = { title, description, image1: image1 || undefined, image2: image2 || undefined };
      await createAnnouncement(formData).unwrap();
      showModal("¡Anuncio creado exitosamente!", "success");
      resetForm();
    } catch (error) {
      showModal(
        error.data?.message || "Ocurrió un error al crear el anuncio. Por favor, inténtelo de nuevo.",
        "error"
      );
    }
  };

  return (
    <AuthGuard>
      <AnnouncementForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isModalOpen={isModalOpen}
        modalMessage={modalMessage}
        modalType={modalType}
        closeModal={closeModal}
        showModal={showModal}
      />
    </AuthGuard>
  );
};

export default AnnouncementPage;