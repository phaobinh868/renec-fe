import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Share your movie',
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (<>{children}</>);
}