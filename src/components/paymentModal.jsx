import { useState } from "react"
import Modal from "./modal/modal"
import Button from "../common/button"
import FileUploader from "./fileUploader"
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
      className="max-w-4xl max-h-[90vh]"
      showCloseButton={true}
      showButtons={false}
    >
      <div className="max-h-[80vh] overflow-y-auto space-y-6 pr-2">
        {/* Información principal de la boleta */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ReceiptIcon className="text-blue-600 mr-2" fontSize="large" />
            <div>
              <h3 className="text-xl font-bold text-blue-800">Detalles de la Boleta</h3>
              <p className="text-blue-600 text-sm">Información del pago generado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  paymentOrder.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : paymentOrder.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {paymentOrder.status === "pending"
                  ? "⏳ Pendiente"
                  : paymentOrder.status === "paid"
                    ? "✅ Pagado"
                    : "❌ Cancelado"}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Fecha de Generación</span>
              <p className="text-gray-900">{formatDate(paymentOrder.created_at)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">ID de Boleta</span>
              <p className="text-gray-900 font-mono">{paymentOrder.id}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <span className="font-medium text-gray-700 text-sm">Última Actualización</span>
              <p className="text-gray-900">{formatDate(paymentOrder.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Información del competidor */}
        {competitor && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowCompetitorDetails(!showCompetitorDetails)}
            >
              <div className="flex items-center">
                <PersonIcon className="text-green-600 mr-2" fontSize="large" />
                <div>
                  <h3 className="text-xl font-bold text-green-800">Información del Competidor</h3>
                  <p className="text-green-600 text-sm">Datos del estudiante inscrito</p>
                </div>
              </div>
              {showCompetitorDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>

            {showCompetitorDetails && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <PersonIcon className="text-gray-500 mr-2" fontSize="small" />
                    <span className="font-medium text-gray-700 text-sm">Nombre Completo</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {competitor.name} {competitor.last_name}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <BadgeIcon className="text-gray-500 mr-2" fontSize="small" />
                    <span className="font-medium text-gray-700 text-sm">Cédula de Identidad</span>
                  </div>
                  <p className="text-gray-900 font-mono">{competitor.ci}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <PhoneIcon className="text-gray-500 mr-2" fontSize="small" />
                    <span className="font-medium text-gray-700 text-sm">Teléfono</span>
                  </div>
                  <p className="text-gray-900">{competitor.phone}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <SchoolIcon className="text-gray-500 mr-2" fontSize="small" />
                    <span className="font-medium text-gray-700 text-sm">Curso</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{competitor.curso}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <SchoolIcon className="text-gray-500 mr-2" fontSize="small" />
                    <span className="font-medium text-gray-700 text-sm">Colegio</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{competitor.colegio}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Información de tutores */}
        {competitor?.tutores && competitor.tutores.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowGuardianDetails(!showGuardianDetails)}
            >
              <div className="flex items-center">
                <PersonIcon className="text-purple-600 mr-2" fontSize="large" />
                <div>
                  <h3 className="text-xl font-bold text-purple-800">Tutores/Responsables</h3>
                  <p className="text-purple-600 text-sm">{competitor.tutores.length} tutor(es) registrado(s)</p>
                </div>
              </div>
              {showGuardianDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>

            {showGuardianDetails && (
              <div className="mt-4 space-y-4">
                {competitor.tutores.map((tutor, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                    <h4 className="font-semibold text-purple-800 mb-3">Tutor {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <span className="font-medium text-gray-700 text-sm">Nombre</span>
                        <p className="text-gray-900">
                          {tutor.name} {tutor.last_name}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 text-sm">CI</span>
                        <p className="text-gray-900 font-mono">{tutor.ci}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 text-sm">Teléfono</span>
                        <p className="text-gray-900">{tutor.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Información de inscripción */}
        {inscription && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-6">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowInscriptionDetails(!showInscriptionDetails)}
            >
              <div className="flex items-center">
                <ScienceIcon className="text-orange-600 mr-2" fontSize="large" />
                <div>
                  <h3 className="text-xl font-bold text-orange-800">Áreas de Inscripción</h3>
                  <p className="text-orange-600 text-sm">{inscription.areas?.length || 0} área(s) seleccionada(s)</p>
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
                        <h4 className="font-semibold text-orange-800 text-lg">{area.area}</h4>
                        <p className="text-gray-600 text-sm">Área de competencia</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(Number.parseFloat(area.price))}
                        </p>
                        <p className="text-gray-500 text-sm">Costo de inscripción</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg border-2 border-green-300">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-bold text-green-800">TOTAL A PAGAR</h4>
                    <p className="text-3xl font-bold text-green-600">{formatCurrency(paymentOrder.total)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instrucciones de pago */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <PaymentIcon className="text-yellow-600 mr-2" fontSize="large" />
            <div>
              <h4 className="text-xl font-bold text-yellow-800">Instrucciones de Pago</h4>
              <p className="text-yellow-600 text-sm">Sigue estos pasos para completar tu pago</p>
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
                <span>Conserve el comprobante de pago original</span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  4
                </span>
                <span>Suba una foto clara del comprobante para validación automática</span>
              </li>
              <li className="flex items-start">
                <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  5
                </span>
                <span>El sistema validará automáticamente su pago mediante OCR</span>
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
                  <li>• Asegúrate de que no esté rotada o borrosa</li>
                  <li>• El sistema buscará automáticamente los datos del pago</li>
                </ul>
              </div>

              <FileUploader
                name="paymentProof"
                onChange={handleFileChange}
                accept="image/*,.pdf"
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

export default PaymentModal
