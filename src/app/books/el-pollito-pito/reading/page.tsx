"use client";
import { useState, useRef, useEffect } from "react";
import BookHeader from "components/BookHeader";
import BookReader from "components/BookReader";
import BookFooter from "components/BookFooter";
import Glossary from "components/Glossary";
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
  const [textSize, setTextSize] = useState(32);
  const [imageScale, setImageScale] = useState(1);
  const [audioSpeed, setAudioSpeed] = useState(1);

  // 🔥 Estado para controlar el modo de vista
  const [isDefaultView, setIsDefaultView] = useState(true);

  // 🔥 Detectar cuando imageScale cambia de 1 (default)
  useEffect(() => {
    if (imageScale === 1) {
      setIsDefaultView(true);
    } else {
      setIsDefaultView(false);
    }
  }, [imageScale]);

  // ✅ LÓGICA CORREGIDA: Calcular total de páginas incluyendo glosario
  const totalBookPages = bookData?.pages.length || 0;
  const totalPagesWithGlossary = totalBookPages + 1; // +1 para el glosario
  const isInGlossary = current === totalBookPages; // Si current === total de páginas del libro, mostrar glosario
  const isInPages = current < totalBookPages; // Si current < total de páginas del libro, mostrar páginas

  // 2. Función para alternar la narración con manejo de errores
  const toggleNarration = () => {
    const audio = audioRef.current;
    if (!audio || !bookData || isInGlossary) return; // ✅ No narrar en glosario

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

  // 3. ✅ FUNCIÓN MEJORADA: Manejar cambio de página incluyendo glosario
  const handlePageChange = (pageIndex: number) => {
    if (!bookData) return;
    
    // ✅ Validar límites: 0 hasta totalPagesWithGlossary - 1
    const clampedIndex = Math.max(0, Math.min(pageIndex, totalPagesWithGlossary - 1));
    setCurrent(clampedIndex);
    
    // ✅ Solo reproducir audio si estamos en páginas del libro (no en glosario)
    if (narrationOn && clampedIndex < totalBookPages) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio && bookData.pages[clampedIndex]?.audioUrl) {
          audio.load(); // Recargar el nuevo src
          audio.play().catch((error) => {
            console.log("Audio no disponible para esta página:", error);
          });
        }
      }, 100);
    }

    // ✅ Pausar narración si entramos al glosario
    if (clampedIndex === totalBookPages && narrationOn) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        setNarrationOn(false);
      }
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

  // 🔥 ✅ NUEVA: Función para ir al glosario desde sidebar
  const handleGoToGlossary = () => {
    handlePageChange(totalBookPages); // Ir a la posición del glosario
    setContentsOpen(false);
  };

  // 🔥 Función para resetear a vista default
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

      {/* ✅ CONTENIDO PRINCIPAL - CONDICIONAL MEJORADO */}
      <div className="flex-1 min-h-0">
        {isInPages ? (
          // 📖 MOSTRAR PÁGINAS DEL LIBRO
          <BookReader 
            pages={bookData.pages} 
            currentPage={current}
            onChangePage={handlePageChange}
            textSize={textSize}
            imageScale={imageScale}
            isDefaultView={isDefaultView}
            totalPagesWithGlossary={totalPagesWithGlossary} // ✅ Pasar el total incluyendo glosario
          />
        ) : isInGlossary ? (
          // 📚 MOSTRAR GLOSARIO
          <Glossary 
            glossary={bookData.glossary}
            textSize={textSize}
          />
        ) : null}
      </div>

      {/* ✅ FOOTER MEJORADO - SIEMPRE MOSTRAR PERO ADAPTAR FUNCIONALIDAD */}
      <BookFooter
        current={current + 1}
        total={totalPagesWithGlossary} // ✅ Total incluyendo glosario
        audioRef={audioRef}
        audioSrc={isInPages ? (bookData.pages[current]?.audioUrl || "") : ""} // ✅ Solo audio en páginas
        narrationOn={narrationOn && isInPages} // ✅ Solo narración en páginas
        audioSpeed={audioSpeed}
        onToggleNarration={toggleNarration}
        onSeekPage={handlePageChange} // ✅ Ahora maneja páginas + glosario
      />

      {/* ✅ SIDEBAR DE CONTENIDOS MEJORADO - INCLUIR GLOSARIO */}
      {contentsOpen && (
        <Sidebar
          pages={bookData.pages}
          currentPage={current}
          onSelectPage={handleSelectPage}
          onGoToGlossary={handleGoToGlossary} // ✅ Nueva prop para ir al glosario
          isInGlossary={isInGlossary} // ✅ Nueva prop para indicar si estamos en glosario
          onClose={() => setContentsOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR DE ACCESIBILIDAD - SIEMPRE DISPONIBLE */}
      {accessibilityOpen && (
        <AccessibilitySidebar
          contrast={contrast}
          textSize={textSize}
          imageScale={imageScale}
          audioSpeed={audioSpeed}
          narrationOn={narrationOn && isInPages} // ✅ Solo mostrar narración activa en páginas
          isDefaultView={isDefaultView}
          onContrastChange={setContrast}
          onTextSizeChange={setTextSize}
          onImageScaleChange={setImageScale}
          onAudioSpeedChange={setAudioSpeed}
          onToggleNarration={toggleNarration}
          onResetToDefault={handleResetToDefault}
          onClose={() => setAccessibilityOpen(false)}
        />
      )}
    </div>
  );
}