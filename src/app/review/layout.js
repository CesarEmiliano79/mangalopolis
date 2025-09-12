
export const metadata = {
  title: 'Mangalopolis',
  description: 'Listado de Reviews',
};

export default function Layout({ children }) {
    return (
        <body>
            <div className="grid grid">
                <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold">
                        Mangalopolis
                    </h1>
                </header>
            </div>
            <div>
                <main>{children}</main>
            </div>
        </body>

    );
}