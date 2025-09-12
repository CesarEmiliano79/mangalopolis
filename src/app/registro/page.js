import LoginForm from '../components/formularioReg'; // este puede ser tu formulario de login

export default function Page() {

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
      <LoginForm/>
    </div>
  );
}
