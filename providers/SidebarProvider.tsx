"use client"

import { createContext, useContext, useState, ReactNode } from "react"

// 1. Definir el tipo para el contexto
interface SidebarContextType {
  openSidebar: boolean
  setOpenSidebar: (open: boolean) => void
}

// 2. Crear el contexto con un valor inicial por defecto
const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

// 3. Crear el Provider
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <SidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

// 4. Hook personalizado para usar el contexto fácilmente
export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar debe usarse dentro de un SidebarProvider")
  }
  return context
}
