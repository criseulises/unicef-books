// src/app/books/el-pollito-pito/reading/page.tsx

"use client";                                 // ← add this!

import { useState } from "react";
import BookHeader from "@/components/BookHeader";
import BookReader, { BookPage } from "@/components/BookReader";
import BookFooter   from "@/components/BookFooter";

export default function ReadingPage() {
  const pages: BookPage[] = [
    {
      id: 1,
      imageUrl:    "/images/pollito/pagina1.jpg",
      text:        "El pollito pito\nNosotros somos en el parque\nTomando todo",
      textPosition:{ top: "10%", left: "5%" },
      textBgColor: "#647411",
      // we’ll change these next…
      videoWebmUrl: "/videos/pollito-senas-1.webm",
      videoMp4Url:  "/videos/pollito-senas-1.mp4",
    },
    {
      id: 2,
      imageUrl:    "/images/pollito/pagina2.jpg",
      text:        "El pollito Pito encontró una fruta deliciosa",
      textPosition:{ top: "15%", left: "10%" },
      textBgColor: "#647411",
      videoWebmUrl: "/videos/pollito-senas-1.webm",
      videoMp4Url:  "/videos/pollito-senas-1.mp4",
    },
  ];

  const [current, setCurrent] = useState(0);

  return (
    <div className="h-screen flex flex-col bg-background">
      <BookHeader title="El Pollito Pito" />
      <BookReader
        pages={pages}
        onChangePage={(idx) => setCurrent(idx)}
      />
      <BookFooter
        current={current + 1}
        total={pages.length}
        audioSrc={`/audios/Pollito Pito_Pagina${current + 1}.wav`}
        onSeekPage={(idx) => setCurrent(idx)}
      />
    </div>
  );
}