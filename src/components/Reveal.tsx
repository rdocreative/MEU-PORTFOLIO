"use client";

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number; // em segundos
  className?: string;
  variant?: "fade-up" | "fade" | "zoom";
}

export const Reveal = ({ 
  children, 
  width = "fit-content", 
  delay = 0,
  className = "",
  variant = "fade-up"
}: RevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Desconecta após a primeira animação para não repetir
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  const getTransform = () => {
    if (variant === "fade-up") return "translateY(20px)";
    if (variant === "zoom") return "scale(0.95)";
    return "none";
  };

  return (
    <div 
      ref={ref} 
      style={{ 
        width,
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : getTransform(),
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
      }}
      className={className}
    >
      {children}
    </div>
  );
};