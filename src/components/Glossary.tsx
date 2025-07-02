// src/components/Glossary.tsx
'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Volume2Icon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import SignLanguageIcon from '@/icons/SignLanguage'

export interface GlossaryTerm {
  id: number
  word: string
  definition: string
  pictogram: string
  audioUrl: string
  videoUrl: string
}

export interface GlossaryData {
  title: string
  terms: GlossaryTerm[]
}

interface GlossaryProps {
  glossary: GlossaryData
  textSize?: number
  currentPage?: number
  totalPages?: number
  onChangePage?: (idx: number) => void
}

export default function Glossary({ 
  glossary, 
  textSize = 32,
  currentPage = 0,
  totalPages = 1,
  onChangePage
}: GlossaryProps) {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const [showingVideo, setShowingVideo] = useState<number | null>(null)
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({})

  const playAudio = (termId: number) => {
    // Parar cualquier audio que esté reproduciéndose
    Object.values(audioRefs.current).forEach(audio => {
      if (audio) {
        audio.pause()
        audio.currentTime = 0
      }
    })

    if (playingAudio === termId) {
      setPlayingAudio(null)
      return
    }

    const audio = audioRefs.current[termId]
    if (audio) {
      audio.currentTime = 0
      audio.play()
        .then(() => setPlayingAudio(termId))
        .catch(error => console.log('Error playing audio:', error))
    }
  }

  const handleAudioEnd = () => {
    setPlayingAudio(null)
  }

  const toggleVideo = (termId: number) => {
    if (showingVideo === termId) {
      setShowingVideo(null)
    } else {
      setShowingVideo(termId)
    }
  }

  // ✅ Funciones de navegación
  const goToPreviousPage = () => {
    if (onChangePage && currentPage > 0) {
      onChangePage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (onChangePage && currentPage < totalPages - 1) {
      onChangePage(currentPage + 1)
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center contrast-bg p-4 relative">
      {/* ✅ BOTÓN ANTERIOR */}
      <button
        onClick={goToPreviousPage}
        disabled={!onChangePage || currentPage === 0}
        className={`
          p-2 transition flex-shrink-0 z-10
          ${!onChangePage || currentPage === 0
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 contrast-primary hover:text-primary-700'}
        `}
      >
        <ChevronLeftIcon className="w-8 h-8 lg:w-10 lg:h-10 mx-2 lg:mx-4" />
      </button>

      {/* ✅ CONTENIDO DEL GLOSARIO */}
      <div className="flex-1 h-full mx-4 overflow-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Título del Glosario */}
          <div className="text-center mb-8">
            <h1 
              className="font-fredoka text-primary-700 contrast-primary mb-2"
              style={{ 
                fontSize: `${Math.max(textSize + 4, 28)}px`,
                color: 'var(--contrast-primary)'
              }}
            >
              {glossary.title}
            </h1>
            <div 
              className="w-24 h-1 mx-auto rounded"
              style={{ backgroundColor: 'var(--contrast-primary)' }}
            ></div>
          </div>

          {/* Tabla del Glosario */}
          <div className="bg-white contrast-card-bg rounded-xl shadow-lg overflow-hidden">
            {/* Header de la tabla */}
            <div 
              className="glossary-table-header"
              style={{ 
                backgroundColor: 'var(--contrast-header-bg)',
                backgroundImage: 'none'
              }}
            >
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold">
                <div 
                  className="col-span-2 text-center glossary-header-text"
                  style={{ color: 'var(--contrast-header-text)' }}
                >
                  Palabra
                </div>
                <div 
                  className="col-span-5 text-center glossary-header-text"
                  style={{ color: 'var(--contrast-header-text)' }}
                >
                  Definición
                </div>
                <div 
                  className="col-span-2 text-center glossary-header-text"
                  style={{ color: 'var(--contrast-header-text)' }}
                >
                  Pictograma
                </div>
                <div 
                  className="col-span-1 text-center glossary-header-text"
                  style={{ color: 'var(--contrast-header-text)' }}
                >
                  Audio
                </div>
                <div 
                  className="col-span-2 text-center glossary-header-text"
                  style={{ color: 'var(--contrast-header-text)' }}
                >
                  Video
                </div>
              </div>
            </div>

            {/* Filas de términos */}
            <div className="divide-y contrast-border" style={{ borderColor: 'var(--contrast-border)' }}>
              {glossary.terms.map((term, index) => (
                <div key={term.id} className="relative">
                  <div 
                    className={`glossary-row grid grid-cols-12 gap-4 p-4 transition-colors hover:contrast-hover`}
                    style={{
                      backgroundColor: index % 2 === 0 
                        ? 'var(--contrast-hover)' 
                        : 'var(--contrast-card-bg)'
                    }}
                  >
                    {/* Número y Palabra */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="font-bold glossary-number"
                          style={{ 
                            fontSize: `${Math.max(textSize - 4, 18)}px`,
                            color: 'var(--contrast-primary)'
                          }}
                        >
                          {index + 1}.
                        </span>
                        <span 
                          className="font-semibold glossary-word"
                          style={{ 
                            fontSize: `${Math.max(textSize - 4, 18)}px`,
                            color: 'var(--contrast-text)'
                          }}
                        >
                          {term.word}
                        </span>
                      </div>
                    </div>

                    {/* Definición */}
                    <div className="col-span-5 flex items-center">
                      <p 
                        className="glossary-definition leading-relaxed"
                        style={{ 
                          fontSize: `${Math.max(textSize - 8, 16)}px`,
                          color: 'var(--contrast-text)'
                        }}
                      >
                        {term.definition}
                      </p>
                    </div>

                    {/* Pictograma */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div 
                        className="relative w-16 h-16 rounded-lg overflow-hidden border"
                        style={{ 
                          backgroundColor: 'var(--contrast-hover)',
                          borderColor: 'var(--contrast-border)'
                        }}
                      >
                        <Image
                          src={term.pictogram}
                          alt={term.word}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>

                    {/* Audio */}
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => playAudio(term.id)}
                        className="p-2 rounded-full transition-colors"
                        style={{ 
                          backgroundColor: 'var(--contrast-hover)'
                        }}
                      >
                        {playingAudio === term.id ? (
                          <PauseIcon 
                            className="w-5 h-5" 
                            style={{ color: 'var(--contrast-primary)' }}
                          />
                        ) : (
                          <Volume2Icon 
                            className="w-5 h-5" 
                            style={{ color: 'var(--contrast-primary)' }}
                          />
                        )}
                      </button>
                      
                      {/* Audio element */}
                      <audio
                        ref={(el) => { audioRefs.current[term.id] = el }}
                        onEnded={handleAudioEnd}
                        preload="none"
                      >
                        <source src={term.audioUrl} type="audio/wav" />
                        <source src={term.audioUrl.replace('.wav', '.mp3')} type="audio/mp3" />
                      </audio>
                    </div>

                    {/* Video */}
                    <div className="col-span-2 flex items-center justify-center">
                      <button
                        onClick={() => toggleVideo(term.id)}
                        className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                      >
                        <SignLanguageIcon className="w-5 h-5 text-green-600" />
                      </button>
                    </div>
                  </div>

                  {/* Video expandido */}
                  {showingVideo === term.id && (
                    <div className="col-span-12 bg-gray-900 p-4">
                      <div className="flex justify-center">
                        <video
                          key={`glossary-video-${term.id}`}
                          controls
                          autoPlay
                          muted
                          className="max-w-md h-64 rounded-lg"
                          style={{
                            backgroundColor: 'transparent',
                            objectFit: 'contain',
                          }}
                        >
                          <source src={term.videoUrl} type="video/mp4" />
                          Tu navegador no soporta videos.
                        </video>
                      </div>
                      <div className="text-center mt-2">
                        <button
                          onClick={() => setShowingVideo(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        >
                          Cerrar Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer informativo */}
          <div className="mt-8 text-center">
            <p 
              className="glossary-footer"
              style={{ 
                fontSize: `${Math.max(textSize - 12, 14)}px`,
                color: 'var(--contrast-text)'
              }}
            >
              💡 Haz clic en los íconos para escuchar el audio o ver la lengua de señas
            </p>
          </div>
        </div>
      </div>

      {/* ✅ BOTÓN SIGUIENTE */}
      <button
        onClick={goToNextPage}
        disabled={!onChangePage || currentPage >= totalPages - 1}
        className={`
          p-2 transition flex-shrink-0 z-10
          ${!onChangePage || currentPage >= totalPages - 1
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 contrast-primary hover:text-primary-700'}
        `}
      >
        <ChevronRightIcon className="w-8 h-8 lg:w-10 lg:h-10 mx-2 lg:mx-4" />
      </button>
    </div>
  )
}