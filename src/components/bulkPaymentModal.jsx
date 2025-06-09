"use client"

import { useState } from "react"
import Modal from "./modal/modal"
import Button from "../common/button"
import FileUploader from "./fileUploader"
import ReceiptIcon from "@mui/icons-material/Receipt"
import PaymentIcon from "@mui/icons-material/Payment"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PersonIcon from "@mui/icons-material/Person"
import GroupIcon from "@mui/icons-material/Group"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"

const BulkPaymentModal = ({ isOpen, paymentData, onClose, onValidatePayment, onFileSelect }) => {
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [showCompetitorsDetails, setShowCompetitorsDetails] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isValidating, setIsValidating] = useState(false)

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
      setSelectedFile(file)
      onFileSelect(file)
    }
  }

  const handleValidatePayment = async () => {
    setIsValidating(true)
    try {
      await onValidatePayment()
    } finally {
      setIsValidating(false)
    }
  }

  if (!paymentData?.paymentOrder) return null

  const { paymentOrder, inscriptions, totalCompetitors } = paymentData

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎉 Boleta de Pago Generada - Carga Masiva"
      iconType="success"
      className="max-w-5xl max-h-[90vh]"
      showCloseButton={true}
      showButtons={false}
    >
      <div className="max-h-[80vh] overflow-y-auto space-y-6 pr-2">
        {/* Resumen de la carga masiva */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <GroupIcon className="text-green-600 mr-2" fontSize="large" />
            <div>
              <h3 className="text-xl font-bold text-green-800">Carga Masiva Completada</h3>
              <p className="text-green-600 text-sm">Se procesaron {totalCompetitors} competidores exitosamente</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Competidores Inscritos</span>
              <p className="text-green-600 font-bold text-2xl">{totalCompetitors}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Total Inscripciones</span>
              <p className="text-blue-600 font-bold text-2xl">{inscriptions?.length || 0}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Estado</span>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 bg-green-100 text-green-800">
                ✅ Completado
              </span>
            </div>
          </div>
        </div>

        {/* Información de la boleta de pago */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ReceiptIcon className="text-blue-600 mr-2" fontSize="large" />
            <div>
              <h3 className="text-xl font-bold text-blue-800">Boleta de Pago Consolidada</h3>
              <p className="text-blue-600 text-sm">Una sola boleta para todos los competidores del colegio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Código de Boleta</span>
              <p className="text-gray-900 font-mono text-lg font-bold">{paymentOrder.code}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Monto Total</span>
              <p className="text-green-600 font-bold text-2xl">{formatCurrency(paymentOrder.total)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Estado</span>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 bg-yellow-100 text-yellow-800">
                ⏳ Pendiente
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Fecha de Generación</span>
              <p className="text-gray-900">{formatDate(paymentOrder.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Lista de competidores inscritos */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowCompetitorsDetails(!showCompetitorsDetails)}
          >
            <div className="flex items-center">
              <PersonIcon className="text-purple-600 mr-2" fontSize="large" />
              <div>
                <h3 className="text-xl font-bold text-purple-800">Competidores Inscritos</h3>
                <p className="text-purple-600 text-sm">{inscriptions?.length || 0} inscripciones procesadas</p>
              </div>
            </div>
            {showCompetitorsDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </div>

          {showCompetitorsDetails && inscriptions && (
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
              {inscriptions.map((inscription, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-400">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Competidor</span>
                      <p className="text-gray-900 font-semibold">
                        {inscription.competitor.name} {inscription.competitor.last_name}
                      </p>
                      <p className="text-gray-600 text-sm">CI: {inscription.competitor.ci}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Curso</span>
                      <p className="text-gray-900">{inscription.competitor.curso}</p>
                      <p className="text-gray-600 text-sm">{inscription.competitor.colegio}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 text-sm">Áreas Inscritas</span>
                      <div className="space-y-1">
                        {inscription.areas.map((area, areaIndex) => (
                          <div key={areaIndex} className="text-sm">
                            <span className="text-gray-900">{area.area}</span>
                            <span className="text-green-600 font-semibold ml-2">{formatCurrency(area.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instrucciones de pago */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <PaymentIcon className="text-yellow-600 mr-2" fontSize="large" />
            <div>
              <h4 className="text-xl font-bold text-yellow-800">Instrucciones de Pago</h4>
              <p className="text-yellow-600 text-sm">Pago consolidado para todo el colegio</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </span>
                <span>
                  Realice el pago por el monto total de <strong>{formatCurrency(paymentOrder.total)}</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </span>
                <span>
                  Use el código de boleta:{" "}
                  <strong className="font-mono bg-gray-100 px-2 py-1 rounded">{paymentOrder.code}</strong>
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </span>
                <span>Este pago cubre las inscripciones de {totalCompetitors} competidores</span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </span>
                <span>Suba el comprobante para validación automática</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Sección de subida de comprobante */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
          {!showUploadSection ? (
            <div className="text-center">
              <CloudUploadIcon className="text-gray-400 mb-4" fontSize="large" />
              <h4 className="text-lg font-semibold text-gray-800 mb-2">¿Ya realizaste el pago?</h4>
              <p className="text-gray-600 mb-4">Sube tu comprobante para validar automáticamente</p>
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
                  <h4 className="text-lg font-bold text-green-800">Subir Comprobante</h4>
                  <p className="text-green-600 text-sm">Formatos aceptados: JPG, PNG, PDF</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">⚠️ Importante para el reconocimiento automático:</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • El comprobante debe contener el código: <strong className="font-mono">{paymentOrder.code}</strong>
                  </li>
                  <li>• La imagen debe ser clara y legible</li>
                  <li>• Este pago cubre {totalCompetitors} competidores</li>
                </ul>
              </div>

              <FileUploader
                name="paymentProof"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                label="Seleccionar Comprobante"
                className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors"
              />

              {selectedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircleIcon className="text-green-600 mr-2" />
                      <div>
                        <span className="text-sm font-medium text-green-800">Archivo seleccionado:</span>
                        <p className="text-green-700">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">
                          Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleValidatePayment}
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

      {/* Botones de acción fijos */}
      <div className="flex justify-between items-center pt-4 border-t bg-white">
        <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
          Cerrar
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">Código para el pago:</p>
          <p className="font-mono font-bold text-lg text-blue-600">{paymentOrder.code}</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-600">Total a pagar:</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentOrder.total)}</p>
        </div>
      </div>
    </Modal>
  )
}

export default BulkPaymentModal
