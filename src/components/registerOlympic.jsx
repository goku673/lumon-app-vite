import { useState, useEffect } from 'react';
import { usePostIncriptionOlympicsMutation } from '../app/redux/services/olympicsApi';
import FormContainer from '../common/formContainer';
import FormContent from '../common/formContent';
import FormGroup from './formGroup';
import Modal from './modal/modal';
import Text from '../common/text';
import Input from '../common/input';
import Button from '../common/button';
import Textarea from '../common/textarea';
import ButtonSE from '../common/ButtonSE';
import Title from '../common/title';
import Badge from '../common/badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const MAX_WORDS = 20;

const RegisterOlympic = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date_ini: '',
    date_fin: '',
    status: 'inactive',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('success');
  const [modalMessage, setModalMessage] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const [postIncriptionOlympics, { isLoading }] = usePostIncriptionOlympicsMutation();

  useEffect(() => {
    const words = formData.description.trim() ? formData.description.trim().split(/\s+/) : [];
    setWordCount(words.length);
  }, [formData.description]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e) => {
    const newText = e.target.value;
    const words = newText.trim() ? newText.trim().split(/\s+/) : [];

    if (words.length <= MAX_WORDS) {
      setFormData(prev => ({ ...prev, description: newText }));
    }
  };

  const handleStatusChange = (newStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const currentWords = formData.description.trim().split(/\s+/).filter(Boolean).length;
    if (currentWords > MAX_WORDS) {
      setModalType('error');
      setModalMessage(`El límite máximo es de ${MAX_WORDS} palabras`);
      setIsModalOpen(true);
      return;
    }

    if (new Date(formData.date_fin) < new Date(formData.date_ini)) {
      setModalType('error');
      setModalMessage('La fecha de finalización no puede ser anterior a la de inicio');
      setIsModalOpen(true);
      return;
    }

    try {
      await postIncriptionOlympics(formData).unwrap();
      setModalType('success');
      setModalMessage('¡Registro exitoso! La olimpiada ha sido creada correctamente.');
      setIsModalOpen(true);
      setFormData({ name: '', description: '', date_ini: '', date_fin: '', status: 'inactive' });
      setWordCount(0);
    } catch (error) {
      console.error('Error al registrar:', error);
      setModalType('error');
      setModalMessage(error.message || 'Error al registrar. Por favor verifica los datos e intenta nuevamente.');
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <FormContainer className='max-w-2xl mx-auto rounded-xl shadow-md p-6 border border-gray-100'>
      <div className='flex items-center justify-center mb-8 bg-blue-50 py-4 rounded-lg'>
        <EmojiEventsIcon className='text-[#0f2e5a] mr-2' fontSize='large' />
        <Title title='Registro de Olimpiada' className='text-[#0f2e5a]' />
      </div>

      <FormContent onSubmit={handleSubmit} className='space-y-6'>
        <FormGroup label='Nombre de la Olimpiada'>
          <Input
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className='focus:ring-blue-500'
            placeholder='Ingrese el nombre de la olimpiada'
          />
        </FormGroup>

        <FormGroup label='Descripción'>
          <Textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleDescriptionChange}
            rows={4}
            placeholder='Describe los detalles de la olimpiada...'
            wordCount={wordCount}
            maxWords={MAX_WORDS}
            showWordCount={true}
            showIcon={true}
            required
          />
        </FormGroup>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormGroup label='Fecha de inicio'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500'>
                <CalendarTodayIcon fontSize='small' />
              </div>
              <Input
                id='date_ini'
                name='date_ini'
                type='date'
                value={formData.date_ini}
                onChange={handleChange}
                required
                className='pl-10 focus:ring-blue-500'
              />
            </div>
          </FormGroup>

          <FormGroup label='Fecha de finalización'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500'>
                <CalendarTodayIcon fontSize='small' />
              </div>
              <Input
                id='date_fin'
                name='date_fin'
                type='date'
                value={formData.date_fin}
                onChange={handleChange}
                required
                className='pl-10 focus:ring-blue-500'
              />
            </div>
          </FormGroup>
        </div>

        <FormGroup label='Estado'>
          <div className='flex gap-4 mt-2'>
            <ButtonSE
              type='button'
              variant={formData.status === 'active' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('active')}
              className={`px-6 py-2.5 ${
                formData.status === 'active'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : ''
              }`}
            >
              {formData.status === 'active' && <CheckCircleIcon fontSize='small' className='mr-2' />}
              Activo
            </ButtonSE>

            <ButtonSE
              type='button'
              variant={formData.status === 'inactive' ? 'destructive' : 'outline'}
              onClick={() => handleStatusChange('inactive')}
            >
              {formData.status === 'inactive' && <CancelIcon fontSize='small' className='mr-2' />}
              Inactivo
            </ButtonSE>
          </div>
          <div className='mt-3'>
            <Badge variant={formData.status === 'active' ? 'default' : 'destructive'} className='mt-2'>
              {formData.status === 'active' ? 'Estado: Activo' : 'Estado: Inactivo'}
            </Badge>
          </div>
        </FormGroup>

        <div className='flex justify-end pt-4 border-t'>
          <ButtonSE
            type='submit'
            disabled={isLoading}
            variant='default'
            className='bg-[#0f2e5a] hover:bg-[#0c2747] text-white px-8 py-3 rounded-md transition-colors font-medium flex items-center justify-center min-w-[180px]'
          >
            {isLoading ? (
              <>
                <AutorenewIcon fontSize='small' className='animate-spin mr-2' />
                Registrando...
              </>
            ) : (
              <>
                Registrar Olimpiada
                <ArrowForwardIcon fontSize='small' className='ml-2' />
              </>
            )}
          </ButtonSE>
        </div>
      </FormContent>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalType === 'success' ? 'Éxito' : 'Error'}
        iconType={modalType}
        primaryButtonText='Aceptar'
        onPrimaryClick={handleCloseModal}
      >
        <p className='text-gray-700'>{modalMessage}</p>
      </Modal>
    </FormContainer>
  );
};

export default RegisterOlympic;