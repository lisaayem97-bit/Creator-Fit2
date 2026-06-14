import React, { useState, useEffect } from "react";
import { PlayCircle, Dumbbell, Calendar, Heart, ArrowRight } from "lucide-react";
import { CreatorBrandingConfig, WorkoutProgram, UserProfile } from "../types";

interface DashboardViewProps {
  branding: CreatorBrandingConfig;
  programs: WorkoutProgram[];
  onNavigate: (tabId: string) => void;
  onStartWorkout: (programId: string, dayIndex: number) => void;
  userProfile: UserProfile;
}

interface HistoricalWorkout {
  id: string;
  name: string;
  duration: string;
  completedAt: string;
}

export default function DashboardView({
  branding,
  programs,
  onNavigate,
  onStartWorkout,
  userProfile,
}: DashboardViewProps) {
  const [workoutHistory, setWorkoutHistory] = useState<HistoricalWorkout[]>([]);

  // Load actual workout history logged locally across active sessions
  useEffect(() => {
    try {
      const stored = localStorage.getItem("creatorfit_workout_history");
      if (stored) {
        setWorkoutHistory(JSON.parse(stored));
      } else {
        // We start with zero pre-seeded fake histories to fulfill USER requirement: 
        // "If no real data exists, Display: 'No workout data available yet.' Do NOT invent numbers."
        setWorkoutHistory([]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Use the first program as the active one
  const activeProgram = programs[0];
  const todayWorkoutDay = activeProgram?.days[0];

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-left font-sans" id="dashboard-view-container">
      {/* Welcome Heading */}
      <div id="welcome-header" className="py-2">
        <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase block">ATHLETE BRIEF</span>
        <h1 className="text-2xl font-black text-white tracking-tight mt-1">
          Welcome, {userProfile.displayName || "Athlete"}
        </h1>
        <p className="text-sm text-zinc-200 mt-1.5 leading-relaxed">
          Select an active program split and launch your workout session.
        </p>
      </div>

      {/* Today's Workout Card with large Start Workout button */}
      {activeProgram && todayWorkoutDay && (
        <div 
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-xl relative overflow-hidden"
          id="today-workout-panel"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/10 blur-3xl rounded-full" />
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-200 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
              NEXT ROUTINE Splitting
            </span>
            <span className="text-[10px] text-zinc-300 font-mono">{activeProgram.frequency}</span>
          </div>

          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            {todayWorkoutDay.name}
          </h3>
          <p className="text-sm text-zinc-200 mt-2 leading-relaxed">
            Target focus: {todayWorkoutDay.target} ({todayWorkoutDay.exercises.length} key movements)
          </p>

          {/* Start Workout Action */}
          <button
            onClick={() => onStartWorkout(activeProgram.id, 0)}
            className="w-full mt-5 bg-white text-zinc-950 hover:bg-zinc-100 font-bold py-3.5 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] border-0 cursor-pointer"
            id="start-workout-action-btn"
          >
            <Dumbbell className="w-4.5 h-4.5" />
            START WORKOUT
          </button>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="space-y-3" id="recent-workouts-area">
        <h4 className="text-[11px] font-mono uppercase text-zinc-300 tracking-wider font-bold">
          RECENT WORKOUT HISTORY
        </h4>

        {workoutHistory.length === 0 ? (
          <div className="p-5 text-center rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs font-mono">
            No workout data available yet.
          </div>
        ) : (
          <div className="space-y-2" id="recent-workouts-list">
            {workoutHistory.slice(0, 3).map((workout) => (
              <div 
                key={workout.id}
                className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-200">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white tracking-wide">{workout.name}</h5>
                    <p className="text-[10px] text-zinc-300 font-mono mt-0.5">{workout.completedAt}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded font-mono">
                  {workout.duration}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Workout Programs */}
      <div className="space-y-3" id="workout-programs-area">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-mono uppercase text-zinc-300 tracking-wider font-bold">
            WORKOUT PROGRAMS
          </h4>
          <button 
            onClick={() => onNavigate("workouts")}
            className="text-[11px] font-mono text-zinc-200 flex items-center gap-0.5 hover:text-white border-0 bg-transparent cursor-pointer font-bold"
          >
            SEE ALL <ArrowRight className="w-3 h-3 text-zinc-200" />
          </button>
        </div>

        <div className="space-y-2.5" id="programs-cards-list">
          {programs.map((program) => (
            <div 
              key={program.id}
              onClick={() => onNavigate("workouts")}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/30 transition-all cursor-pointer flex justify-between items-center group text-left"
            >
              <div className="space-y-1 pr-4 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest block font-bold">
                  {program.difficulty} • {program.durationWeeks} WEEKS
                </span>
                <h5 className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors uppercase leading-normal">
                  {program.title}
                </h5>
                <p className="text-sm text-zinc-300 mt-1 truncate font-sans leading-normal">
                  {program.tagline}
                </p>
              </div>
              <PlayCircle className="w-5 h-5 text-zinc-300 group-hover:text-white shrink-0 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
