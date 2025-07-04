// src/components/AccessibilitySidebar.tsx
"use client";
import React from "react";
import { Volume2Icon, ImageIcon, RotateCcwIcon } from "lucide-react";
import { CONTRAST_OPTIONS } from '@/hooks/useContrast';

interface Props {
  contrast: number; // 0..4
  textSize: number;
  imageScale: number;
  audioSpeed: number;
  narrationOn: boolean;
  isDefaultView: boolean;
  onContrastChange: (level: number) => void;
  onTextSizeChange: (n: number) => void;
  onImageScaleChange: (s: number) => void;
  onAudioSpeedChange: (s: number) => void;
  onToggleNarration: () => void;
  onResetToDefault: () => void;
  onClose: () => void;
}

export default function AccessibilitySidebar({
  contrast,
  textSize,
  imageScale,
  audioSpeed,
  narrationOn,
  isDefaultView,
  onContrastChange,
  onTextSizeChange,
  onImageScaleChange,
  onAudioSpeedChange,
  onToggleNarration,
  onResetToDefault,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-40 flex pt-0">
      {/* fondo semitransparente */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      <aside className="relative ml-auto w-80 h-full bg-white contrast-card-bg shadow-2xl p-6 overflow-auto animate-in slide-in-from-right duration-300">
        
        {/* Espacio para los iconos del header */}
        <div className="h-16 mb-4"></div>
        
        {/* Título */}
        <h2 className="text-xl text-blue-600 contrast-primary mb-6">
          Opciones de Lectura
        </h2>

        {/* 🔥 INDICADOR DE MODO ACTUAL */}
        <div className="mb-6 p-3 rounded-lg bg-blue-50 contrast-hover border border-blue-200 contrast-border">
          <div className="flex items-center justify-between">
            <span className="text-blue-600 contrast-primary font-medium text-sm">
              Modo actual:
            </span>
            <span className={`font-medium text-sm px-2 py-1 rounded ${
              isDefaultView 
                ? 'bg-green-100 text-green-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {isDefaultView ? 'Vista Fija' : 'Navegación'}
            </span>
          </div>
        </div>

        {/* ✅ CONTRASTE MEJORADO CON ESTILOS REDONDOS */}
        <section className="mb-6">
          <label className="block text-blue-600 contrast-primary font-medium mb-3">
            Contraste
          </label>
          
          {/* Botones redondos con estilos correctos */}
          <div className="flex items-center justify-between space-x-2">
            {CONTRAST_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => onContrastChange(i)}
                className={`
                  w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all font-medium text-sm duration-200 transform
                  ${i === contrast 
                    ? "border-blue-600 ring-2 ring-blue-200 scale-105 shadow-md" 
                    : "border-gray-300 hover:border-blue-400 hover:scale-102"}
                  ${i === 0 ? 'bg-white text-blue-600' : ''}
                  ${i === 1 ? 'bg-yellow-500 text-black' : ''}
                  ${i === 2 ? 'bg-black text-white' : ''}
                  ${i === 3 ? 'bg-gray-500 text-white' : ''}
                  ${i === 4 ? 'bg-green-400 text-white' : ''}
                `}
                title={opt.description || opt.name}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          {/* Nombre del tema actual */}
          <div className="text-center mt-3">
            <span className="text-xs text-gray-600 contrast-text bg-gray-100 contrast-hover px-3 py-1 rounded-full">
              {CONTRAST_OPTIONS[contrast]?.name || 'Normal'}
            </span>
          </div>
        </section>

        {/* 🔥 TAMAÑO DE TEXTO ACTUALIZADO */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-blue-600 contrast-primary font-medium">Tamaño del Texto</label>
            <span className="text-blue-600 contrast-primary font-medium text-sm">{textSize}px</span>
          </div>
          
          <div className="flex items-center mb-3">
            <span className="text-blue-600 contrast-primary text-lg mr-3 min-w-[2rem]">Aa</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={24}
                max={48}
                value={textSize}
                onChange={(e) => onTextSizeChange(+e.target.value)}
                className="w-full h-2 bg-gray-200 contrast-border rounded-full appearance-none slider"
                style={{
                  background: `linear-gradient(to right, var(--contrast-primary, #3b82f6) 0%, var(--contrast-primary, #3b82f6) ${((textSize - 24) / (48 - 24)) * 100}%, var(--contrast-border, #e5e7eb) ${((textSize - 24) / (48 - 24)) * 100}%, var(--contrast-border, #e5e7eb) 100%)`
                }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => onTextSizeChange(Math.max(24, textSize - 2))}
              className="px-4 py-2 rounded-lg bg-gray-100 contrast-hover text-gray-600 contrast-text flex items-center justify-center text-lg font-medium transition-colors"
            >
              −
            </button>
            <button
              onClick={() => onTextSizeChange(Math.min(48, textSize + 2))}
              className="px-4 py-2 rounded-lg bg-gray-100 contrast-hover text-gray-600 contrast-text flex items-center justify-center text-lg font-medium transition-colors"
            >
              +
            </button>
          </div>
        </section>

        {/* Velocidad de Audio */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-blue-600 contrast-primary font-medium">Velocidad del Audio</label>
            <span className="text-blue-600 contrast-primary font-medium text-sm">{audioSpeed.toFixed(1)}×</span>
          </div>
          
          <div className="flex items-center mb-3">
            <Volume2Icon className="w-5 h-5 text-blue-600 contrast-primary mr-3 min-w-[1.25rem]" />
            <div className="flex-1 relative">
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={audioSpeed}
                onChange={(e) => onAudioSpeedChange(+e.target.value)}
                className="w-full h-2 bg-gray-200 contrast-border rounded-full appearance-none slider"
                style={{
                  background: `linear-gradient(to right, var(--contrast-primary, #3b82f6) 0%, var(--contrast-primary, #3b82f6) ${((audioSpeed - 0.5) / (2 - 0.5)) * 100}%, var(--contrast-border, #e5e7eb) ${((audioSpeed - 0.5) / (2 - 0.5)) * 100}%, var(--contrast-border, #e5e7eb) 100%)`
                }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => onAudioSpeedChange(Math.max(0.5, audioSpeed - 0.1))}
              className="px-4 py-2 rounded-lg bg-gray-100 contrast-hover text-gray-600 contrast-text flex items-center justify-center text-lg font-medium transition-colors"
            >
              −
            </button>
            <button
              onClick={() => onAudioSpeedChange(Math.min(2, audioSpeed + 0.1))}
              className="px-4 py-2 rounded-lg bg-gray-100 contrast-hover text-gray-600 contrast-text flex items-center justify-center text-lg font-medium transition-colors"
            >
              +
            </button>
          </div>
        </section>

        {/* 🔥 TAMAÑO DE IMAGEN CON BOTÓN DEFAULT */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-blue-600 contrast-primary font-medium">Tamaño de la Imagen</label>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 contrast-primary font-medium text-sm">{imageScale.toFixed(1)}×</span>
              <button
                onClick={onResetToDefault}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition ${
                  isDefaultView 
                    ? 'bg-green-100 text-green-700 border border-green-300' 
                    : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
                }`}
                disabled={isDefaultView}
              >
                <RotateCcwIcon className="w-3 h-3" />
                <span>Default</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center mb-3">
            <ImageIcon className="w-5 h-5 text-blue-600 contrast-primary mr-3 min-w-[1.25rem]" />
            <div className="flex-1 relative">
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={imageScale}
                onChange={(e) => onImageScaleChange(+e.target.value)}
                className="w-full h-2 bg-gray-200 contrast-border rounded-full appearance-none slider"
                style={{
                  background: `linear-gradient(to right, var(--contrast-primary, #3b82f6) 0%, var(--contrast-primary, #3b82f6) ${((imageScale - 0.5) / (2 - 0.5)) * 100}%, var(--contrast-border, #e5e7eb) ${((imageScale - 0.5) / (2 - 0.5)) * 100}%, var(--contrast-border, #e5e7eb) 100%)`
                }}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => onImageScaleChange(Math.max(0.5, imageScale - 0.1))}
              className="px-4 py-2 rounded-lg bg-gray-100 contrast-hover text-gray-600 contrast-text flex items-center justify-center text-lg font-medium transition-colors"
            >
              −
            </button>
            <button
              onClick={() => onImageScaleChange(Math.min(2, imageScale + 0.1))}
              className="px-4 py-2 rounded-lg bg-gray-100 contrast-hover text-gray-600 contrast-text flex items-center justify-center text-lg font-medium transition-colors"
            >
              +
            </button>
          </div>

          {/* 🔥 DESCRIPCIÓN DEL MODO */}
          <div className="mt-3 p-2 rounded bg-gray-50 contrast-hover text-xs text-gray-600 contrast-text">
            {isDefaultView ? (
              <span>📌 Vista fija centrada. Cambia el zoom para entrar en modo navegación.</span>
            ) : (
              <span>🔍 Modo navegación activo. Puedes hacer scroll para explorar la imagen ampliada.</span>
            )}
          </div>
        </section>

        {/* Narración */}
        <section>
          <button
            onClick={onToggleNarration}
            className={`w-full rounded-lg p-4 text-center transition-colors duration-200 ${
              narrationOn 
                ? "bg-green-50 hover:bg-green-100 contrast-hover" 
                : "bg-gray-50 hover:bg-gray-100 contrast-hover"
            }`}
          >
            <span className="text-gray-700 contrast-text font-medium">
              Narración de Audio: 
            </span>
            <span className={`font-medium ml-1 ${narrationOn ? "text-green-500" : "text-gray-500 contrast-text"}`}>
              {narrationOn ? "Activa" : "Inactiva"}
            </span>
          </button>
        </section>
      </aside>
    </div>
  );
}