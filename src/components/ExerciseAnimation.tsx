import React from "react";
import { Play, Dumbbell, Shield, Info } from "lucide-react";

interface ExerciseAnimationProps {
  exerciseId: string;
  exerciseName: string;
}

export default function ExerciseAnimation({ exerciseId, exerciseName }: ExerciseAnimationProps) {
  // Safe normalization mapping for YouTube Links (No fragile embedding required)
  const getYoutubeUrlAndClass = (id: string, name: string): { url: string; category: string } => {
    const combined = `${id} ${name}`.toLowerCase();
    
    if (combined.includes("bench press")) {
      return { url: "https://www.youtube.com/watch?v=rT7DgCr-3pg", category: "chest" };
    }
    if (combined.includes("incline dumbbell press") || combined.includes("incline db")) {
      return { url: "https://www.youtube.com/watch?v=8iPEnn-ltC8", category: "chest" };
    }
    if (combined.includes("barbell squat") || combined.includes("squat")) {
      return { url: "https://www.youtube.com/watch?v=ultWZbUMPL8", category: "legs" };
    }
    if (combined.includes("romanian deadlift") || combined.includes("rdl")) {
      return { url: "https://www.youtube.com/watch?v=2SHsk9AzdjA", category: "legs" };
    }
    if (combined.includes("deadlift")) {
      return { url: "https://www.youtube.com/watch?v=op9kVnSso6Q", category: "back" };
    }
    if (combined.includes("pull up") || combined.includes("pull-up")) {
      return { url: "https://www.youtube.com/watch?v=eGo4IYlbE5g", category: "back" };
    }
    if (combined.includes("lat pulldown")) {
      return { url: "https://www.youtube.com/watch?v=CAwf7n6Luuc", category: "back" };
    }
    if (combined.includes("seated cable row")) {
      return { url: "https://www.youtube.com/watch?v=GZbfZ033f74", category: "back" };
    }
    if (combined.includes("barbell row") || combined.includes("bent-over row") || combined.includes("bent over row")) {
      return { url: "https://www.youtube.com/watch?v=vT2GjY_Umpw", category: "back" };
    }
    if (combined.includes("overhead press") || combined.includes("ohp") || combined.includes("military press")) {
      return { url: "https://www.youtube.com/watch?v=2yjwXTZQDDI", category: "shoulders" };
    }
    if (combined.includes("lateral raise")) {
      return { url: "https://www.youtube.com/watch?v=3VcKaXpzqRo", category: "shoulders" };
    }
    if (combined.includes("tricep pushdown") || combined.includes("triceps pushdown")) {
      return { url: "https://www.youtube.com/watch?v=2-LAMcpzODU", category: "arms" };
    }
    if (combined.includes("barbell curl")) {
      return { url: "https://www.youtube.com/watch?v=kwG2ipFRgfo", category: "arms" };
    }
    if (combined.includes("hammer curl")) {
      return { url: "https://www.youtube.com/watch?v=zC3nLlEvin4", category: "arms" };
    }
    if (combined.includes("leg press")) {
      return { url: "https://www.youtube.com/watch?v=IZxyjW7MPJQ", category: "legs" };
    }
    if (combined.includes("leg extension")) {
      return { url: "https://www.youtube.com/watch?v=YyvSfVjQeL0", category: "legs" };
    }
    if (combined.includes("calf raise")) {
      return { url: "https://www.youtube.com/watch?v=-M4-G8p8fmc", category: "legs" };
    }
    if (combined.includes("crunch")) {
      return { url: "https://www.youtube.com/watch?v=Xyd_fa5zoEU", category: "core" };
    }
    if (combined.includes("plank")) {
      return { url: "https://www.youtube.com/watch?v=ASdvN_XEl_c", category: "core" };
    }

    // Default Fallback links
    return { url: "https://www.youtube.com", category: "general" };
  };

  const { url: youtubeUrl, category } = getYoutubeUrlAndClass(exerciseId, exerciseName);

  // Dynamic schematic SVG rendering matching each specific muscle group 
  // Looks spectacular and matches premium coaching setups with high contrast
  const renderMuscleSchematic = () => {
    switch (category) {
      case "chest":
        return (
          <svg className="w-20 h-20 text-white opacity-95" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 24C16 28 22 30 32 30C42 30 48 28 52 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 10V30" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
            <rect x="18" y="18" width="10" height="8" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
            <rect x="36" y="18" width="10" height="8" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M6 34H58" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          </svg>
        );
      case "back":
        return (
          <svg className="w-20 h-20 text-white opacity-95" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 14V48" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16 18C22 22 26 26 32 26C38 26 42 22 48 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            {/* Lats */}
            <path d="M14 24C18 30 24 38 32 40M50 24C46 30 40 38 32 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" opacity="0.15" />
            <circle cx="32" cy="10" r="3.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "legs":
        return (
          <svg className="w-20 h-20 text-white opacity-95" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 20V50M42 20V50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Quads schematic highlight */}
            <path d="M18 24C18 36 21 42 21 42M46 24C46 36 43 42 43 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="20" y="24" width="6" height="16" rx="2" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1" />
            <rect x="38" y="24" width="6" height="16" rx="2" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1" />
            <circle cx="32" cy="14" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "shoulders":
        return (
          <svg className="w-20 h-20 text-white opacity-95" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 24C14 20 22 18 32 18C42 18 50 20 54 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            {/* Deltoids badges */}
            <circle cx="13" cy="23" r="4.5" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="51" cy="23" r="4.5" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="11" r="3.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "arms":
        return (
          <svg className="w-20 h-20 text-white opacity-95" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 24C20 24 24 20 32 20C40 20 44 24 50 24" stroke="currentColor" strokeWidth="2" />
            {/* Biceps/Triceps indicators */}
            <path d="M10 24C10 32 14 36 14 36M54 24C54 32 50 36 50 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect x="8" y="25" width="5" height="10" rx="2.5" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1" />
            <rect x="51" y="25" width="5" height="10" rx="2.5" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="1" />
            <circle cx="32" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "core":
        return (
          <svg className="w-20 h-20 text-white opacity-95" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="22" width="14" height="24" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
            {/* Six pack layout lines */}
            <line x1="28" y1="28" x2="36" y2="28" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="28" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="28" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.6" />
            <line x1="32" y1="24" x2="32" y2="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1 1" opacity="0.5" />
            <circle cx="32" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      default:
        return (
          <Dumbbell className="w-16 h-16 text-zinc-100 animate-pulse" />
        );
    }
  };

  return (
    <div 
      className="w-full relative rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 flex flex-col items-center text-center shadow-lg transition-transform hover:scale-[1.01]"
      id={`exercise-card-container-${exerciseId}`}
    >
      {/* Absolute category badge */}
      <div className="absolute top-3 left-4 bg-zinc-800/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-700/50 flex items-center gap-1.5 select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-300 uppercase">
          {category} Target
        </span>
      </div>

      {/* Athletic Muscular Mapping Display */}
      <div 
        className="my-4 min-h-[110px] flex items-center justify-center relative w-full"
        id={`illustration-display-${exerciseId}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)] pointer-events-none rounded-full" />
        {renderMuscleSchematic()}
      </div>

      {/* Dynamic Information Footer Overlay */}
      <div className="w-full space-y-4">
        <div className="text-left bg-zinc-900/40 rounded-xl px-4 py-2.5 border border-zinc-800/60 inline-flex items-start gap-2.5 w-full">
          <Info className="w-4 h-4 text-zinc-200 mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-200 leading-normal">
            This exercise is optimized for athletic mechanical tension to failure. Tap the button to watch the live-action YouTube coaching guide in high-def format.
          </p>
        </div>

        {/* Large, Beautiful touch target for external demonstration play */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-5 rounded-xl text-xs font-mono font-bold text-black bg-white hover:bg-zinc-200 hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-2 border-0 shadow-lg select-none tracking-wider transition-all"
          id={`watch-video-btn-${exerciseId}`}
        >
          <Play className="w-4 h-4 fill-current shrink-0" />
          WATCH DEMONSTRATION
        </a>
      </div>
    </div>
  );
}
