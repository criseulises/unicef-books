'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  SkipBackIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
} from 'lucide-react'

interface BookFooterProps {
  current: number
  total: number
  audioSrc: string
  onSeekPage?: (idx: number) => void
}

export default function BookFooter({
  current,
  total,
  audioSrc,
}: BookFooterProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const skipSeconds = 5

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (!isPlaying) {
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleSkipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audio.currentTime + skipSeconds, audio.duration)
  }

  const handleSkipBack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(audio.currentTime - skipSeconds, 0)
  }

  return (
    <footer className="px-6 pb-10">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="max-w-6xl mx-auto flex items-center space-x-6">
        {/* Controles de audio */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          <button
            aria-label="Atrás 5s"
            onClick={handleSkipBack}
            className="w-8 h-8 fill-primary-700 hover:fill-primary-800 transition-colors"
          >
            <SkipBackIcon className="w-6 h-6" />
          </button>
          <button
            aria-label={isPlaying ? 'Pausa' : 'Reproducir'}
            onClick={togglePlay}
            className="w-10 h-10 fill-primary-700 hover:fill-primary-800 transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-8 h-8" />
            ) : (
              <PlayIcon className="w-8 h-8" />
            )}
          </button>
          <button
            aria-label="Adelante 5s"
            onClick={handleSkipForward}
            className="w-8 h-8 fill-primary-700 hover:fill-primary-800 transition-colors"
          >
            <SkipForwardIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Barra de progreso con texto posicionado */}
        <div className="relative flex-1">
          <div className="relative">
            <progress
              value={current}
              max={total}
              className="
                w-full h-2
                appearance-none
                [&::-webkit-progress-bar]:bg-primary-300
                [&::-webkit-progress-bar]:rounded-full
                [&::-webkit-progress-value]:bg-primary-700
                [&::-webkit-progress-value]:rounded-full
                [&::-moz-progress-bar]:bg-primary-700
                [&::-moz-progress-bar]:rounded-full
              "
              style={{
                backgroundColor: '#83AFFF', // fallback para primary-300
              }}
            />
            
            {/* Círculo indicador en la punta del progreso */}
            <div
              className="absolute top-[14] -translate-y-1/2 w-4 h-4 bg-primary-700 rounded-full "
              style={{
                left: `calc(${(current / total) * 100}% - 8px)`, // -8px para centrar el círculo
              }}
            />
          </div>
          
          {/* Texto posicionado en la esquina inferior derecha de la barra */}
          <div className="absolute -bottom-6 right-0">
            <span className="text-xs text-primary-700 font-medium">
              pag {current}/{total}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}