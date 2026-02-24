"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import AnimatedNavigationTabsDemo from '../navbar';

// --- Interfaces & Constants ---

export interface Project {
  id: string;
  image: string;
  title: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200";

// --- Internal Components ---

interface ProjectCardProps {
  image: string;
  title: string;
  delay: number;
  isVisible: boolean;
  index: number;
  totalCount: number;
  onClick: () => void;
  isSelected: boolean;
}

const ProjectCard = forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ image, title, delay, isVisible, index, totalCount, onClick, isSelected }, ref) => {
    const middleIndex = (totalCount - 1) / 2;
    const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
    
    const rotation = factor * 25; 
    const translationX = factor * 85; 
    const translationY = Math.abs(factor) * 12;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-20 h-28 cursor-pointer group/card",
          isSelected && "opacity-0",
        )}
        style={{
          transform: isVisible
            ? `translateY(calc(-100px + ${translationY}px)) translateX(${translationX}px) rotate(${rotation}deg) scale(1)`
            : "translateY(0px) translateX(0px) rotate(0deg) scale(0.4)",
          opacity: isSelected ? 0 : isVisible ? 1 : 0,
          transition: `all 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
          zIndex: 10 + index,
          left: "-40px",
          top: "-56px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className={cn(
          "w-full h-full rounded-lg overflow-hidden shadow-xl bg-card border border-white/5 relative",
          "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "group-hover/card:-translate-y-6 group-hover/card:shadow-2xl group-hover/card:shadow-accent/40 group-hover/card:ring-2 group-hover/card:ring-accent group-hover/card:scale-125"
        )}>
          <img 
            src={image || PLACEHOLDER_IMAGE} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-black uppercase tracking-tighter text-white truncate drop-shadow-md">
            {title}
          </p>
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

interface ImageLightboxProps {
  projects: Project[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  sourceRect: DOMRect | null;
  onCloseComplete?: () => void;
  onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  projects,
  currentIndex,
  isOpen,
  onClose,
  sourceRect,
  onCloseComplete,
  onNavigate,
}) => {
  const [animationPhase, setAnimationPhase] = useState<"initial" | "animating" | "complete">("initial");
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isSliding, setIsSliding] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalProjects = projects.length;
  const hasNext = internalIndex < totalProjects - 1;
  const hasPrev = internalIndex > 0;
  const currentProject = projects[internalIndex];

  useEffect(() => {
    if (isOpen && currentIndex !== internalIndex && !isSliding) {
      setIsSliding(true);
      const timer = setTimeout(() => {
        setInternalIndex(currentIndex);
        setIsSliding(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isOpen, internalIndex, isSliding]);

  useEffect(() => {
    if (isOpen) {
      setInternalIndex(currentIndex);
      setIsSliding(false);
    }
  }, [isOpen, currentIndex]);

  const navigateNext = useCallback(() => {
    if (internalIndex >= totalProjects - 1 || isSliding) return;
    onNavigate(internalIndex + 1);
  }, [internalIndex, totalProjects, isSliding, onNavigate]);

  const navigatePrev = useCallback(() => {
    if (internalIndex <= 0 || isSliding) return;
    onNavigate(internalIndex - 1);
  }, [internalIndex, isSliding, onNavigate]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    onClose();
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      setAnimationPhase("initial");
      onCloseComplete?.();
    }, 500);
  }, [onClose, onCloseComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") navigateNext();
      if (e.key === "ArrowLeft") navigatePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose, navigateNext, navigatePrev]);

  useLayoutEffect(() => {
    if (isOpen && sourceRect) {
      setShouldRender(true);
      setAnimationPhase("initial");
      setIsClosing(false);
      
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
        return () => cancelAnimationFrame(frame2);
      });
      
      const timer = setTimeout(() => {
        setAnimationPhase("complete");
      }, 700);
      
      return () => {
        cancelAnimationFrame(frame1);
        clearTimeout(timer);
      };
    }
  }, [isOpen, sourceRect]);

  const handleDotClick = (idx: number) => {
    if (isSliding || idx === internalIndex) return;
    onNavigate(idx);
  };

  if (!shouldRender || !currentProject) return null;

  const getInitialStyles = (): React.CSSProperties => {
    if (!sourceRect) return {};
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const targetWidth = Math.min(1000, viewportWidth - 64);
    const targetHeight = Math.min(viewportHeight * 0.85, 750);
    const targetX = (viewportWidth - targetWidth) / 2;
    const targetY = (viewportHeight - targetHeight) / 2;
    const scaleX = sourceRect.width / targetWidth;
    const scaleY = sourceRect.height / targetHeight;
    const scale = Math.max(scaleX, scaleY);
    const translateX = sourceRect.left + sourceRect.width / 2 - (targetX + targetWidth / 2) + window.scrollX;
    const translateY = sourceRect.top + sourceRect.height / 2 - (targetY + targetHeight / 2) + window.scrollY;
    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      opacity: 0.5,
      borderRadius: "12px",
    };
  };

  const getFinalStyles = (): React.CSSProperties => ({
    transform: "translate(0, 0) scale(1)",
    opacity: 1,
    borderRadius: "24px",
  });

  const currentStyles = (animationPhase === "initial" && !isClosing) ? getInitialStyles() : getFinalStyles();

  return (
    <div
      className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8")}
      onClick={handleClose}
      style={{
        opacity: isClosing ? 0 : 1,
        transition: "opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="absolute inset-0 bg-white/95 backdrop-blur-3xl"
        style={{
          opacity: (animationPhase === "initial" && !isClosing) ? 0 : 1,
          transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      
      {/* Lightbox Buttons - Specifically fixed to be visible (Black on Light Theme) */}
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className="absolute top-8 right-8 z-[110] w-14 h-14 flex items-center justify-center rounded-full bg-black shadow-2xl text-white hover:scale-110 active:scale-95 transition-all duration-300"
        style={{
          opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(-30px)",
          transition: "opacity 400ms ease-out 400ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 400ms",
        }}
        aria-label="Close"
      >
        <X className="w-6 h-6" strokeWidth={3} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); navigatePrev(); }}
        disabled={!hasPrev || isSliding}
        className="absolute left-6 md:left-12 z-[110] w-16 h-16 flex items-center justify-center rounded-full bg-black shadow-2xl text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasPrev ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(-40px)",
          transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
        }}
      >
        <ChevronLeft className="w-8 h-8" strokeWidth={3} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); navigateNext(); }}
        disabled={!hasNext || isSliding}
        className="absolute right-6 md:right-12 z-[110] w-16 h-16 flex items-center justify-center rounded-full bg-black shadow-2xl text-white hover:scale-110 active:scale-95 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none"
        style={{
          opacity: animationPhase === "complete" && !isClosing && hasNext ? 1 : 0,
          transform: animationPhase === "complete" && !isClosing ? "translateX(0)" : "translateX(40px)",
          transition: "opacity 400ms ease-out 600ms, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 600ms",
        }}
      >
        <ChevronRight className="w-8 h-8" strokeWidth={3} />
      </button>

      <div
        ref={containerRef}
        className="relative z-[105] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          ...currentStyles,
          transform: isClosing ? "translate(0, 0) scale(0.92)" : currentStyles.transform,
          transition: animationPhase === "initial" && !isClosing ? "none" : "transform 800ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms ease-out, border-radius 800ms ease",
          transformOrigin: "center center",
        }}
      >
        <div className="relative overflow-hidden rounded-[inherit] bg-white border border-black/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
          <div className="relative overflow-hidden aspect-[4/3] md:aspect-[16/10]">
            <div
              className="flex w-full h-full"
              style={{
                transform: `translateX(-${internalIndex * 100}%)`,
                transition: isSliding ? "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)" : "none",
              }}
            >
              {projects.map((project, idx) => (
                <div key={project.id} className="min-w-full h-full relative">
                  <img
                    src={project.image || PLACEHOLDER_IMAGE}
                    alt={project.title}
                    className="w-full h-full object-contain bg-gray-50 select-none"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            className="px-10 py-8 bg-white border-t border-black/5"
            style={{
              opacity: animationPhase === "complete" && !isClosing ? 1 : 0,
              transform: animationPhase === "complete" && !isClosing ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 500ms ease-out 500ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 500ms",
            }}
          >
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-3xl font-black text-black tracking-tighter truncate uppercase">{currentProject?.title}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 rounded-full border border-black/5">
                    {projects.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDotClick(idx)}
                        className={cn("w-2 h-2 rounded-full transition-all duration-500", idx === internalIndex ? "bg-black scale-125" : "bg-black/10 hover:bg-black/30")}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-black/40">{internalIndex + 1} / {totalProjects}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white bg-black hover:scale-105 active:scale-95 rounded-2xl shadow-xl transition-all duration-300">
                <span>View Trip</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnimatedFolderProps {
  title: string;
  projects: Project[];
  className?: string;
  gradient?: string;
}

export const AnimatedFolder: React.FC<AnimatedFolderProps> = ({ title, projects, className, gradient }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);
  const [hiddenCardId, setHiddenCardId] = useState<string | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previewProjects = projects.slice(0, 5);

  const handleProjectClick = (project: Project, index: number) => {
    const cardEl = cardRefs.current[index];
    if (cardEl) setSourceRect(cardEl.getBoundingClientRect());
    setSelectedIndex(index);
    setHiddenCardId(project.id);
  };

  const handleCloseLightbox = () => { setSelectedIndex(null); setSourceRect(null); };
  const handleCloseComplete = () => { setHiddenCardId(null); };
  const handleNavigate = (newIndex: number) => { setSelectedIndex(newIndex); setHiddenCardId(projects[newIndex]?.id || null); };

  const backBg = gradient || "linear-gradient(135deg, #eee 0%, #ddd 100%)";
  const tabBg = gradient || "#ccc";
  const frontBg = gradient || "linear-gradient(135deg, #fff 0%, #eee 100%)";

  return (
    <>
      <div
        className={cn("relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer bg-white border border-black/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:shadow-black/5 hover:border-black/10 group", className)}
        style={{ minWidth: "280px", minHeight: "320px", perspective: "1200px", transform: isHovered ? "scale(1.04) rotate(-1.5deg)" : "scale(1) rotate(0deg)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="absolute inset-0 rounded-2xl transition-opacity duration-700"
          style={{ background: gradient ? `radial-gradient(circle at 50% 70%, ${gradient.match(/#[a-fA-F0-9]{3,6}/)?.[0] || '#000'} 0%, transparent 70%)` : "radial-gradient(circle at 50% 70%, #000 0%, transparent 70%)", opacity: isHovered ? 0.05 : 0 }}
        />
        <div className="relative flex items-center justify-center mb-4" style={{ height: "160px", width: "200px" }}>
          <div className="absolute w-32 h-24 rounded-lg shadow-md border border-black/5" style={{ background: backBg, filter: gradient ? "brightness(0.9)" : "none", transformOrigin: "bottom center", transform: isHovered ? "rotateX(-20deg) scaleY(1.05)" : "rotateX(0deg) scaleY(1)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />
          <div className="absolute w-12 h-4 rounded-t-md border-t border-x border-black/5" style={{ background: tabBg, filter: gradient ? "brightness(0.85)" : "none", top: "calc(50% - 48px - 12px)", left: "calc(50% - 64px + 16px)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(-30deg) translateY(-3px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 10 }} />
          <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 20 }}>
            {previewProjects.map((project, index) => (
              <ProjectCard key={project.id} ref={(el) => { cardRefs.current[index] = el; }} image={project.image} title={project.title} delay={index * 50} isVisible={isHovered} index={index} totalCount={previewProjects.length} onClick={() => handleProjectClick(project, index)} isSelected={hiddenCardId === project.id} />
            ))}
          </div>
          <div className="absolute w-32 h-24 rounded-lg shadow-lg border border-black/10" style={{ background: frontBg, top: "calc(50% - 48px + 4px)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 30 }} />
          <div className="absolute w-32 h-24 rounded-lg overflow-hidden pointer-events-none" style={{ top: "calc(50% - 48px + 4px)", background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)", transformOrigin: "bottom center", transform: isHovered ? "rotateX(35deg) translateY(12px)" : "rotateX(0deg) translateY(0)", transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)", zIndex: 31 }} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black text-black mt-4 transition-all duration-500 uppercase tracking-tighter" style={{ transform: isHovered ? "translateY(2px)" : "translateY(0)" }}>{title}</h3>
          <p className="text-xs font-bold text-black/40 transition-all duration-500 uppercase tracking-widest" style={{ opacity: isHovered ? 0.8 : 1 }}>{projects.length} Photos</p>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 transition-all duration-500" style={{ opacity: isHovered ? 0 : 1, transform: isHovered ? "translateY(10px)" : "translateY(0)" }}>
          <span>Explore</span>
        </div>
      </div>
      <ImageLightbox projects={projects} currentIndex={selectedIndex ?? 0} isOpen={selectedIndex !== null} onClose={handleCloseLightbox} sourceRect={sourceRect} onCloseComplete={handleCloseComplete} onNavigate={handleNavigate} />
    </>
  );
};

// --- Portfolio Data & Main App ---

const portfolioData = [
  {
    title: "Agra",
    gradient: "linear-gradient(135deg, #FF9933, #FFFFFF)",
    projects: [
      { id: "a1", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200", title: "Taj Mahal" },
      { id: "a2", image: "https://images.unsplash.com/photo-1585135497273-1a85b09fe707?auto=format&fit=crop&q=80&w=1200", title: "Agra Fort" },
      { id: "a3", image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200", title: "Mehtab Bagh" },
    ] as Project[]
  },
  {
    title: "Jaipur",
    gradient: "linear-gradient(135deg, #FF6666, #FF9999)",
    projects: [
      { id: "j1", image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1200", title: "Hawa Mahal" },
      { id: "j2", image: "https://images.unsplash.com/photo-1590716202319-867438ec18bd?auto=format&fit=crop&q=80&w=1200", title: "Amer Fort" },
      { id: "j3", image: "https://images.unsplash.com/photo-1592923985423-34e8f3b25bb7?auto=format&fit=crop&q=80&w=1200", title: "Jal Mahal" },
    ] as Project[]
  },
  {
    title: "Kerala",
    gradient: "linear-gradient(135deg, #134E5E, #71B280)",
    projects: [
      { id: "k1", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200", title: "Alleppey Backwaters" },
      { id: "k2", image: "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&q=80&w=1200", title: "Munnar Tea Gardens" },
      { id: "k3", image: "https://images.unsplash.com/photo-1590050752117-23a9d7fc2048?auto=format&fit=crop&q=80&w=1200", title: "Varkala Beach" },
    ] as Project[]
  },
  {
    title: "Ladakh",
    gradient: "linear-gradient(135deg, #4CA1AF, #C4E0E5)",
    projects: [
      { id: "l1", image: "https://images.unsplash.com/photo-1626082896492-766af4eb6501?auto=format&fit=crop&q=80&w=1200", title: "Pangong Tso" },
      { id: "l2", image: "https://images.unsplash.com/photo-1549410141-86315570889f?auto=format&fit=crop&q=80&w=1200", title: "Leh City" },
      { id: "l3", image: "https://images.unsplash.com/photo-1620029584288-6617942646f8?auto=format&fit=crop&q=80&w=1200", title: "Ladakh Ranges" },
    ] as Project[]
  },
  {
    title: "Goa",
    gradient: "linear-gradient(135deg, #2193b0, #6dd5ed)",
    projects: [
      { id: "g1", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200", title: "Palolem Beach" },
      { id: "g2", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=1200", title: "Old Goa Church" },
      { id: "g3", image: "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&q=80&w=1200", title: "Dudhsagar Falls" },
    ] as Project[]
  },
  {
    title: "Varanasi",
    gradient: "linear-gradient(135deg, #614385, #516395)",
    projects: [
      { id: "v1", image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&q=80&w=1200", title: "Dashashwamedh Ghat" },
      { id: "v2", image: "https://images.unsplash.com/photo-1597081416712-4299b9fd49aa?auto=format&fit=crop&q=80&w=1200", title: "Ganga Aarti" },
      { id: "v3", image: "https://images.unsplash.com/photo-1598977123118-4e30ba3c4f5b?auto=format&fit=crop&q=80&w=1200", title: "Sarnath Stupa" },
    ] as Project[]
  }
];

export default function App() {
  return (
    <main className="min-h-screen bg-white text-black transition-colors duration-500 selection:bg-black/10 selection:text-black">
      <AnimatedNavigationTabsDemo />
      <div className="max-w-7xl mx-auto pt-24 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-black">
          Travel <span className="italic text-black/20">Gallery</span>
        </h1>
        <p className="text-black/60 text-xl font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Relive your favorite memories. Explore your trip albums and capture the spirit of adventure.
        </p>
      </div>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
          {portfolioData.map((folder, index) => (
            <div 
              key={folder.title} 
              className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700" 
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <AnimatedFolder 
                title={folder.title} 
                projects={folder.projects} 
                gradient={folder.gradient}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
