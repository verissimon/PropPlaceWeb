import { Modal } from '@/components/Modal';
import { useNavigate } from 'react-router';

function NotFound() {
  const navegar = useNavigate();
  return (
    <Modal
      titulo="404 - Recurso não encontrado"
      subtitulo="Esta página não existe"
      visible
      onClose={() => navegar('/')}
    />
  );
}

export default NotFound;
