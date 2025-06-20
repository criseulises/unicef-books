"use client";
import { useState } from "react";
import BookHeader from "components/BookHeader";
import BookReader, { BookPage } from "components/BookReader";
import BookFooter from "components/BookFooter";
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
      videoMp4Url: "/videos/pollito-senas-1.mp4",    },
    {
      id: 2,
      imageUrl: "/images/pollito/pagina2.jpg",
      text: "El pollito Pito encontró una fruta deliciosa",
      textPosition: { top: "15%", left: "10%" },
      textBgColor: "#647411",
      videoWebmUrl: "/videos/pollito-senas-1.webm",
      videoMp4Url: "/videos/pollito-senas-1.mp4",
    },
    // … más páginas si las hay …
  ];

  const [current, setCurrent] = useState(0);
  const [showContents, setShowContents] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      <BookHeader
        title="El Pollito Pito"
        contentsOpen={showContents}
        onToggleContents={() => setShowContents((v) => !v)}
      />

      <div className="flex-1 relative">
        <BookReader
          pages={pages}
          onChangePage={(i) => setCurrent(i)}
        />

        {showContents && (
          <Sidebar
            pages={pages.map((p) => ({ id: p.id, title: p.text.split("\n")[0] }))}
            currentPage={current}
            onSelectPage={(i) => {
              setCurrent(i);
              setShowContents(false);
            }}
            onClose={() => setShowContents(false)}
          />
        )}
      </div>

      <BookFooter
        current={current + 1}
        total={pages.length}
        audioSrc={`/audios/Pollito Pito_Pagina${current + 1}.wav`}
        onSeekPage={(i) => setCurrent(i)}
      />
    </div>
  );
}
