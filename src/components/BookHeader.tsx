"use client";
import Link from "next/link";

import ArrowLeft from "@/icons/ArrowLeftIcon";
import ContentIcon from "@/icons/ContentIcon";
import AccessibilityIcon from "@/icons/AccessibilityIcon";
import FullScreenIcon from "@/icons/FullScreenIcon";

interface Props {
  title: string;
  contentsOpen: boolean;
  onToggleContents: () => void;
  accessibilityOpen: boolean;
  onToggleAccessibility: () => void;
}

export default function BookHeader({
  title,
  contentsOpen,
  onToggleContents,
  accessibilityOpen,
  onToggleAccessibility,
}: Props) {
  return (
    <header className="flex items-center justify-between bg-background-50 px-6 pt-7 z-50 relative">
      <Link
        href="/"
        className="group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-600 transition cursor-pointer"
        aria-label="Volver"
      >
        <ArrowLeft className="text-primary-700 group-hover:text-primary-50" />
      </Link>

      <h1 className="font-fredoka text-primary-700 text-3xl">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Contenidos */}
        <button
          onClick={onToggleContents}
          aria-label="Contenidos"
          className={`
            group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full transition cursor-pointer
            ${contentsOpen
              ? "bg-primary-600 hover:bg-primary-700"
              : "bg-primary-50 hover:bg-primary-600"}
          `}
        >
          <ContentIcon
            className={` transition-colors ${
              contentsOpen
                ? "text-primary-50"
                : "text-primary-700 group-hover:text-primary-50"
            }`}
          />
        </button>

        {/* Accesibilidad */}
        <button
          onClick={onToggleAccessibility}
          aria-label="Accesibilidad"
          className={`
            group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full transition cursor-pointer
            ${accessibilityOpen
              ? "bg-primary-600 hover:bg-primary-700"
              : "bg-primary-50 hover:bg-primary-600"}
          `}
        >
          <AccessibilityIcon
            className={`transition-colors ${
              accessibilityOpen
                ? "text-primary-50"
                : "text-primary-700 group-hover:text-primary-50"
            }`}
          />
        </button>

        {/* Pantalla Completa */}
        <button
          className="group shadow-button-header w-11 h-11 flex items-center justify-center rounded-full bg-primary-50 hover:bg-primary-600 transition cursor-pointer"
          aria-label="Pantalla Completa"
        >
          <FullScreenIcon className=" text-primary-700 group-hover:text-primary-50" />
        </button>
      </div>
    </header>
  );
}