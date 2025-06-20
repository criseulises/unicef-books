'use client'
import React, {  useEffect } from 'react'
import {
  SkipBackIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
} from 'lucide-react'

interface BookFooterProps {
  current: number
  total: number
  audioRef: React.RefObject<HTMLAudioElement | null>  // ✅ Permitir null
  audioSrc: string
  narrationOn: boolean
  audioSpeed: number // ✅ Nueva prop para velocidad
  onToggleNarration: () => void
  onSeekPage?: (idx: number) => void
}

export default function BookFooter({
  current,
  total,
  audioRef,
  audioSrc,
  narrationOn,
  audioSpeed, // ✅ Recibir velocidad
  onToggleNarration,
}: BookFooterProps) {
  const skipSeconds = 5

  // ✅ Efecto para aplicar la velocidad del audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    // Aplicar la velocidad de reproducción
    audio.playbackRate = audioSpeed
    console.log(`Velocidad de audio ajustada a: ${audioSpeed}x`)
  }, [audioSpeed, audioRef])

  // ✅ Efecto para manejar cuando el audio termina
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    
    const onEnded = () => {
      // ✅ CAMBIO: No desactivar la narración cuando termine naturalmente
      // La narración se mantiene activa para auto-reproducir la siguiente página
      // Solo se desactiva cuando el usuario hace click en pause manualmente
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
  }, [audioRef, audioSpeed])

  // ✅ Usar la función del padre en lugar de una local
  const togglePlay = () => {
    onToggleNarration()
  }

  const handleSkipForward = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(audio.currentTime + skipSeconds, audio.duration || 0)
  }

  const handleSkipBack = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(audio.currentTime - skipSeconds, 0)
  }

  return (
    <footer className="px-6 pb-10">
      {/* ✅ El audio se maneja en el componente padre */}
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
            aria-label={narrationOn ? 'Pausa' : 'Reproducir'}
            onClick={togglePlay}
            className="w-10 h-10 fill-primary-700 hover:fill-primary-800 transition-colors"
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
            className="w-8 h-8 fill-primary-700 hover:fill-primary-800 transition-colors"
          >
            <SkipForwardIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Indicador de velocidad */}
        <div className="flex-shrink-0">
          <span className="text-xs text-primary-700 font-medium bg-primary-50 px-2 py-1 rounded">
            {audioSpeed.toFixed(1)}×
          </span>
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
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary-700 rounded-full "
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