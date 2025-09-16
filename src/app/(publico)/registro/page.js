import LoginForm from "@/app/components/formularioReg";
export default function Page() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Iniciar Sesión</h1>
        <LoginForm/>
      </div>
    </div>
  );
}
