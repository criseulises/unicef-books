'use client'
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
    <div className="flex-1 flex items-center justify-center bg-background p-6 space-x-4">
      <button
        onClick={() => current > 0 && go(current - 1)}
        disabled={current === 0}
        className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border flex items-center justify-center transition ${
          current === 0
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary-50 hover:border-primary-200 hover:shadow-xl'
        }`}
      >
        <ChevronLeftIcon className={`w-6 h-6 ${current === 0 ? 'text-neutral-400' : 'text-primary-600'}`} />
      </button>

      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border-2 border-primary-600">
        <img
          src={pages[current].imageUrl}
          alt={`Página ${current + 1}`}
          className="w-full object-cover"
        />

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

      <button
        onClick={() => current < last && go(current + 1)}
        disabled={current === last}
        className={`flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border flex items-center justify-center transition ${
          current === last
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-primary-50 hover:border-primary-200 hover:shadow-xl'
        }`}
      >
        <ChevronRightIcon className={`w-6 h-6 ${current === last ? 'text-neutral-400' : 'text-primary-600'}`} />
      </button>
    </div>
  )
}