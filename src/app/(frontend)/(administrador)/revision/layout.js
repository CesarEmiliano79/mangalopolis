import LayoutAdmin from "../../../(backend)/components/LayoutAdmin";
import { AutenticacionAdmin} from "@/app/(backend)/lib/contextAdmin/AutenticacionAdmin";

export const metadata = {
  title: 'Mangalopolis',
  description: 'Listado de Reviews',
};

export default function Layout({ children }) {
    return (
        <div>
            <div>
                <AutenticacionAdmin>
                    <LayoutAdmin>{children}</LayoutAdmin>
                </AutenticacionAdmin>
            </div>
        </div>

    );
}