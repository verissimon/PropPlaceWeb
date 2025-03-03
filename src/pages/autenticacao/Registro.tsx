import { Campo } from '@/components/Campo';
import { CampoIcones } from '@/utils/Icones';
import { registroSchema, TFormRegistroSchema } from '@/utils/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

function Registro() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TFormRegistroSchema>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nome: '',
      username: '',
      telefone: '',
      email: '',
      senha: '',
      senhaRepetida: '',
    },
  });

  const enviar = async (data: TFormRegistroSchema) => {
    try {
      // simulação de envio para API
      console.log('Dados enviados:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Registro realizado com sucesso!');
      // redirecionar para index
      reset();
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao processar registro. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-paleta-fundo">
      <h2 className="text-paleta-secundaria text-2xl font-bold mb-6 text-center">
        Registre-se
      </h2>

      <form onSubmit={handleSubmit(enviar)} className="space-y-4">
        <Campo
          titulo="Nome completo"
          icone={CampoIcones.PESSOA}
          feedback={errors.nome}
          register={register('nome')}
        />
        <Campo
          titulo="Nome de usuário"
          icone={CampoIcones.PESSOA}
          feedback={errors.username}
          register={register('username')}
        />
        <Campo
          titulo="Telefone"
          icone={CampoIcones.TELEFONE}
          feedback={errors.telefone}
          register={register('telefone')}
          placeholder="(99) 99999-9999"
        />
        <Campo
          titulo="E-mail"
          type="email"
          icone={CampoIcones.EMAIL}
          feedback={errors.email}
          register={register('email')}
        />
        <Campo
          titulo="Senha"
          type="password"
          icone={CampoIcones.CADEADO}
          feedback={errors.senha}
          register={register('senha')}
        />
        <Campo
          titulo="Confirmar senha"
          type="password"
          icone={CampoIcones.CADEADO}
          feedback={errors.senhaRepetida}
          register={register('senhaRepetida')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded disabled:opacity-50"
        >
          {isSubmitting ? 'Processando...' : 'Criar Conta'}
        </button>
      </form>
    </div>
  );
}

export default Registro;
