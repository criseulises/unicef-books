// src/components/Sidebar.tsx
"use client";
import React from "react";

export interface SidebarProps {
  pages: { id: number; title: string }[];
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
    <div className="fixed inset-x-0 inset-y-0 z-40 flex pt-[64px]">
      {/* Fondo semitransparente que cierra al pulsar */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      <aside className="relative ml-auto w-80 max-w-full h-full bg-white shadow-2xl p-4 overflow-auto animate-in slide-in-from-right duration-300">
        {/* --- TÍTULO --- */}
        <h2 className="text-xl font-bold mb-4">Contenidos</h2>

        {/* --- LISTA DE PÁGINAS --- */}
        <ul className="space-y-2">
          {pages.map((p, i) => (
            <li key={p.id}>
              <button
                onClick={() => onSelectPage(i)}
                className={`
                  w-full text-left py-2 px-3 rounded transition
                  ${
                    currentPage === i
                      ? "bg-primary-100 font-semibold text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}