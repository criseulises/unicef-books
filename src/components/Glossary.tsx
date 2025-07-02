// src/components/Glossary.tsx
'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Volume2Icon, PlayIcon, PauseIcon } from 'lucide-react'
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
}

export default function Glossary({ 
  glossary, 
  textSize = 16 
}: GlossaryProps) {
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const [showingVideo, setShowingVideo] = useState<number | null>(null)
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement | null }>({})

  const playAudio = (termId: number, audioUrl: string) => {
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

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Título del Glosario */}
        <div className="text-center mb-8">
          <h1 
            className="font-bold text-blue-600 mb-2"
            style={{ fontSize: `${Math.max(textSize + 8, 24)}px` }}
          >
            {glossary.title}
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded"></div>
        </div>

        {/* Tabla del Glosario */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header de la tabla */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="grid grid-cols-12 gap-4 p-4 font-semibold">
              <div className="col-span-2 text-center">Palabra</div>
              <div className="col-span-5 text-center">Definición</div>
              <div className="col-span-2 text-center">Pictograma</div>
              <div className="col-span-1 text-center">Audio</div>
              <div className="col-span-2 text-center">Video</div>
            </div>
          </div>

          {/* Filas de términos */}
          <div className="divide-y divide-gray-200">
            {glossary.terms.map((term, index) => (
              <div key={term.id} className="relative">
                <div className={`grid grid-cols-12 gap-4 p-4 transition-colors hover:bg-blue-50 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}>
                  {/* Número y Palabra */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center space-x-2">
                      <span 
                        className="font-bold text-blue-600"
                        style={{ fontSize: `${textSize}px` }}
                      >
                        {index + 1}.
                      </span>
                      <span 
                        className="font-semibold text-gray-800"
                        style={{ fontSize: `${textSize}px` }}
                      >
                        {term.word}
                      </span>
                    </div>
                  </div>

                  {/* Definición */}
                  <div className="col-span-5 flex items-center">
                    <p 
                      className="text-gray-700 leading-relaxed"
                      style={{ fontSize: `${textSize}px` }}
                    >
                      {term.definition}
                    </p>
                  </div>

                  {/* Pictograma */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border">
                      <Image
                        src={term.pictogram}
                        alt={term.word}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback si no existe la imagen
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Audio */}
                  <div className="col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => playAudio(term.id, term.audioUrl)}
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                    >
                      {playingAudio === term.id ? (
                        <PauseIcon className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Volume2Icon className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                    
                    {/* Audio element */}
                    <audio
                      ref={(el) => audioRefs.current[term.id] = el}
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
        <div className="mt-8 text-center text-gray-600">
          <p style={{ fontSize: `${Math.max(textSize - 2, 12)}px` }}>
            💡 Haz clic en los íconos para escuchar el audio o ver la lengua de señas
          </p>
        </div>
      </div>
    </div>
  )
}