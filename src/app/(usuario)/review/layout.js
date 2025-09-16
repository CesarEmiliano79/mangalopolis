import { AutenticacionUsuario } from "../../../lib/context/Autenticacion";
import LayoutPrincipal from "../../components/LayoutPrincipal";

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