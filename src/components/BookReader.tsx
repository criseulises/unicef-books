"use client"
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

export interface BookPage {
  id: number
  imageUrl: string
  text: string
  textPosition?: Partial<Record<'top'|'left'|'right'|'bottom', string>>
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
        <ChevronLeftIcon className="w-10 h-10 mx-5" />
      </button>

      {/* Contenedor del libro */}
      <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border-2 border-primary-600">
        <img
          src={pages[current].imageUrl}
          alt={`Página ${current + 1}`}
          className="w-full object-cover"
        />
        {/* Texto sobre la imagen */}
        <div
          className="absolute text-white font-bold drop-shadow-lg"
          style={{
            top: pages[current].textPosition?.top ?? '10%',
            left: pages[current].textPosition?.left ?? '5%',
            right: pages[current].textPosition?.right ?? '5%',
            bottom: pages[current].textPosition?.bottom ?? 'auto',
          }}
        >
          <div className="bg-secondary-600 bg-opacity-50 rounded-lg p-4 backdrop-blur-sm">
            {pages[current].text.split('\n').map((l, i) => (
              <p key={i}>{l}</p>
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
        <ChevronRightIcon className="w-10 h-10 mx-5" />
      </button>
    </div>
  )
}