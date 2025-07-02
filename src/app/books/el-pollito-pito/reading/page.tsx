"use client";
import { useState, useRef, useEffect } from "react";
import BookHeader from "components/BookHeader";
import BookReader from "components/BookReader";
import BookFooter from "components/BookFooter";
import AccessibilitySidebar from "components/AccessibilitySidebar";
import Sidebar from "components/Sidebar";
import { useBookData } from "hooks/useBookData";

export default function ReadingPage() {
  // 🔥 Cargar datos del JSON
  const { bookData, loading, error } = useBookData("el-pollito-pito");

  // 1. Refs y estados
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [narrationOn, setNarrationOn] = useState(false);
  
  // Estados de los sidebars - SOLO UNO PUEDE ESTAR ACTIVO
  const [contentsOpen, setContentsOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Estados de accesibilidad
  const [contrast, setContrast] = useState(0);
  const [textSize, setTextSize] = useState(32); // ✅ Cambió de 16 a 32px por defecto
  const [imageScale, setImageScale] = useState(1);
  const [audioSpeed, setAudioSpeed] = useState(1);

  // 🔥 NUEVO: Estado para controlar el modo de vista
  const [isDefaultView, setIsDefaultView] = useState(true);

  // 🔥 NUEVO: Detectar cuando imageScale cambia de 1 (default)
  useEffect(() => {
    if (imageScale === 1) {
      setIsDefaultView(true);
    } else {
      setIsDefaultView(false);
    }
  }, [imageScale]);

  // 2. Función para alternar la narración con manejo de errores
  const toggleNarration = () => {
    const audio = audioRef.current;
    if (!audio || !bookData) return;

    if (narrationOn) {
      audio.pause();
      setNarrationOn(false);
    } else {
      if (audio.src && audio.src !== window.location.href) {
        audio.play().catch((error) => {
          console.log("Audio no disponible:", error);
        });
        setNarrationOn(true);
      } else {
        console.log("No hay audio disponible para esta página");
      }
    }
  };

  // 3. Función para cambiar de página con auto-reproducción y manejo de errores
  const handlePageChange = (pageIndex: number) => {
    if (!bookData) return;
    
    setCurrent(pageIndex);
    
    // Si la narración está activa, reproducir el audio de la nueva página
    if (narrationOn) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio && bookData.pages[pageIndex]?.audioUrl) {
          audio.load(); // Recargar el nuevo src
          audio.play().catch((error) => {
            console.log("Audio no disponible para esta página:", error);
          });
        }
      }, 100);
    }
  };

  // 4. Funciones de toggle con exclusión mutua
  const toggleContents = () => {
    if (contentsOpen) {
      setContentsOpen(false);
    } else {
      setContentsOpen(true);
      setAccessibilityOpen(false);
    }
  };

  const toggleAccessibility = () => {
    if (accessibilityOpen) {
      setAccessibilityOpen(false);
    } else {
      setAccessibilityOpen(true);
      setContentsOpen(false);
    }
  };

  // 5. Función para manejar selección de página desde sidebar
  const handleSelectPage = (pageIndex: number) => {
    handlePageChange(pageIndex);
    setContentsOpen(false); // Cerrar sidebar después de seleccionar
  };

  // 🔥 NUEVA: Función para resetear a vista default
  const handleResetToDefault = () => {
    setImageScale(1);
    setIsDefaultView(true);
  };

  // 🔥 Mostrar estados de carga y error
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Cargando libro...</p>
        </div>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">Error al cargar el libro</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header en la parte superior */}
      <BookHeader
        title={bookData.title}
        contentsOpen={contentsOpen}
        onToggleContents={toggleContents}
        accessibilityOpen={accessibilityOpen}
        onToggleAccessibility={toggleAccessibility}
      />

      {/* Contenido principal que ocupa el espacio restante */}
      <div className="flex-1 min-h-0">
        <BookReader 
          pages={bookData.pages} 
          currentPage={current}
          onChangePage={handlePageChange}
          textSize={textSize}
          imageScale={imageScale}
          isDefaultView={isDefaultView} // ✅ Pasar el estado del modo
        />
      </div>

      {/* Footer en la parte inferior */}
      <BookFooter
        current={current + 1}
        total={bookData.pages.length}
        audioRef={audioRef}
        audioSrc={bookData.pages[current]?.audioUrl || ""}
        narrationOn={narrationOn}
        audioSpeed={audioSpeed}
        onToggleNarration={toggleNarration}
        onSeekPage={handlePageChange}
      />

      {/* Sidebar de Contenidos */}
      {contentsOpen && (
        <Sidebar
          pages={bookData.pages}
          currentPage={current}
          onSelectPage={handleSelectPage}
          onClose={() => setContentsOpen(false)}
        />
      )}

      {/* Sidebar de Accesibilidad */}
      {accessibilityOpen && (
        <AccessibilitySidebar
          contrast={contrast}
          textSize={textSize}
          imageScale={imageScale}
          audioSpeed={audioSpeed}
          narrationOn={narrationOn}
          isDefaultView={isDefaultView} // ✅ Pasar el estado del modo
          onContrastChange={setContrast}
          onTextSizeChange={setTextSize}
          onImageScaleChange={setImageScale}
          onAudioSpeedChange={setAudioSpeed}
          onToggleNarration={toggleNarration}
          onResetToDefault={handleResetToDefault} // ✅ Nueva función
          onClose={() => setAccessibilityOpen(false)}
        />
      )}
    </div>
  );
}