import './globals.css'

export const metadata = {
  title: 'Cursor Health 4.0',
  description: 'Healthcare Assistant with Sales Funnel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
