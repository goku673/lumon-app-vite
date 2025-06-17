"use client"

import { useState } from "react"
import Modal from "./modal/modal"
import Button from "@mui/material/Button"
import FileUploader from "../common/fileUploader"
import Title from "../common/Title"
import AppText from "../common/appText" // Cambiado aquí
import ReceiptIcon from "@mui/icons-material/Receipt"
import PaymentIcon from "@mui/icons-material/Payment"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PersonIcon from "@mui/icons-material/Person"
import SchoolIcon from "@mui/icons-material/School"
import PhoneIcon from "@mui/icons-material/Phone"
import BadgeIcon from "@mui/icons-material/Badge"
import ScienceIcon from "@mui/icons-material/Science"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

const PaymentModal = ({
  isOpen,
  paymentOrder,
  competitor,
  inscription,
  onClose,
  onValidatePayment,
  onFileSelect,
  selectedFile,
  isValidating,
}) => {
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [showCompetitorDetails, setShowCompetitorDetails] = useState(true)
  const [showInscriptionDetails, setShowInscriptionDetails] = useState(true)
  const [showGuardianDetails, setShowGuardianDetails] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-BO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  if (!paymentOrder) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Boleta de Pago Generada"
      iconType="success"
      className="max-w-6xl max-h-[95vh]"
      showCloseButton={true}
      showButtons={false}
    >
      <div className="max-h-[85vh] overflow-y-auto space-y-8 pr-4">
        {/* Sección: Detalles de la Boleta */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
          <div className="flex items-center mb-4">
            <ReceiptIcon className="text-blue-600 mr-2" fontSize="large" />
            <div>
              <Title as="h3" className="text-lg text-blue-800 text-left">
                Detalles de la Boleta
              </Title>
              <AppText text="Información del pago generado" className="text-blue-600 text-xs text-left" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-xs block mb-2 text-left">Código de Boleta</span>
              <AppText text={paymentOrder.code} className="text-gray-900 font-mono text-lg font-bold text-left" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-xs block mb-2 text-left">Monto Total</span>
              <AppText text={formatCurrency(paymentOrder.total)} className="text-green-600 font-bold text-2xl text-left" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-xs block mb-2 text-left">Estado</span>
              <span
                className={`inline-block px-4 py-2 rounded-full text-xs font-medium mt-2 ${
                  paymentOrder.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : paymentOrder.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {paymentOrder.status === "pending"
                  ? "Pendiente"
                  : paymentOrder.status === "paid"
                    ? "✅ Pagado"
                    : "❌ Cancelado"}
              </span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-xs block mb-2 text-left">Fecha de Generación</span>
              <AppText text={formatDate(paymentOrder.created_at)} className="text-gray-900 text-base text-left" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-xs block mb-2 text-left">ID de Boleta</span>
              <AppText text={paymentOrder.id} className="text-gray-900 font-mono text-base text-left" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-xs block mb-2 text-left">Última Actualización</span>
              <AppText text={formatDate(paymentOrder.updated_at)} className="text-gray-900 text-base text-left" />
            </div>
          </div>
        </div>

       
        {competitor && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowCompetitorDetails(!showCompetitorDetails)}
            >
              <div className="flex items-center">
                <PersonIcon className="text-green-600 mr-2" fontSize="large" />
                <div>
                  <Title as="h3" className="text-lg text-green-800 text-left">
                    Información del Competidor
                  </Title>
                  <AppText text="Datos del estudiante inscrito" className="text-green-600 text-xs text-left" />
                </div>
              </div>
              {showCompetitorDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            {showCompetitorDetails && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <PersonIcon className="text-gray-500 mr-3" fontSize="medium" />
                    <span className="font-medium text-gray-700 text-sm">Nombre Completo</span>
                  </div>
                  <AppText
                    text={`${competitor.name} ${competitor.last_name}`}
                    className="text-gray-900 font-semibold text-base text-left"
                  />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <BadgeIcon className="text-gray-500 mr-3" fontSize="medium" />
                    <span className="font-medium text-gray-700 text-sm">Cédula de Identidad</span>
                  </div>
                  <AppText text={competitor.ci} className="text-gray-900 font-mono text-base text-left" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <PhoneIcon className="text-gray-500 mr-3" fontSize="medium" />
                    <span className="font-medium text-gray-700 text-sm">Teléfono</span>
                  </div>
                  <AppText text={competitor.phone} className="text-gray-900 text-base text-left" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <SchoolIcon className="text-gray-500 mr-3" fontSize="medium" />
                    <span className="font-medium text-gray-700 text-sm">Curso</span>
                  </div>
                  <AppText text={competitor.curso} className="text-gray-900 font-semibold text-base text-left" />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm col-span-1 md:col-span-2">
                  <div className="flex items-center mb-3">
                    <SchoolIcon className="text-gray-500 mr-3" fontSize="medium" />
                    <span className="font-medium text-gray-700 text-sm">Colegio</span>
                  </div>
                  <AppText text={competitor.colegio} className="text-gray-900 font-semibold text-base text-left" />
                </div>
              </div>
            )}
          </div>
        )}

        {competitor?.tutores && competitor.tutores.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowGuardianDetails(!showGuardianDetails)}
            >
              <div className="flex items-center">
                <PersonIcon className="text-purple-600 mr-2" fontSize="large" />
                <div>
                  <Title as="h3" className="text-lg text-purple-800 text-left">
                    Tutores/Responsables
                  </Title>
                  <AppText
                    text={`${competitor.tutores.length} tutor(es) registrado(s)`}
                    className="text-purple-600 text-xs text-left"
                  />
                </div>
              </div>
              {showGuardianDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            {showGuardianDetails && (
              <div className="mt-4 space-y-4">
                {competitor.tutores.map((tutor, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <Title as="h4" className="font-semibold text-purple-800 mb-3 text-base text-left">
                      Tutor {index + 1}
                    </Title>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <span className="font-medium text-gray-700 text-xs">Nombre</span>
                        <AppText text={`${tutor.name} ${tutor.last_name}`} className="text-gray-900 text-sm text-left" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 text-xs">CI</span>
                        <AppText text={tutor.ci} className="text-gray-900 font-mono text-sm text-left" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 text-xs">Teléfono</span>
                        <AppText text={tutor.phone} className="text-gray-900 text-sm text-left" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {inscription && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowInscriptionDetails(!showInscriptionDetails)}
            >
              <div className="flex items-center">
                <ScienceIcon className="text-orange-600 mr-2" fontSize="large" />
                <div>
                  <Title as="h3" className="text-lg text-orange-800 text-left">
                    Áreas de Inscripción
                  </Title>
                  <AppText
                    text={`${inscription.areas?.length || 0} área(s) seleccionada(s)`}
                    className="text-orange-600 text-xs text-left"
                  />
                </div>
              </div>
              {showInscriptionDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            {showInscriptionDetails && inscription.areas && (
              <div className="mt-4 space-y-3">
                {inscription.areas.map((area, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-400">
                    <div className="flex justify-between items-center">
                      <div>
                        <Title as="h4" className="font-semibold text-orange-800 text-base text-left">
                          {area.area}
                        </Title>
                        <AppText text="Área de competencia" className="text-gray-600 text-xs text-left" />
                      </div>
                      <div className="text-right">
                        <AppText
                          text={formatCurrency(Number.parseFloat(area.price))}
                          className="text-xl font-bold text-green-600 text-right"
                        />
                        <AppText text="Costo de inscripción" className="text-gray-500 text-xs text-right" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-green-300">
                  <div className="flex justify-between items-center">
                    <Title as="h4" className="text-lg text-green-800 text-left">
                      TOTAL A PAGAR
                    </Title>
                    <AppText
                      text={formatCurrency(paymentOrder.total)}
                      className="text-2xl font-bold text-green-600 text-right"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <PaymentIcon className="text-yellow-600 mr-2" fontSize="large" />
            <div>
              <Title as="h4" className="text-lg text-yellow-800 text-left">
                Instrucciones de Pago
              </Title>
              <AppText text="Sigue estos pasos para completar tu pago" className="text-yellow-600 text-xs text-left" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <ol className="text-xs text-gray-700 space-y-2">
              {[
                `Realice el pago por el monto total de <strong>${formatCurrency(paymentOrder.total)}</strong>`,
                `Use el código de boleta: <strong class="font-mono bg-gray-100 px-2 py-1 rounded">${paymentOrder.code}</strong>`,
                "Conserve el comprobante de pago original",
                "Suba una foto clara del comprobante para validación automática",
                "El sistema validará automáticamente su pago mediante OCR",
              ].map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-left" dangerouslySetInnerHTML={{ __html: instruction }} />
                </li>
              ))}
            </ol>
          </div>
        </div>

        
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
          {!showUploadSection ? (
            <div className="text-center">
              <CloudUploadIcon className="text-gray-400 mb-4" style={{ fontSize: 60 }} />
              <Title as="h4" className="text-base text-gray-800 mb-2">
                ¿Ya realizaste el pago?
              </Title>
              <AppText text="Sube tu comprobante para validar automáticamente" className="text-gray-600 mb-4" />
              <Button
                onClick={() => setShowUploadSection(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-md font-medium flex items-center mx-auto"
              >
                <CloudUploadIcon className="mr-2" />
                Subir Comprobante de Pago
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <CloudUploadIcon className="text-green-600 mr-2" fontSize="large" />
                <div>
                  <Title as="h4" className="text-base text-green-800 text-left">
                    Subir Comprobante
                  </Title>
                  <AppText text="Formatos aceptados: JPG, PNG, PDF" className="text-green-600 text-xs text-left" />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Title as="h5" className="text-sm text-blue-800 mb-2 text-left">
                  ⚠️ Importante para el reconocimiento automático:
                </Title>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside text-left">
                  <li>
                    El comprobante debe contener el código: <strong className="font-mono">{paymentOrder.code}</strong>
                  </li>
                  <li>La imagen debe ser clara y legible</li>
                  <li>Asegúrate de que no esté rotada o borrosa</li>
                  <li>El sistema buscará automáticamente los datos del pago</li>
                </ul>
              </div>
              <FileUploader
                name="paymentProof"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400"
              />
              {selectedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircleIcon className="text-green-600 mr-2" />
                      <div>
                        <span className="text-xs font-medium text-green-800">Archivo seleccionado:</span>
                        <AppText text={selectedFile.name} className="text-green-700 text-xs text-left" />
                        <AppText
                          text={`Tamaño: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                          className="text-[10px] text-green-600 text-left"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={onValidatePayment}
                      disabled={isValidating}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
                    >
                      {isValidating ? "🔍 Validando..." : "✅ Validar Pago"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default PaymentModal

