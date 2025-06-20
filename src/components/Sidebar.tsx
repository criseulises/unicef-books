// src/components/Sidebar.tsx
"use client";
import React from "react";

export interface SidebarProps {
  pages: { id: number; title?: string; text?: string }[];
  currentPage: number;
  onSelectPage: (idx: number) => void;
  onClose: () => void;
}

export default function Sidebar({
  pages,
  currentPage,
  onSelectPage,
  onClose,
}: SidebarProps) {
  return (
    <div className="fixed inset-0 z-40 flex pt-0">
      {/* Fondo semitransparente que cierra al pulsar */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      <aside className="relative ml-auto w-80 h-full bg-white shadow-2xl p-6 overflow-auto animate-in slide-in-from-right duration-300">
        
        {/* Espacio para los iconos del header */}
        <div className="h-16 mb-4"></div>
        
        {/* Título */}
        <h2 className="text-xl text-blue-600 mb-6">
          Contenidos
        </h2>

        {/* Lista de páginas */}
        <div className="space-y-3">
          {pages.map((page, index) => {
            const pageTitle = page.title || `Página ${index + 1}`;
            const isActive = currentPage === index;
            
            return (
              <button
                key={page.id}
                onClick={() => onSelectPage(index)}
                className={`
                  w-full text-left p-4 rounded-lg transition-colors duration-200 border-2
                  ${isActive 
                    ? "bg-blue-50 border-blue-600 text-blue-700" 
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {pageTitle}
                  </span>
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${isActive 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-300 text-gray-600"
                    }
                  `}>
                    {index + 1}
                  </div>
                </div>
                
                {/* Mostrar preview del texto si existe */}
                {page.text && (
                  <p className={`text-sm mt-2 line-clamp-2 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {page.text.length > 60 
                      ? page.text.substring(0, 60) + "..." 
                      : page.text
                    }
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Total de páginas:</span>
            <span className="font-semibold">{pages.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <span>Página actual:</span>
            <span className="font-semibold">{currentPage + 1}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}