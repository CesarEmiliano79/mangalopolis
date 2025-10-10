import './globals.css';

export const metadata = {
  title: 'Mangalopolis',
  description: 'Pagina de Inicio',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <div>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}