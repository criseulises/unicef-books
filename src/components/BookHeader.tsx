"use client";
import Link from "next/link"

import ArrowLeft from '@/icons/ArrowLeftIcon'
import ContentIcon from '@/icons/ContentIcon'
import AccessibilityIcon from '@/icons/AccessibilityIcon'
import FullScreenIcon from '@/icons/FullScreenIcon'

export default function BookHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between bg-background-50 px-6 pt-7">
      <Link
        href="/"
        className="group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-600 transition cursor-pointer"
        aria-label="Volver"
      >
        <ArrowLeft className="text-primary-700 group-hover:text-primary-50" />
      </Link>

      <h1 className="font-fredoka text-primary-700 text-3xl">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          className="group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-600 transition cursor-pointer"
          aria-label="Modo Lectura"
        >
          <ContentIcon className="text-primary-700 group-hover:text-primary-50" />
        </button>

        <button
          className="group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-600 transition cursor-pointer"
          aria-label="Accesibilidad"
        >
          <AccessibilityIcon className="text-primary-700 group-hover:text-primary-50" />
        </button>

        <button
          className="group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-600 transition cursor-pointer"
          aria-label="Pantalla Completa"
        >
          <FullScreenIcon className="text-primary-700 group-hover:text-primary-50" />
        </button>
      </div>
    </header>
  )
}
