import { AutenticacionUsuario } from "../../../(backend)/lib/context/Autenticacion";
import LayoutPrincipal from "../../../(backend)/components/LayoutPrincipal";

export const metadata = {
  title: 'Mangalopolis',
  description: 'Listado de Reviews',
};

export default function Layout({ children }) {
    return (
        <div>
            <div>
                <AutenticacionUsuario>
                    <LayoutPrincipal>{children}</LayoutPrincipal>
                </AutenticacionUsuario>
            </div>
        </div>

    );
}