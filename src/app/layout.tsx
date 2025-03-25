import type { Metadata } from 'next'
import './globals.css'
import { ClerkProvider } from "@clerk/nextjs"
import '@fontsource/poppins'; // Ya importaste correctamente Poppins
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: 'PropectTrack',
  description: 'Prospection tracking system',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
        <html lang="en">
          <body className="font-poppins"> {/* Aquí usas la clase de Poppins */}
            {children}
            <ToastContainer  position="bottom-right" theme="dark" />
          </body>
        </html>
    </ClerkProvider>
  )
}