// src/hooks/useContrast.ts
import { useEffect } from 'react'

export const CONTRAST_OPTIONS = [
  { 
    label: "Aa", 
    bg: "bg-white", 
    text: "text-blue-600", 
    border: "border-blue-600",
    name: "Normal",
    description: "Colores estándar"
  },
  { 
    label: "Aa", 
    bg: "bg-yellow-500", 
    text: "text-black",
    name: "Alto Contraste Amarillo",
    description: "Fondo amarillo con texto negro"
  },
  { 
    label: "Aa", 
    bg: "bg-black", 
    text: "text-white",
    name: "Alto Contraste Negro",
    description: "Fondo negro con texto blanco"
  },
  { 
    label: "Aa", 
    bg: "bg-gray-500", 
    text: "text-white",
    name: "Contraste Gris",
    description: "Fondo gris con texto blanco"
  },
  { 
    label: "Aa", 
    bg: "bg-green-400", 
    text: "text-white",
    name: "Contraste Verde",
    description: "Fondo verde con texto blanco"
  },
]

/**
 * Hook para manejar el sistema de contraste
 * @param contrastLevel - Nivel de contraste (0-4)
 */
export function useContrast(contrastLevel: number) {
  useEffect(() => {
    // Validar que el nivel esté en el rango correcto
    const validLevel = Math.max(0, Math.min(4, contrastLevel))
    
    // Aplicar el atributo data-contrast al documento
    if (validLevel === 0) {
      document.documentElement.removeAttribute('data-contrast')
    } else {
      document.documentElement.setAttribute('data-contrast', validLevel.toString())
    }
    
    // Log para debugging
    console.log(`Contraste aplicado: ${CONTRAST_OPTIONS[validLevel].name}`)
  }, [contrastLevel])
  
  return {
    currentTheme: CONTRAST_OPTIONS[contrastLevel] || CONTRAST_OPTIONS[0],
    availableThemes: CONTRAST_OPTIONS
  }
}