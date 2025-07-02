// src/components/Sidebar.tsx
'use client'
import React from 'react'
import { XIcon, BookOpenIcon, FileTextIcon } from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  pages: Array<{
    id: number
    title?: string
    imageUrl: string
    text: string
  }>
  currentPage: number
  onSelectPage: (pageIndex: number) => void
  onGoToGlossary: () => void // ✅ Nueva función para ir al glosario
  isInGlossary: boolean // ✅ Nueva prop para saber si estamos en glosario
  onClose: () => void
}

export default function Sidebar({
  pages,
  currentPage,
  onSelectPage,
  onGoToGlossary,
  isInGlossary,
  onClose,
}: SidebarProps) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="relative w-80 bg-white shadow-xl h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Contenidos</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary-700 rounded-full transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de páginas */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Páginas del libro
          </h3>
          
          <div className="space-y-2 mb-6">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => onSelectPage(index)}
                className={`
                  w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
                  ${currentPage === index && !isInGlossary
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'}
                `}
              >
                <div className="flex items-center space-x-3">
                  {/* Miniatura de la página */}
                  <div className="relative w-12 h-8 bg-gray-200 rounded border overflow-hidden flex-shrink-0">
                    <Image
                      src={page.imageUrl}
                      alt={`Página ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  
                  {/* Información de la página */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-primary-600">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-600">
                        {page.title || `Página ${index + 1}`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {page.text.split('\n')[0].substring(0, 40)}
                      {page.text.length > 40 ? '...' : ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ✅ NUEVA SECCIÓN: Glosario */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Recursos adicionales
            </h3>
            
            <button
              onClick={onGoToGlossary}
              className={`
                w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${isInGlossary
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'}
              `}
            >
              <div className="flex items-center space-x-3">
                {/* Icono del glosario */}
                <div className="w-12 h-8 bg-green-100 rounded border flex items-center justify-center flex-shrink-0">
                  <FileTextIcon className="w-5 h-5 text-green-600" />
                </div>
                
                {/* Información del glosario */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-green-600">
                      📚
                    </span>
                    <span className="text-sm text-gray-600">
                      Glosario
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    Definiciones y lengua de señas
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Información del libro */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              📖 <strong>{pages.length}</strong> páginas + glosario
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}