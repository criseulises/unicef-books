// src/app/books/el-pollito-pito/reading/page.tsx
"use client";
import { useState, useRef } from "react";
import BookHeader from "components/BookHeader";
import BookReader, { BookPage } from "components/BookReader";
import BookFooter from "components/BookFooter";
import AccessibilitySidebar from "components/AccessibilitySidebar";
import Sidebar from "components/Sidebar";

export default function ReadingPage() {
  const pages: BookPage[] = [
    {
      id: 1,
      imageUrl: "/images/pollito/pagina1.jpg",
      text: "El pollito pito\nNosotros somos en el parque\nTomando todo",
      textPosition: { top: "10%", left: "5%" },
      textBgColor: "#647411",
      videoWebmUrl: "/videos/pollito-senas-1.webm",
      videoMp4Url: "/videos/pollito-senas-1.mp4",
      audioUrl: "/audios/PollitoPito_Pagina3.wav", // ✅ Usar el que existe temporalmente
    },
    {
      id: 2,
      imageUrl: "/images/pollito/pagina2.jpg",
      text: "Segunda página del pollito",
      textPosition: { top: "15%", left: "10%" },
      textBgColor: "#647411",
      videoWebmUrl: "/videos/pollito-senas-1.webm",
      videoMp4Url: "/videos/pollito-senas-1.mp4",
      audioUrl: "/audios/PollitoPito_Pagina3.wav", // ✅ Usar el que existe temporalmente
    },

    // ... más páginas con sus respectivos audios
  ];

  // 1. Refs y estados
  const audioRef = useRef<HTMLAudioElement>(null);
  const [current, setCurrent] = useState(0);
  const [narrationOn, setNarrationOn] = useState(false);
  
  // Estados de los sidebars - SOLO UNO PUEDE ESTAR ACTIVO
  const [contentsOpen, setContentsOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);

  // Estados de accesibilidad
  const [contrast, setContrast] = useState(0);
  const [textSize, setTextSize] = useState(16);
  const [imageScale, setImageScale] = useState(1);
  const [audioSpeed, setAudioSpeed] = useState(1);

  // 2. Función para alternar la narración con manejo de errores
  const toggleNarration = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (narrationOn) {
      audio.pause();
      setNarrationOn(false);
    } else {
      // Verificar si el audio tiene una fuente válida
      if (audio.src && audio.src !== window.location.href) {
        audio.play().catch((error) => {
          console.log("Audio no disponible:", error);
          // No cambiar el estado si hay error
        });
        setNarrationOn(true);
      } else {
        console.log("No hay audio disponible para esta página");
      }
    }
  };

  // 3. Función para cambiar de página con auto-reproducción y manejo de errores
  const handlePageChange = (pageIndex: number) => {
    setCurrent(pageIndex);
    
    // Si la narración está activa, reproducir el audio de la nueva página
    if (narrationOn) {
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio && pages[pageIndex]?.audioUrl) {
          audio.load(); // Recargar el nuevo src
          audio.play().catch((error) => {
            console.log("Audio no disponible para esta página:", error);
            // Mantener la narración activa para la próxima página que sí tenga audio
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

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header en la parte superior */}
      <BookHeader
        title="El Pollito Pito"
        contentsOpen={contentsOpen}
        onToggleContents={toggleContents}
        accessibilityOpen={accessibilityOpen}
        onToggleAccessibility={toggleAccessibility}
      />

      {/* Contenido principal que ocupa el espacio restante */}
      <div className="flex-1 min-h-0">
        <BookReader 
          pages={pages} 
          currentPage={current}
          onChangePage={handlePageChange}
          textSize={textSize} // ✅ Pasar el tamaño del texto
        />
      </div>

      {/* Footer en la parte inferior */}
      <BookFooter
        current={current + 1}
        total={pages.length}
        audioRef={audioRef}
        audioSrc={pages[current]?.audioUrl || ""}
        narrationOn={narrationOn}
        audioSpeed={audioSpeed} // ✅ Pasar velocidad del audio
        onToggleNarration={toggleNarration}
        onSeekPage={handlePageChange}
      />

      {/* Sidebar de Contenidos */}
      {contentsOpen && (
        <Sidebar
          pages={pages}
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
          onContrastChange={setContrast}
          onTextSizeChange={setTextSize}
          onImageScaleChange={setImageScale}
          onAudioSpeedChange={setAudioSpeed}
          onToggleNarration={toggleNarration}
          onClose={() => setAccessibilityOpen(false)}
        />
      )}
    </div>
  );
}