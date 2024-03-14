import { Metadata } from 'next';
import SocketProvider from '@/_providers/SocketProvider';
import Header from '@/_components/header';
import GraphqlProvider from '@/_providers/GraphqlProvider';
import { SessionProvider } from '@/_providers/SessionProvider';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Funny Movies',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, viewport-fit=cover',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
        <link href="https://cdn.jsdelivr.net/npm/react-toastify@10.0.4/dist/ReactToastify.min.css" rel="stylesheet"></link>
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