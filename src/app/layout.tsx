import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/_css/globals.css'
import '@/_css/theme.css'
import { Metadata } from 'next';
import SocketProvider from '@/_providers/SocketProvider';
import Header from '@/_components/header';
import GraphqlProvider from '@/_providers/GraphqlProvider';
import { SessionProvider } from '@/_providers/SessionProvider';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Funny Movies',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body>
        <GraphqlProvider>
          <SessionProvider>
            <SocketProvider>
              <ToastContainer />
              <Header />
              <div className="container pt-4">
                {children}
              </div>
            </SocketProvider>
          </SessionProvider>
        </GraphqlProvider>
      </body>
    </html>
  )
}