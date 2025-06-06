import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/button";
import Input from "../common/input";
import Label from "../common/label";
import FormContainer from "../common/formContainer";
import FormContent from "../common/formContent";
import Title from "../common/title";
import Text from "../common/text";
import { Email, Lock } from "@mui/icons-material";
import { useLoginMutation } from "../app/redux/services/authApi";
import Modal from "./modal/modal";

const LoginPage = () => {
  const navigate = useNavigate();
  const [login] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await login(formData).unwrap();
      if (response) {
        localStorage.setItem("token", response?.token);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.data?.message || "Error al iniciar sesión");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/", { replace: true });
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <FormContainer className="p-5">
          <Title title="Iniciar Sesión" className="mb-6" />
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <FormContent onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Email className="text-gray-400" />
                </div>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" />
                </div>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Tu contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-[#0f2e5a] hover:bg-[#16488d] text-white py-2 rounded-md"
            >
              Iniciar Sesión
            </Button>
          </FormContent>
          
          <div className="mt-4 text-center">
            <Text 
              text="¿No tienes una cuenta?" 
              className="inline mr-2"
            />
            <a 
              href="/auth/signUp" 
              className="text-[#0f2e5a] hover:text-[#16488d]"
            >
              Regístrate aquí
            </a>
          </div>
        </FormContainer>
      </div>
      <Modal
       isOpen={showSuccessModal}
       onClose={handleCloseModal}
       title="¡Inicio de sesión exitoso!"
       iconType="success"
       primaryButtonText="Aceptar"
       onPrimaryClick={handleCloseModal}
      >
         <div className="text-center">
          <p>Has iniciado sesión correctamente.</p>
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;