// src/components/BookReader.tsx
'use client'
import React, {
  useState,
  useRef,
  useEffect,
} from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'

// your SVG components
import SignLanguageIcon from '@/icons/SignLanguage'
import PlayCircle         from '@/icons/PlayCircle'
import ExpandContent      from '@/icons/ExpandContent'

export interface BookPage {
  id: number
  title?: string
  imageUrl: string
  text: string
  textPosition?: Partial<Record<'top'|'left'|'right'|'bottom',string>>
  textBgColor?: string
  videoWebmUrl?: string
  videoMp4Url?:  string
  audioUrl?: string
}

export default function BookReader({
  pages,
  currentPage,
  onChangePage,
}: {
  pages: BookPage[]
  currentPage: number
  onChangePage: (idx: number) => void
}) {
  const [showVideo, setShowVideo] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const last = pages.length - 1
  const page = pages[currentPage]

  // Auto-play when you open
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
    }
  }, [showVideo])

  // Limpiar video cuando cambia de página
  useEffect(() => {
    setShowVideo(false)
    setShowControls(false)
    setIsPlaying(false)
  }, [currentPage])

  const go = (idx: number) => {
    onChangePage(idx)
    setShowVideo(false)
    setShowControls(false)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) { v.pause(); setIsPlaying(false) }
    else           { v.play();  setIsPlaying(true)  }
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-background p-4 relative">
      {/* ← Prev */}
      <button
        onClick={() => currentPage > 0 && go(currentPage-1)}
        disabled={currentPage === 0}
        className={`
          p-2 transition flex-shrink-0 z-10
          ${currentPage===0
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 hover:text-primary-700'}
        `}
      >
        <ChevronLeftIcon className="w-8 h-8 lg:w-10 lg:h-10 mx-2 lg:mx-4" />
      </button>

      {/* Main image container - ocupa todo el espacio disponible */}
      <div className="relative flex-1 h-full mx-4 flex items-center justify-center">
        <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-[#647411] shadow-lg">
          <Image
            src={page.imageUrl}
            alt={`Página ${currentPage+1}`}
            width={1500}
            height={754}
            className="w-full h-full object-cover"
            priority
          />

          {/* Floating text */}
          <div
            className="absolute"
            style={{
              top:    page.textPosition?.top    ?? '10%',
              left:   page.textPosition?.left   ?? '5%',
              right:  page.textPosition?.right  ?? '5%',
              bottom: page.textPosition?.bottom ?? 'auto',
            }}
          >
            <div className="space-y-2">
              {page.text.split('\n').map((line,i)=>
                <span
                  key={i}
                  className="font-quicksand text-white font-semibold text-sm md:text-base lg:text-lg inline-block px-2 py-1"
                  style={{
                    backgroundColor: page.textBgColor ?? 'rgba(0,0,0,0.5)',
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                  }}
                >
                  {line}
                </span>
              )}
            </div>
          </div>

          {/* —— SIGN LANGUAGE BUTTON + SUB-CONTROLS —— */}
          {page.videoWebmUrl && page.videoMp4Url && (
            <>
              <button
                onClick={() => {
                  setShowControls(c=>!c)
                  setShowVideo(true)
                }}
                className="absolute bottom-3 right-3 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer shadow-md"
              >
                <SignLanguageIcon className="text-primary-600"/>
              </button>

              {/* two extra buttons pop up above */}
              {showControls && (
                <div className="absolute bottom-16 lg:bottom-18 right-3 z-10 flex flex-col items-center space-y-2">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer shadow-md"
                  >
                    <PlayCircle className={`text-primary-600 ${isPlaying?'rotate-90':''}`}/>
                  </button>
                  <button
                    onClick={()=>setIsExpanded(e=>!e)}
                    className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer shadow-md"
                  >
                    <ExpandContent className={`text-primary-600 ${isExpanded?'rotate-180':''}`}/>
                  </button>
                </div>
              )}

              {/* transparent video overlay */}
              {showVideo && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-50">
                  <div className={`${isExpanded?'w-4/5 h-4/5':'w-1/2 h-1/2'} relative transition-all duration-300`}>
                    <video
                      ref={videoRef}
                      playsInline muted
                      className="w-full h-full rounded-lg object-cover shadow-xl"
                      onEnded={()=>setIsPlaying(false)}
                    >
                      <source src={page.videoWebmUrl} type="video/webm"/>
                      <source src={page.videoMp4Url } type="video/mp4" />
                      Your browser no support embedded videos.
                    </video>
                    <button
                      onClick={()=>setShowVideo(false)}
                      className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white text-xl bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                    >✕</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* → Next */}
      <button
        onClick={() => currentPage<last && go(currentPage+1)}
        disabled={currentPage===last}
        className={`
          p-2 transition flex-shrink-0 z-10
          ${currentPage===last
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 hover:text-primary-700'}
        `}
      >
        <ChevronRightIcon className="w-8 h-8 lg:w-10 lg:h-10 mx-2 lg:mx-4" />
      </button>
    </div>
  )
}