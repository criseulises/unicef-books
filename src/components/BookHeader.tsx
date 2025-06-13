'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function BookHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between bg-white py-4 px-6 md:px-8  ">
      {/* ← Botón “volver” */}
      <Link
        href="/"
        className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
        aria-label="Volver"
      >
        <Image src="/icons/arrow-left.svg" alt="Icono Volver" width={40} height={40} />
      </Link>

      {/* Título centrado */}
      <h1 className="font-extrabold text-primary-700 text-bran text-4xl">
        {title}

      </h1>

      {/* Íconos de la derecha como botones */}
      <div className="flex items-center gap-4">
        {/* Modo lectura */}
        <button
          className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
          aria-label="Modo Lectura"
          // onClick={() => setOpen('read')}  // futuro side-menu
        >
          <Image src="/icons/content.svg" alt="Icono Lectura" width={24} height={24} />
        </button>

        {/* Accesibilidad */}
        <button
          className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
          aria-label="Accesibilidad"
          // onClick={() => setOpen('accessibility')}
        >
          <Image src="/icons/accessibility.svg" alt="Icono Accesibilidad" width={24} height={24} />
        </button>

        {/* Pantalla completa */}
        <button
          className="w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
          aria-label="Pantalla Completa"
          // onClick={() => setOpen('fullscreen')}
        >
          <Image src="/icons/full-screen.svg" alt="Icono Pantalla Completa" width={24} height={24} />
        </button>
      </div>
    </header>
  )
}