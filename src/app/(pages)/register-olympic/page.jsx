import RegisterOlympic from '../../../components/registerOlympic';
import AuthGuard from '../../../components/AuthGuard';

const RegisterOlympicPage = () => {
  return (
    <AuthGuard>
      <RegisterOlympic />
    </AuthGuard>
  );
};

export default RegisterOlympicPage;

