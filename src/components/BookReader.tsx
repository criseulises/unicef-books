"use client"
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'

export interface BookPage {
  id: number
  imageUrl: string
  text: string
  textPosition?: Partial<Record<'top'|'left'|'right'|'bottom', string>>
  textBgColor?: string  // color de fondo del texto que proviene de la página
}

export default function BookReader({
  pages,
  onChangePage,
}: {
  pages: BookPage[]
  onChangePage: (idx: number) => void
}) {
  const [current, setCurrent] = useState(0)
  const last = pages.length - 1

  const go = (idx: number) => {
    setCurrent(idx)
    onChangePage(idx)
  }

  const page = pages[current]
  const bgColor = page.textBgColor || 'rgba(0,0,0,0.5)'

  return (
    <div className="flex-1 flex items-center justify-center bg-background p-8">
      {/* Flecha anterior sin círculo */}
      <button
        onClick={() => current > 0 && go(current - 1)}
        disabled={current === 0}
        className={`p-2 transition ${
          current === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'text-primary-600 hover:text-primary-700'
        }`}
      >
        <ChevronLeftIcon className="w-12 h-12 mx-5" />
      </button>

      {/* Contenedor del libro */}
      <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden  border-4 border-[#647411]">
        <Image
          src={page.imageUrl}
          alt={`Página ${current + 1}`}
          width={1500} // ajusta según tu imagen
          height={754} // ajusta según tu imagen
          className="w-full object-cover"
          priority={true}
        />

        {/* Texto sobre la imagen */}
        <div
          className="absolute"
          style={{
            top: page.textPosition?.top ?? '10%',
            left: page.textPosition?.left ?? '5%',
            right: page.textPosition?.right ?? '5%',
            bottom: page.textPosition?.bottom ?? 'auto',
          }}
        >
          <div className="space-y-3">
            {page.text.split('\n').map((line, i) => (
              <div key={i}>
                <span
                  className="font-quicksand text-white font-semibold text-lg md:text-xl px-2 py-2"
                  style={{ 
                    backgroundColor: bgColor,
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone'
                  }}
                >
                  {line}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flecha siguiente sin círculo */}
      <button
        onClick={() => current < last && go(current + 1)}
        disabled={current === last}
        className={`p-2 transition ${
          current === last
            ? 'opacity-50 cursor-not-allowed'
            : 'text-primary-600 hover:text-primary-700'
        }`}
      >
        <ChevronRightIcon className="w-12 h-12 mx-5" />
      </button>
    </div>
  )
}