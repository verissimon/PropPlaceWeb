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
      reset();
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao processar registro. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>

      <form onSubmit={handleSubmit(enviar)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            {...register('nome')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Nome de Usuário
          </label>
          <input
            type="text"
            {...register('username')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <input
            type="tel"
            placeholder="(99) 99999-9999"
            {...register('telefone')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.telefone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.telefone.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            {...register('senha')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.senha && (
            <p className="mt-1 text-sm text-red-600">{errors.senha.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Confirmar Senha
          </label>
          <input
            type="password"
            {...register('senhaRepetida')}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.senhaRepetida && (
            <p className="mt-1 text-sm text-red-600">
              {errors.senhaRepetida.message}
            </p>
          )}
        </div>

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
