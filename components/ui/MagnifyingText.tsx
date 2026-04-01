"use client";

import { useRef, useEffect, useState } from "react";

interface MagnifyingTextProps {
  text: string;
  className?: string;
}

const MagnifyingText = ({ text, className = "" }: MagnifyingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const magnifyRadius = 80;
    const zoomLevel = 1.5;

    const drawMagnifyingGlass = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isHovering) return;

      const { x, y } = mousePos;

      // Get the text element
      const textElement = container.querySelector("p");
      if (!textElement) return;

      // Draw magnifying glass circle
      ctx.save();

      // Create clipping region for circle
      ctx.beginPath();
      ctx.arc(x, y, magnifyRadius, 0, Math.PI * 2);
      ctx.clip();

      // Get text position and size
      const rect = textElement.getBoundingClientRect();
      const textX = rect.left;
      const textY = rect.top;
      const textWidth = rect.width;
      const textHeight = rect.height;

      // Draw magnified content
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-x, -y);

      // Draw semi-transparent background
      ctx.fillStyle = "rgba(139, 92, 246, 0.1)";
      ctx.fillRect(textX - 100, textY - 50, textWidth + 200, textHeight + 100);

      // Draw the text (we'll use the actual DOM text)
      ctx.font = window.getComputedStyle(textElement).font;
      ctx.fillStyle = "#8b5cf6";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, textX + textWidth / 2, textY + textHeight / 2);

      ctx.restore();
      ctx.restore();

      // Draw magnifying glass border
      ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, magnifyRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw magnifying glass shine
      const gradient = ctx.createLinearGradient(
        x - magnifyRadius,
        y - magnifyRadius,
        x + magnifyRadius,
        y + magnifyRadius,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, magnifyRadius, 0, Math.PI * 2);
      ctx.fill();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      drawMagnifyingGlass();
      requestAnimationFrame(animate);
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousemove", handleMouseMove);

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHovering, mousePos, text]);

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 40,
        }}
      />
      <p className={className}>{text}</p>
    </div>
  );
};

export default MagnifyingText;
