import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Registry your account',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (<>{children}</>);
}