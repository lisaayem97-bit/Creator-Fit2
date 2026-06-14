import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Clock, 
  ArrowLeft, 
  Heart,
  Timer,
  Info,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Trophy,
  Dumbbell
} from "lucide-react";
import { WorkoutProgram, WorkoutDay, Exercise } from "../types";
import ExerciseAnimation from "./ExerciseAnimation";

interface WorkoutsViewProps {
  programs: WorkoutProgram[];
  activeWorkout: { programId: string; dayIndex: number } | null;
  onStartWorkout: (programId: string, dayIndex: number) => void;
  onCancelWorkout: () => void;
  onCompleteWorkout: () => void;
}

export default function WorkoutsView({
  programs,
  activeWorkout,
  onStartWorkout,
  onCancelWorkout,
  onCompleteWorkout,
}: WorkoutsViewProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || "");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null); // For routine structure preview before starting
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  
  // Sets completion tracking
  const [checkedSets, setCheckedSets] = useState<{ [key: string]: boolean }>({});
  const [setWeights, setSetWeights] = useState<{ [key: string]: string }>({});
  
  // Timer states
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerMax, setTimerMax] = useState<number>(60);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const selectedProgram = programs.find(p => p.id === selectedProgramId) || programs[0];

  // Sync state when entering active guided workout mode
  useEffect(() => {
    if (activeWorkout) {
      setActiveExerciseIndex(0);
      setCheckedSets({});
      setSetWeights({});
      setTimerSecondsLeft(0);
      setTimerActive(false);
      setShowSuccess(false);
    }
  }, [activeWorkout]);

  // Handle timer countdown
  useEffect(() => {
    let interval: any;
    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && timerActive) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSecondsLeft]);

  const startTimer = (seconds: number) => {
    setTimerMax(seconds);
    setTimerSecondsLeft(seconds);
    setTimerActive(true);
  };

  const handleToggleSet = (exId: string, setIdx: number, defaultRestStr: string) => {
    const key = `${exId}-${setIdx}`;
    const wasChecked = !!checkedSets[key];
    const newState = !wasChecked;
    
    setCheckedSets(prev => ({ ...prev, [key]: newState }));
    
    // Auto start rest timer on completion of any set
    if (newState) {
      const numericRest = parseInt(defaultRestStr) || 60;
      startTimer(numericRest);
    }
  };

  const handleWeightChange = (exId: string, setIdx: number, val: string) => {
    setSetWeights(prev => ({ ...prev, [`${exId}-${setIdx}`]: val }));
  };

  // ----------------------------------------------------
  // CASE 1: CELEBRATION / WORKOUT COMPLETED SUCCESS SCREEN
  // ----------------------------------------------------
  if (showSuccess && activeWorkout) {
    const program = programs.find(p => p.id === activeWorkout.programId) || programs[0];
    const day = program.days[activeWorkout.dayIndex];

    const confirmCompletionAndSave = () => {
      try {
        const storedHistory = localStorage.getItem("creatorfit_workout_history");
        const history = storedHistory ? JSON.parse(storedHistory) : [];
        const newRecord = {
          id: `hist-${Date.now()}`,
          name: day.name,
          duration: day.duration,
          completedAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        };
        localStorage.setItem("creatorfit_workout_history", JSON.stringify([newRecord, ...history]));

        // Increment user completed workout count
        const userStr = localStorage.getItem("creatorfit_session_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.completedWorkoutsCount = (user.completedWorkoutsCount || 0) + 1;
          user.workoutStreak = (user.workoutStreak || 0) + 1;
          localStorage.setItem("creatorfit_session_user", JSON.stringify(user));
        }
      } catch (e) {
        console.warn(e);
      }

      setShowSuccess(false);
      setCheckedSets({});
      setSetWeights({});
      onCompleteWorkout();
    };

    return (
      <div className="py-6 px-5 space-y-6 text-center animate-fade-in text-left font-sans" id="success-view">
        <div className="inline-flex p-4 rounded-full bg-zinc-900 border border-zinc-800 text-white mx-auto shadow-xl">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">WORKOUT COMPLETE</h2>
          <p className="text-xs text-zinc-300 font-mono tracking-widest uppercase">
            {day.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center" id="metrics-summary">
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <span className="text-[10px] text-zinc-300 uppercase block font-mono">Movements</span>
            <span className="text-base text-white font-black block mt-1">{day.exercises.length} Logged</span>
          </div>
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <span className="text-[10px] text-zinc-300 uppercase block font-mono">Time Target</span>
            <span className="text-base text-white font-black block mt-1">{day.duration}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 text-left">
          <h4 className="text-sm font-bold text-white uppercase flex items-center gap-1.5 font-mono mb-2">
            <Sparkles className="w-4 h-4 text-zinc-100" />
            Coach Notes
          </h4>
          <p className="text-[13px] text-zinc-100 font-medium leading-relaxed font-sans">
            "Outstanding execution today! Ensure you consume ample water, refuel with proper nutrient-dense whole foods within an hour, and secure deep sleep tonight to optimize recovery and physical adaptations."
          </p>
        </div>

        <button
          onClick={confirmCompletionAndSave}
          className="w-full py-4 rounded-xl text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer shadow-xl text-center border-0"
          id="confirm-session-close"
        >
          LOG WORKOUT & EXIT
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 2: ACTIVE GUIDED WORKOUT EXECUTION MODE (ONE AT A TIME)
  // ----------------------------------------------------
  if (activeWorkout) {
    const program = programs.find(p => p.id === activeWorkout.programId) || programs[0];
    const day = program.days[activeWorkout.dayIndex];
    const totalExercises = day.exercises.length;
    const currentEx = day.exercises[activeExerciseIndex];

    if (!currentEx) return null; // Safe fallback

    return (
      <div className="space-y-6 px-5 pt-4 pb-24 animate-fade-in text-left font-sans" id="guided-workout-player">
        
        {/* Dynamic header step indicator */}
        <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 block">
              GUIDED SESSION
            </span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wide truncate max-w-[200px]">
              {day.name}
            </h3>
          </div>
          <button 
            onClick={onCancelWorkout}
            className="text-[10px] font-mono font-bold text-red-400 bg-red-950/20 px-2.5 py-1.5 rounded-lg hover:bg-red-900/10 cursor-pointer border-0"
          >
            CANCEL
          </button>
        </div>

        {/* Guided Step Sequence Marker */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-xs font-mono">
            <span className="text-zinc-200 font-bold">
              EXERCISE {activeExerciseIndex + 1} OF {totalExercises}
            </span>
            <span className="text-zinc-300 text-[10px]">
              {Math.round(((activeExerciseIndex + 1) / totalExercises) * 100)}% Done
            </span>
          </div>
          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-300" 
              style={{ width: `${((activeExerciseIndex + 1) / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* Redesigned 1: Exercise Name & Unique Media Placeholder */}
        <div className="space-y-3">
          <div>
            <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest block font-bold mb-0.5">
              CURRENT FOCUS
            </span>
            <h4 className="text-lg font-black text-white uppercase tracking-wide">
              {currentEx.name}
            </h4>
            <span className="text-xs text-zinc-400 font-semibold font-mono">
              TARGET: {currentEx.muscleGroup}
            </span>
          </div>

          <ExerciseAnimation exerciseId={currentEx.id} exerciseName={currentEx.name} />
        </div>

        {/* Redesigned 2 & 3: Sets, Reps & Rest Period Metrics */}
        <div className="grid grid-cols-2 gap-3" id="active-meta-tiles">
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase font-mono tracking-wider">Prescribed Volume</span>
            <span className="text-xs text-white font-bold block mt-1 font-mono">
              {currentEx.sets} Sets × {currentEx.reps} Reps
            </span>
          </div>
          <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl">
            <span className="text-[10px] text-zinc-400 block uppercase font-mono tracking-wider font-bold">Prescribed Rest</span>
            <span className="text-xs text-white font-bold block mt-1 font-mono">
              {currentEx.rest || "60s"}
            </span>
          </div>
        </div>

        {/* Dynamic Log & Set Check-off Sheet */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3" id="guided-set-list">
          <h5 className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-bold">
            SET-BY-SET LOGGING Checkbox
          </h5>
          <div className="divide-y divide-zinc-900 font-mono text-xs">
            {Array.from({ length: currentEx.sets }).map((_, sIdx) => {
              const setKey = `${currentEx.id}-${sIdx}`;
              const isChecked = !!checkedSets[setKey];
              const loggedWeight = setWeights[setKey] || "";

              return (
                <div key={sIdx} className="py-2.5 flex justify-between items-center gap-3">
                  <span className="text-zinc-200 font-bold text-[10px] uppercase w-12">Set {sIdx + 1}</span>
                  <span className="text-zinc-300 text-[10px] w-14">{currentEx.reps} reps</span>
                  
                  {/* Real gym weight input */}
                  <div className="flex-1 flex justify-end">
                    <input 
                      type="number" 
                      placeholder="Weight" 
                      value={loggedWeight}
                      onChange={(e) => handleWeightChange(currentEx.id, sIdx, e.target.value)}
                      className="w-16 bg-zinc-900 border border-zinc-800 text-[11px] py-1 text-center font-bold text-white rounded focus:border-zinc-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-300 ml-1 self-center">lbs</span>
                  </div>

                  {/* Touch checkbox */}
                  <button
                    onClick={() => handleToggleSet(currentEx.id, sIdx, currentEx.rest)}
                    className={`w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer ${
                      isChecked ? "bg-white border-white text-zinc-950" : "border-zinc-800 hover:border-zinc-700 bg-transparent text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simple Rest Timer Widget Widget */}
        <div 
          className={`p-4 rounded-xl border transition-all ${
            timerSecondsLeft > 0 
              ? "border-zinc-300 bg-zinc-900/50" 
              : "border-zinc-800 bg-zinc-950/40"
          }`}
          id="active-rest-counter"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-zinc-300" />
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-300">REST TIMER</span>
                {timerSecondsLeft > 0 ? (
                  <h5 className="text-sm font-bold font-mono text-white leading-none mt-0.5">
                    {Math.floor(timerSecondsLeft / 60)}:{(timerSecondsLeft % 60).toString().padStart(2, "0")} remaining
                  </h5>
                ) : (
                  <h5 className="text-[11px] text-zinc-200 mt-0.5 font-bold">Idle. Check a set to rest.</h5>
                )}
              </div>
            </div>

            {timerSecondsLeft > 0 && (
              <button 
                onClick={() => setTimerSecondsLeft(0)}
                className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-mono text-[9px] font-bold border-0 cursor-pointer"
              >
                SKIP REST
              </button>
            )}
          </div>
        </div>

        {/* Redesigned 4: Instructions */}
        <div className="space-y-2.5 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
            Instructions
          </h5>
          <ol className="list-decimal pl-5 text-[13px] text-zinc-100 font-medium space-y-3 leading-relaxed">
            {currentEx.instructions.map((inst, i) => (
              <li key={i} className="pl-1 leading-relaxed text-zinc-100">{inst}</li>
            ))}
          </ol>
        </div>

        {/* Redesigned 5: Common Mistakes */}
        <div className="space-y-2.5 p-4 rounded-xl border border-zinc-800 bg-zinc-950">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-red-405 font-bold">
            Common Mistakes
          </h5>
          <ul className="list-disc pl-5 text-[13px] text-zinc-200 font-medium space-y-3 leading-relaxed">
            {currentEx.mistakes.map((mistake, i) => (
              <li key={i} className="marker:text-red-500 pl-1 leading-relaxed text-zinc-200">{mistake}</li>
            ))}
          </ul>
        </div>

        {/* Redesigned 6: Creator Notes */}
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 text-left">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-white font-bold not-italic mb-2">
            Coach Lisa's Notes
          </h5>
          <p className="text-[13px] text-zinc-100 font-medium leading-relaxed font-sans pl-1">
            "{currentEx.coachingNotes}"
          </p>
        </div>

        {/* Bottom Guided Step controls */}
        <div className="grid grid-cols-2 gap-3 pt-2" id="guided-player-navigation">
          <button
            onClick={() => setActiveExerciseIndex(prev => prev - 1)}
            disabled={activeExerciseIndex === 0}
            className="py-4 rounded-xl border border-zinc-800 text-xs font-mono font-bold hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-20 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous Exercise
          </button>

          {activeExerciseIndex < totalExercises - 1 ? (
            <button
              onClick={() => setActiveExerciseIndex(prev => prev + 1)}
              className="py-4 rounded-xl bg-white text-zinc-950 text-xs font-mono font-bold hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 border-0"
              id="guided-next-exercise-btn"
            >
              Next Exercise <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setShowSuccess(true)}
              className="py-4 rounded-xl bg-white text-zinc-950 text-xs font-mono font-bold hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 border-0"
              id="guided-finish-btn"
            >
              Finish Workout <Trophy className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  }
  // ----------------------------------------------------
  // CASE 3: INDIVIDUAL DAY PRE_WORKOUT PROGRAM DETAIL PAGE
  // ----------------------------------------------------
  if (selectedDayIndex !== null) {
    const day = selectedProgram.days[selectedDayIndex];
    return (
      <div className="space-y-6 pb-20 animate-fade-in text-left font-sans" id="program-day-preview-page">
        {/* Navigation back */}
        <button 
          onClick={() => setSelectedDayIndex(null)}
          className="p-1 px-2.5 text-xs text-zinc-200 hover:text-white flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to splits
        </button>

        {/* Title */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase block">SPLIT SESSION DETAILS</span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1 leading-normal uppercase">
            {day.name.includes(":") ? day.name.split(":")[1] : day.name}
          </h2>
          <p className="text-sm text-zinc-200 mt-1.5 leading-relaxed">
            Target Focus: {day.target} (Est. Duration: {day.duration})
          </p>
        </div>

        {/* Workout Structure Listing */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-bold">
            Routine Structure
          </h3>
          <div className="space-y-2.5" id="preview-exercise-list">
            {day.exercises.map((ex, idx) => (
              <div 
                key={ex.id}
                className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950/40 flex justify-between items-center text-xs"
              >
                <div className="flex gap-3 items-center">
                  <span className="w-5 h-5 rounded-full bg-zinc-900 flex items-center justify-center text-[9px] text-zinc-200 font-mono font-bold">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white tracking-wide">{ex.name}</h5>
                    <p className="text-[10px] text-zinc-300 font-sans mt-0.5">{ex.muscleGroup}</p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-200 font-mono font-semibold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  {ex.sets} Sets × {ex.reps} Reps
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Large Prominent START WORKOUT button */}
        <button
          onClick={() => {
            onStartWorkout(selectedProgram.id, selectedDayIndex);
            setSelectedDayIndex(null);
          }}
          className="w-full mt-4 py-4 rounded-xl text-xs font-mono font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all cursor-pointer shadow-xl text-center flex items-center justify-center gap-2 border-0"
          id="day-pre-start-workout-btn"
        >
          <Dumbbell className="w-4.5 h-4.5" />
          START {day.name.includes(":") ? day.name.split(":")[1].toUpperCase() : day.name.toUpperCase()} NOW
        </button>
      </div>
    );
  }

  // ----------------------------------------------------
  // CASE 4: LOBBY / GENERAL WORKOUT PROGRAM DIRECT STATS
  // ----------------------------------------------------
  return (
    <div className="space-y-6 pb-20 animate-fade-in text-left font-sans" id="workouts-catalog-lobby">
      <div>
        <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase block">TRAINING LOOPS</span>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1">PROGRAMS</h2>
        <p className="text-sm text-zinc-200 mt-1.5 leading-relaxed">
          Select an active creator program split and view correct layout routines.
        </p>
      </div>

      {/* Program selector pills */}
      <div className="flex gap-2 border-b border-zinc-900 pb-3 overflow-x-auto scrollbar-none" id="program-selector-row">
        {programs.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProgramId(p.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer border-0 ${
              selectedProgramId === p.id 
                ? "bg-white text-zinc-950 shadow" 
                : "bg-zinc-900 text-zinc-200 hover:text-white"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Selected Program Core Meta details Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-5 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide uppercase">{selectedProgram.title}</h3>
          <p className="text-sm text-zinc-200 mt-1.5 leading-relaxed font-sans">{selectedProgram.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-zinc-800 text-center font-mono">
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase">Duration</span>
            <span className="text-xs text-white font-black block mt-0.5">{selectedProgram.durationWeeks} Weeks</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase">Frequency</span>
            <span className="text-xs text-white font-black block mt-0.5 truncate">{selectedProgram.frequency}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 block uppercase">Difficulty</span>
            <span className="text-xs text-white font-black block mt-0.5 truncate">{selectedProgram.difficulty}</span>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider">Creator Instinct Notes</h4>
          <p className="text-[13px] text-zinc-100 font-medium leading-relaxed font-sans mt-2 pl-1">
            "{selectedProgram.creatorNotes}"
          </p>
        </div>
      </div>

      {/* Everyday routines split within this program */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider font-bold">
          Program Routines
        </h4>
        <div className="space-y-2.5" id="lobby-workout-days">
          {selectedProgram.days.map((day, dIdx) => (
            <div 
              key={day.id}
              onClick={() => setSelectedDayIndex(dIdx)} // Opens the detailed pre-workout routine preview page!
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/20 transition-all cursor-pointer flex justify-between items-center group text-left"
            >
              <div className="space-y-1 pr-4">
                <span className="text-[9px] text-zinc-300 font-mono tracking-wider">SPLIT {dIdx + 1}</span>
                <h5 className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors uppercase leading-normal">
                  {day.name.includes(":") ? day.name.split(":")[1] : day.name}
                </h5>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed line-clamp-1">
                  Focus: {day.target}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-300 font-mono font-medium">{day.duration}</span>
                <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
