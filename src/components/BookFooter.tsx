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
  onSeekPage,
}: BookFooterProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const skipSeconds = 5

  // Al terminar el audio, actualizamos el estado
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('ended', onEnded)
    }
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
    <footer className="bg-white border-t px-6 py-4">
      {/* Elemento de audio oculto */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="max-w-6xl mx-auto flex items-center space-x-6">
        {/* Reproductor (compacto) */}
        <div className="flex-shrink-0 flex items-center space-x-6">
          <button
            aria-label="Atrás 5s"
            onClick={handleSkipBack}
            className="w-8 h-8 text-primary-600 hover:text-primary-700"
          >
            <SkipBackIcon className="w-6 h-6" />
          </button>

          <button
            aria-label={isPlaying ? 'Pausa' : 'Reproducir'}
            onClick={togglePlay}
            className="w-10 h-10 text-primary-600 hover:text-primary-700"
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
            className="w-8 h-8 text-primary-600 hover:text-primary-700"
          >
            <SkipForwardIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Barra de progreso de páginas */}
        <div className="flex-1 relative">
          <input
            type="range"
            min={1}
            max={total}
            value={current}
            onChange={(e) => {
              const idx = parseInt(e.currentTarget.value, 10) - 1
              onSeekPage?.(idx)
            }}
            className="w-full accent-primary-600"
          />
          <span className="absolute right-0 top-0 text-xs text-primary-600">
            pag {current}/{total}
          </span>
        </div>
      </div>
    </footer>
  )
}