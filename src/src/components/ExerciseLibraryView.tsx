import React, { useState } from "react";
import { Search, ChevronRight, Play, Trophy, Shield, HelpCircle, BarChart2, Dumbbell } from "lucide-react";
import { Exercise } from "../types";

interface ExerciseLibraryViewProps {
  exerciseLibrary: Exercise[];
}

export default function ExerciseLibraryView({ exerciseLibrary }: ExerciseLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("All");
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(exerciseLibrary[0]?.id || null);

  const muscles = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms"];

  const filteredExercises = exerciseLibrary.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "All" || ex.muscleGroup.toLowerCase().includes(selectedMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  const activeExercise = exerciseLibrary.find(e => e.id === activeExerciseId) || exerciseLibrary[0];

  // Map YouTube Links as clean external references (100% reliable - no fragile embeds)
  const getYoutubeUrlAndCategory = (id: string, name: string): { url: string; category: string } => {
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

    return { url: "https://www.youtube.com", category: "general" };
  };

  // High-fidelity graphic visualization vectors representing the target group
  const renderMuscleBadgeImage = (category: string) => {
    const classStyle = "w-24 h-24 text-white opacity-95";
    switch (category) {
      case "chest":
        return (
          <svg className={classStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 24C16 28 22 30 32 30C42 30 48 28 52 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 10V30" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" />
            <rect x="18" y="18" width="10" height="8" rx="2" fill="currentColor" opacity="0.30" stroke="currentColor" strokeWidth="1.5" />
            <rect x="36" y="18" width="10" height="8" rx="2" fill="currentColor" opacity="0.30" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M6 34H58" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          </svg>
        );
      case "back":
        return (
          <svg className={classStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 14V48" stroke="currentColor" strokeWidth="2.5" />
            <path d="M16 18C22 22 26 26 32 26C38 26 42 22 48 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 24C18 30 24 38 32 40M50 24C46 30 40 38 32 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="currentColor" opacity="0.15" />
            <circle cx="32" cy="10" r="3.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "legs":
        return (
          <svg className={classStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 20V50M42 20V50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="20" y="24" width="6" height="16" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
            <rect x="38" y="24" width="6" height="16" rx="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1" />
            <circle cx="32" cy="14" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "shoulders":
        return (
          <svg className={classStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 24C14 20 22 18 32 18C42 18 50 20 54 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="13" cy="23" r="4.5" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="51" cy="23" r="4.5" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="32" cy="11" r="3.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "arms":
        return (
          <svg className={classStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 24C20 24 24 20 32 20C40 20 44 24 50 24" stroke="currentColor" strokeWidth="2" />
            <path d="M10 24C10 32 14 36 14 36M54 24C54 32 50 36 50 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <rect x="8" y="25" width="5" height="10" rx="2.5" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1" />
            <rect x="51" y="25" width="5" height="10" rx="2.5" fill="currentColor" opacity="0.35" stroke="currentColor" strokeWidth="1" />
            <circle cx="32" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      case "core":
        return (
          <svg className={classStyle} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="22" width="14" height="24" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="28" y1="28" x2="36" y2="28" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <line x1="28" y1="34" x2="36" y2="34" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <line x1="28" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <circle cx="32" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
          </svg>
        );
      default:
        return <Dumbbell className="w-12 h-12 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-left font-sans" id="exercise-library-section">
      
      {/* Title block */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase block">LIBRARY</span>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">EXERCISES</h2>
        <p className="text-sm text-zinc-200 mt-1.5 leading-relaxed">
          Select any exercise below to view professional execution parameters, target areas, and demonstration guides.
        </p>
      </div>

      {/* Touch-optimized search */}
      <div className="relative" id="library-search-bar">
        <span className="absolute inset-y-0 left-3 flex items-center pr-3 pointer-events-none text-zinc-300">
          <Search className="w-4 h-4" />
        </span>
        <input 
          type="search"
          placeholder="Search exercise..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-500 font-sans"
        />
      </div>

      {/* Muscle selector tags */}
      <div className="flex gap-2 min-w-full overflow-x-auto pb-1 scrollbar-none" id="muscle-tags-row">
        {muscles.map(muscle => (
          <button
            key={muscle}
            onClick={() => {
              setSelectedMuscle(muscle);
              const matching = exerciseLibrary.find(e => muscle === "All" || e.muscleGroup.includes(muscle));
              if (matching) {
                setActiveExerciseId(matching.id);
              }
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-0 ${
              selectedMuscle === muscle 
                ? "bg-white text-zinc-950 font-bold" 
                : "bg-zinc-900 text-zinc-200 hover:text-white"
            }`}
          >
            {muscle}
          </button>
        ))}
      </div>

      {/* Simple, Strict, Multi-Row Clean Layout Active Selected Exercise Representation */}
      {activeExercise && (() => {
        const { url: youtubeUrl, category } = getYoutubeUrlAndCategory(activeExercise.id, activeExercise.name);

        return (
          <div className="space-y-6 pt-2 border-t border-zinc-900" id={`active-exercise-display-${activeExercise.id}`}>
            
            {/* 1. EXERCISE NAME */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                {activeExercise.name}
              </h3>
            </div>

            {/* 2. EXERCISE IMAGE (Polished graphic illustration element) */}
            <div 
              className="w-full rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 flex flex-col items-center justify-center min-h-[160px] relative shadow-inner overflow-hidden"
              id="exercise-illustration-frame"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.025),transparent)] pointer-events-none" />
              {renderMuscleBadgeImage(category)}
              <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase mt-2">
                Mechanical Schematic Label
              </span>
            </div>

            {/* 3. TARGET MUSCLES */}
            <div className="space-y-1.5 font-sans">
              <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block">
                Target Muscles
              </span>
              <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-white font-bold font-mono">
                  {activeExercise.muscleGroup}
                </span>
              </div>
            </div>

            {/* 4. SETS, REPS, REST TIME */}
            <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <span className="text-[10px] text-zinc-200 block uppercase font-bold">SETS</span>
                <span className="text-base text-white font-black block mt-0.5">{activeExercise.sets}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <span className="text-[10px] text-zinc-200 block uppercase font-bold">REPS</span>
                <span className="text-base text-white font-black block mt-0.5">{activeExercise.reps}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
                <span className="text-[10px] text-zinc-200 block uppercase font-bold">REST</span>
                <span className="text-sm text-white font-black block mt-1">{activeExercise.rest}</span>
              </div>
            </div>

            {/* 5. INSTRUCTIONS */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-white tracking-wider font-bold block">
                Instructions
              </span>
              <ol className="list-decimal pl-5 text-[13px] text-zinc-100 font-semibold space-y-3 leading-relaxed font-sans">
                {activeExercise.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1 text-zinc-100 font-medium leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* 6. COMMON MISTAKES */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-red-400 tracking-wider font-bold block">
                Common Mistakes
              </span>
              <ul className="list-disc pl-5 text-[13px] text-zinc-200 font-semibold space-y-3 leading-relaxed font-sans">
                {activeExercise.mistakes.map((mistake, idx) => (
                  <li key={idx} className="marker:text-red-500 pl-1 text-zinc-200 font-medium leading-relaxed">
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>

            {/* 7. WATCH DEMONSTRATION BUTTON */}
            <div className="pt-2">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl text-xs font-mono font-bold text-black bg-white hover:bg-zinc-100 flex items-center justify-center gap-2 border-0 shadow-xl select-none tracking-wider text-center cursor-pointer transition-all active:scale-[0.98]"
                id="watch-demo-link"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                WATCH DEMONSTRATION
              </a>
            </div>

          </div>
        );
      })()}

      {/* Select interactive sheet underneath listing all available movements */}
      <div className="space-y-3 pt-6 border-t border-zinc-900 text-left">
        <h4 className="text-[11px] font-mono uppercase text-zinc-300 tracking-wider font-bold">
          Alternate Movements
        </h4>
        <div className="space-y-2" id="catalog-list">
          {filteredExercises.map(ex => (
            <div 
              key={ex.id}
              onClick={() => {
                setActiveExerciseId(ex.id);
              }}
              className={`p-3.5 rounded-xl flex justify-between items-center cursor-pointer transition-all border ${
                activeExerciseId === ex.id 
                  ? "bg-zinc-900 border-zinc-800 text-white" 
                  : "bg-zinc-900/20 border-zinc-900/60 text-zinc-200 hover:text-white"
              }`}
            >
              <div>
                <span className="text-xs font-bold block leading-snug text-white">{ex.name}</span>
                <span className="text-[10px] text-zinc-300 block font-mono mt-0.5">{ex.muscleGroup}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </div>
          ))}
          {filteredExercises.length === 0 && (
            <p className="text-xs text-zinc-300 py-3 text-center font-mono">No matching exercises found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
