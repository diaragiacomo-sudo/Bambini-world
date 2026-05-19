/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { motion } from "motion/react";
import { Eraser, Paintbrush, Download, Trash2 } from "lucide-react";
import { MagicButton } from "./MagicButton";
import { cn } from "@/src/lib/utils";

export const MagicCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#F472B6");
  const [brushSize, setBrushSize] = useState(10);
  const [template, setTemplate] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (template) {
      const img = new Image();
      img.src = template;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [template]);

  const startDrawing = (e: ReactMouseEvent | ReactTouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath(); // Reset path
    }
  };

  const draw = (e: ReactMouseEvent | ReactTouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-brand-orange/20">
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {["#F472B6", "#38BDF8", "#4ADE80", "#FACC15", "#FB923C", "#000000"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-10 h-10 rounded-full border-4 transition-transform hover:scale-110",
                color === c ? "scale-125 border-slate-800" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-slate-100 p-2 rounded-2xl">
            {[
              { id: 'none', label: 'Vuoto', icon: '🎨' },
              { id: 'https://images.unsplash.com/photo-1627163439134-7a8c47ee8020?q=80&w=400&h=250&auto=format&fit=crop', label: 'Farfalla', icon: '🦋' },
              { id: 'https://images.unsplash.com/photo-1444464666168-49d633b86747?q=80&w=400&h=250&auto=format&fit=crop', label: 'Uccellino', icon: '🐦' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id === 'none' ? null : t.id)}
                className={cn(
                  "px-3 py-1 rounded-xl text-sm font-bold transition-all",
                  (t.id === 'none' ? !template : template === t.id) 
                    ? "bg-white shadow-sm text-slate-800 scale-105" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input 
              type="range" 
              min="2" 
              max="50" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 md:w-32 accent-brand-orange"
            />
            <button onClick={clearCanvas} title="Pulisci tutto" className="p-3 bg-slate-100 rounded-full hover:bg-red-50 text-red-500 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="w-full h-[400px] md:h-[500px] bg-white border-4 border-dashed border-slate-200 rounded-2xl cursor-crosshair touch-none shadow-inner"
      />
      
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <MagicButton 
          variant="orange" 
          icon={Download} 
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const link = document.createElement('a');
            link.download = 'capolavoro.png';
            link.href = canvas.toDataURL();
            link.click();
          }}
        >
          Salva il tuo Capolavoro!
        </MagicButton>
      </div>
    </div>
  );
};
