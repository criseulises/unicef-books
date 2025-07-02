'use client'
import React, { useEffect } from 'react'
import {
  SkipBackIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
} from 'lucide-react'

interface BookFooterProps {
  current: number
  total: number
  audioRef: React.RefObject<HTMLAudioElement | null>
  audioSrc: string
  narrationOn: boolean
  audioSpeed: number
  onToggleNarration: () => void
  onSeekPage?: (idx: number) => void
}

export default function BookFooter({
  current,
  total,
  audioRef,
  audioSrc,
  narrationOn,
  audioSpeed,
  onToggleNarration,
  onSeekPage,
}: BookFooterProps) {
  const skipSeconds = 5

  // ✅ Verificar si hay audio disponible
  const hasAudio = audioSrc && audioSrc.trim() !== ''

  // ✅ Efecto para aplicar la velocidad del audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasAudio) return
    
    // Aplicar la velocidad de reproducción
    audio.playbackRate = audioSpeed
    console.log(`Velocidad de audio ajustada a: ${audioSpeed}x`)
  }, [audioSpeed, audioRef, hasAudio])

  // ✅ Efecto para manejar cuando el audio termina
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !hasAudio) return
    
    const onEnded = () => {
      console.log("Audio terminó - narración sigue activa para próxima página")
    }
    
    const onLoadedData = () => {
      // ✅ Aplicar velocidad cuando se carga nuevo audio
      audio.playbackRate = audioSpeed
    }
    
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('loadeddata', onLoadedData)
    
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('loadeddata', onLoadedData)
    }
  }, [audioRef, audioSpeed, hasAudio])

  const togglePlay = () => {
    if (hasAudio) {
      onToggleNarration()
    }
  }

  const handleSkipForward = () => {
    const audio = audioRef.current
    if (!audio || !hasAudio) return
    audio.currentTime = Math.min(audio.currentTime + skipSeconds, audio.duration || 0)
  }

  const handleSkipBack = () => {
    const audio = audioRef.current
    if (!audio || !hasAudio) return
    audio.currentTime = Math.max(audio.currentTime - skipSeconds, 0)
  }

  // ✅ Función para manejar click en la barra de progreso
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeekPage) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const percentage = clickX / rect.width
    const targetPage = Math.round(percentage * (total - 1))
    
    // Asegurar que esté dentro del rango válido
    const clampedPage = Math.max(0, Math.min(targetPage, total - 1))
    onSeekPage(clampedPage)
  }

  return (
    <footer className="px-6 pb-10">
      {/* ✅ Solo renderizar audio si hay src válido */}
      {hasAudio && (
        <audio ref={audioRef} src={audioSrc} preload="metadata" />
      )}

      <div className="max-w-6xl mx-auto flex items-center space-x-6">
        {/* Controles de audio */}
        <div className="flex-shrink-0 flex items-center space-x-4">
          <button
            aria-label="Atrás 5s"
            onClick={handleSkipBack}
            disabled={!hasAudio} // ✅ Deshabilitar si no hay audio
            className={`w-8 h-8 transition-colors ${
              hasAudio 
                ? 'fill-primary-700 hover:fill-primary-800' 
                : 'fill-gray-400 cursor-not-allowed'
            }`}
          >
            <SkipBackIcon className="w-6 h-6" />
          </button>
          
          <button
            aria-label={narrationOn ? 'Pausa' : 'Reproducir'}
            onClick={togglePlay}
            disabled={!hasAudio} // ✅ Deshabilitar si no hay audio
            className={`w-10 h-10 transition-colors ${
              hasAudio 
                ? 'fill-primary-700 hover:fill-primary-800' 
                : 'fill-gray-400 cursor-not-allowed'
            }`}
          >
            {narrationOn ? (
              <PauseIcon className="w-8 h-8" />
            ) : (
              <PlayIcon className="w-8 h-8" />
            )}
          </button>
          
          <button
            aria-label="Adelante 5s"
            onClick={handleSkipForward}
            disabled={!hasAudio} // ✅ Deshabilitar si no hay audio
            className={`w-8 h-8 transition-colors ${
              hasAudio 
                ? 'fill-primary-700 hover:fill-primary-800' 
                : 'fill-gray-400 cursor-not-allowed'
            }`}
          >
            <SkipForwardIcon className="w-6 h-6" />
          </button>
        </div>

        {/* ✅ Mostrar velocidad solo si hay audio */}
        {hasAudio && (
          <div className="flex-shrink-0">
            <span className="text-xs text-primary-700 font-medium bg-primary-50 px-2 py-1 rounded">
              {audioSpeed.toFixed(1)}×
            </span>
          </div>
        )}

        {/* Barra de progreso */}
        <div className="relative flex-1">
          <div 
            className="relative cursor-pointer"
            onClick={handleProgressClick}
          >
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
            
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-700 rounded-full pointer-events-none"
              style={{
                left: `calc(${(current / total) * 100}% - 8px)`, // -8px para centrar el círculo
              }}
            />
          </div>
          
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