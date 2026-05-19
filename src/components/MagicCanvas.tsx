/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Eraser, Paintbrush, Download, Trash2 } from "lucide-react";
import { MagicButton } from "./MagicButton";
import { cn } from "@/src/lib/utils";

export const MagicCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#F472B6");
  const [brushSize, setBrushSize] = useState(10);

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
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
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

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
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
        <div className="flex gap-2">
          {["#F472B6", "#38BDF8", "#4ADE80", "#FACC15", "#FB923C", "#000000"].map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-10 h-10 rounded-full border-4 transition-transform",
                color === c ? "scale-125 border-slate-800" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex gap-4">
          <input 
            type="range" 
            min="2" 
            max="50" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32 accent-brand-orange"
          />
          <button onClick={clearCanvas} className="p-3 bg-slate-100 rounded-full hover:bg-brand-pink/20 transition-colors">
            <Trash2 size={24} />
          </button>
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
        className="w-full h-[400px] md:h-[500px] border-4 border-dashed border-slate-200 rounded-2xl cursor-crosshair touch-none"
      />
      
      <div className="mt-6 flex justify-center">
        <MagicButton variant="orange" icon={Paintbrush}>Salva il tuo Capolavoro!</MagicButton>
      </div>
    </div>
  );
};
