import LayoutAdmin from "../../../(backend)/components/LayoutAdmin";

export const metadata = {
  title: 'Mangalopolis',
  description: 'Listado de Reviews',
};

export default function Layout({ children }) {
    return (
        <div>
            <div>
                <LayoutAdmin>{children}</LayoutAdmin>
            </div>
        </div>

    );
}