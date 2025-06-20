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
  imageUrl: string
  text: string
  textPosition?: Partial<Record<'top'|'left'|'right'|'bottom',string>>
  textBgColor?: string
  videoWebmUrl?: string
  videoMp4Url?:  string
}

export default function BookReader({
  pages,
  onChangePage,
}: {
  pages: BookPage[]
  onChangePage: (idx: number) => void
}) {
  const [current, setCurrent]     = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const last = pages.length - 1
  const page = pages[current]

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

  const go = (idx: number) => {
    setCurrent(idx)
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
    <div className="flex-1 flex items-center justify-center bg-background p-8 relative">
      {/* ← Prev */}
      <button
        onClick={() => current > 0 && go(current-1)}
        disabled={current === 0}
        className={`
          p-2 transition
          ${current===0
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 hover:text-primary-700'}
        `}
      >
        <ChevronLeftIcon className="w-12 h-12 mx-5" />
      </button>

      {/* Main image container */}
      <div className="relative w-full max-w-6xl rounded-2xl overflow-hidden border-4 border-[#647411]">
        <Image
          src={page.imageUrl}
          alt={`Página ${current+1}`}
          width={1500} height={754}
          className="w-full object-cover"
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
          <div className="space-y-3">
            {page.text.split('\n').map((line,i)=>
              <span
                key={i}
                className="font-quicksand text-white font-semibold text-lg md:text-xl inline-block px-2 py-1"
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
              className="absolute bottom-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
            >
              <SignLanguageIcon className="w-6 h-6 text-primary-600"/>
            </button>

            {/* two extra buttons pop up above */}
            {showControls && (
              <div className="absolute bottom-20 right-4 z-10 flex flex-col items-center space-y-3">
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
                >
                  <PlayCircle className={`w-6 h-6 text-primary-600 ${isPlaying?'rotate-90':''}`}/>
                </button>
                <button
                  onClick={()=>setIsExpanded(e=>!e)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer"
                >
                  <ExpandContent className={`w-6 h-6 text-primary-600 ${isExpanded?'rotate-180':''}`}/>
                </button>
              </div>
            )}

            {/* transparent video overlay */}
            {showVideo && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className={`${isExpanded?'w-3/4 h-3/4':'w-1/2 h-1/2'} relative transition-all`}>
                  <video
                    ref={videoRef}
                    playsInline muted
                    className="w-full h-full rounded-lg object-cover"
                    onEnded={()=>setIsPlaying(false)}
                  >
                    <source src={page.videoWebmUrl} type="video/webm"/>
                    <source src={page.videoMp4Url } type="video/mp4" />
                    {/* fallback message */}
                    Your browser doesn’t support embedded videos.
                  </video>
                  <button
                    onClick={()=>setShowVideo(false)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-white text-xl"
                  >✕</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* → Next */}
      <button
        onClick={() => current<last && go(current+1)}
        disabled={current===last}
        className={`
          p-2 transition
          ${current===last
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 hover:text-primary-700'}
        `}
      >
        <ChevronRightIcon className="w-12 h-12 mx-5" />
      </button>
    </div>
  )
}