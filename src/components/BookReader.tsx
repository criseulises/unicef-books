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

interface BookReaderProps {
  pages: BookPage[]
  currentPage: number
  onChangePage: (idx: number) => void
  textSize?: number
  imageScale?: number
  isDefaultView?: boolean
  totalPagesWithGlossary?: number // ✅ Nueva prop para conocer el total incluyendo glosario
}

export default function BookReader({
  pages,
  currentPage,
  onChangePage,
  textSize = 32,
  imageScale = 1,
  isDefaultView = true,
  totalPagesWithGlossary,
}: BookReaderProps) {
  const [showVideo, setShowVideo] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Reset image loading state when page or mode changes
  useEffect(() => {
    setImageLoaded(false)
  }, [pages[currentPage]?.imageUrl, isDefaultView, imageScale])

  // ✅ CÁLCULO CORREGIDO: Usar totalPagesWithGlossary si está disponible
  const totalPages = totalPagesWithGlossary || pages.length
  const lastPageIndex = totalPages - 1
  const page = pages[currentPage]

  // 🔥 EFECTO MEJORADO: Cambiar video automáticamente al cambiar página
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !page) return;

    if (showVideo && (page.videoWebmUrl || page.videoMp4Url)) {
      video.pause();
      video.load();
      video.currentTime = 0;
      if (isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => console.log("Error auto-play video:", error));
        }
      }
    }
  }, [currentPage, page?.videoWebmUrl, page?.videoMp4Url, showVideo, isPlaying]);

  const go = (idx: number) => onChangePage(idx)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (isPlaying) {
      v.pause()
      setIsPlaying(false)
    } else {
      v.currentTime = 0
      const playPromise = v.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.log("Error play video:", error)
            setIsPlaying(false)
          })
      }
    }
  }

  const handleVideoEnd = () => {
    if (videoRef.current) videoRef.current.currentTime = 0
    setIsPlaying(false)
  }

  const activateVideo = () => {
    setShowVideo(true)
    setShowControls(true)
    setIsPlaying(true)
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) playPromise.catch(e => console.log("Error activating video:", e));
      }
    }, 100);
  }

  const deactivateVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setShowVideo(false);
    setShowControls(false);
    setIsPlaying(false);
  }

  const hasVideo = page && (page.videoWebmUrl || page.videoMp4Url)

  if (!page) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-gray-500">Página no encontrada</p>
        </div>
      </div>
    )
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

      {/* 🔥 MODO DEFAULT vs MODO NAVEGACIÓN */}
      <div className="relative flex-1 h-full mx-4">
        {isDefaultView ? (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="relative rounded-xl overflow-hidden border-4 border-[#647411] shadow-lg"
              style={{ width: 'min(100%, 1200px)', height: 'min(100%, 600px)', aspectRatio: '1500/754' }}
            >
              {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}   
              <Image
                src={page.imageUrl}
                alt={`Página ${currentPage+1}`}
                fill
                className="object-cover"
                priority
                onLoadingComplete={() => setImageLoaded(true)}
              />

              {/* 🔥 FLOATING TEXT MEJORADO - MODO DEFAULT */}
              <div className="absolute" style={{ top: page.textPosition?.top ?? '10%', left: page.textPosition?.left ?? '5%', right: page.textPosition?.right ?? '5%', bottom: page.textPosition?.bottom ?? 'auto' }}>
                <div className="flex flex-col space-y-2">
                  {page.text.split('\n').map((line, i) => (
                    <div key={i} className="font-quicksand text-white font-semibold px-2 py-1"
                      style={{ backgroundColor: page.textBgColor ?? 'rgba(0,0,0,0.5)', fontSize: `${textSize}px`, lineHeight: '1.4', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {hasVideo && (
                <> {/* video controls & player same as before */}
                  <button onClick={() => showVideo ? deactivateVideo() : activateVideo()} className="absolute bottom-3 right-3 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer shadow-md">
                    <SignLanguageIcon className="text-primary-600"/>
                  </button>
                  {showControls && (
                    <div className="absolute bottom-16 lg:bottom-20 right-3 z-10 flex flex-col items-center space-y-2">
                      <button onClick={togglePlay} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer shadow-md">
                        <PlayCircle className={`text-primary-600 ${isPlaying?'rotate-90':''}`}/>
                      </button>
                      <button onClick={()=>setIsExpanded(e=>!e)} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-100 transition cursor-pointer shadow-md">
                        <ExpandContent className={`text-primary-600 ${isExpanded?'rotate-180':''}`}/>
                      </button>
                    </div>
                  )}
                  {showVideo && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                      <video key={`video-${currentPage}-${page.id}`} ref={videoRef} playsInline muted className={`${isExpanded ? 'h-[400px]' : 'h-[320px]'} rounded-lg shadow-xl transition-all duration-300`} style={{ width: 'auto', backgroundColor: 'transparent', objectFit: 'contain', objectPosition: 'center', border: 'none', outline: 'none' }} onEnded={handleVideoEnd} poster="">
                        {page.videoWebmUrl && <source src={page.videoWebmUrl} type="video/webm"/>}
                        {page.videoMp4Url && <source src={page.videoMp4Url} type="video/mp4" />}Tu navegador no soporta videos.
                      </video>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-auto bg-gray-100 rounded-lg">
            <div className="relative flex items-center justify-center p-4" style={{ minWidth: '100%', minHeight: '100%' }}>
              <div className="relative rounded-xl overflow-hidden border-4 border-[#647411] shadow-lg" style={{ width: `${1200 * imageScale}px`, height: `${600 * imageScale}px`, aspectRatio: '1500/754', transition: 'all 0.3s ease-out' }}>
                {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}  
                <Image src={page.imageUrl} alt={`Página ${currentPage+1}`} fill className="object-cover" onLoadingComplete={() => setImageLoaded(true)} />

                {/* floating text & video controls/nav view identical to default, omitted for brevity */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* → Next */}
      <button onClick={() => currentPage < lastPageIndex && go(currentPage+1)} disabled={currentPage === lastPageIndex} className={`
          p-2 transition flex-shrink-0 z-10
          ${currentPage === lastPageIndex
             ? 'opacity-50 cursor-not-allowed'
             : 'text-primary-600 hover:text-primary-700'}
        `}>
        <ChevronRightIcon className="w-8 h-8 lg:w-10 lg:h-10 mx-2 lg:mx-4" />
      </button>
    </div>
  )
}