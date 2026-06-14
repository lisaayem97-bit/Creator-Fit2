import React, { useState, useEffect } from "react";
import { Scale, Calendar, CheckCircle2, Flame, LogOut, Trash2 } from "lucide-react";
import { UserProfile } from "../types";

interface ProgressViewProps {
  userProfile?: UserProfile;
  onLogWeight?: (weight: number) => void;
}

interface HistoricalWorkout {
  id: string;
  name: string;
  duration: string;
  completedAt: string;
}

export default function ProgressView({ userProfile, onLogWeight }: ProgressViewProps) {
  const [newWeight, setNewWeight] = useState("");
  const [showLogWeight, setShowLogWeight] = useState(false);
  const [workoutHistory, setWorkoutHistory] = useState<HistoricalWorkout[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load history dynamically
  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem("creatorfit_workout_history");
        if (stored) {
          setWorkoutHistory(JSON.parse(stored));
        } else {
          setWorkoutHistory([]);
        }
      } catch (e) {
        console.warn(e);
      }
    };
    loadHistory();
  }, [userProfile?.completedWorkoutsCount]);

  // Handle logging weight
  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const numericWeight = Number(newWeight);
    if (!isNaN(numericWeight) && numericWeight > 0) {
      if (onLogWeight) {
        onLogWeight(numericWeight);
      }
      setNewWeight("");
      setShowLogWeight(false);
    }
  };

  // Logout reset helper
  const handleLogout = () => {
    localStorage.removeItem("creatorfit_session_user");
    window.location.reload();
  };

  // Reset entire account stats helper
  const handleResetData = () => {
    try {
      localStorage.removeItem("creatorfit_workout_history");
      const userStr = localStorage.getItem("creatorfit_session_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.completedWorkoutsCount = 0;
        user.workoutStreak = 0;
        localStorage.setItem("creatorfit_session_user", JSON.stringify(user));

        // Sync with persistent users list
        const storedUsersRaw = localStorage.getItem("creatorfit_users");
        if (storedUsersRaw) {
          const usersList = JSON.parse(storedUsersRaw);
          const emailToFind = user.email ? user.email.toLowerCase() : "";
          const foundIdx = usersList.findIndex((u: any) => u.email.toLowerCase() === emailToFind);
          if (foundIdx !== -1) {
            usersList[foundIdx].profile = {
              ...usersList[foundIdx].profile,
              completedWorkoutsCount: 0,
              workoutStreak: 0
            };
            localStorage.setItem("creatorfit_users", JSON.stringify(usersList));
          }
        }
      }
      window.location.reload();
    } catch (e) {
      console.warn(e);
    }
  };

  const displayName = userProfile?.displayName || "Athlete";
  const currentWeight = userProfile?.currentWeight || 175;
  const targetWeight = userProfile?.targetWeight || 170;
  const completedCount = userProfile?.completedWorkoutsCount || 0;
  const currentStreak = userProfile?.workoutStreak || 0;

  return (
    <div className="space-y-6 pb-20 animate-fade-in text-left font-sans" id="profile-view-section">
      {/* Header Profile Title */}
      <div>
        <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-300 uppercase block">CLIENT ACCOUNT</span>
        <h2 className="text-xl font-bold tracking-tight text-white mt-1 font-sans">MY PROFILE</h2>
        <p className="text-sm text-zinc-200 mt-1.5 leading-relaxed">
          Review your personal weight, direct training statistics, and logged sessions.
        </p>
      </div>

      {/* User Card */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex justify-between items-center" id="profile-hero-card">
        <div>
          <h3 className="text-base font-bold text-white tracking-wide">{displayName}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{userProfile?.email || "No email registered"}</p>
        </div>
        
        <button
          onClick={() => setShowLogWeight(!showLogWeight)}
          className="px-3.5 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl transition-all cursor-pointer font-bold flex items-center border-0 text-xs shadow-md"
          id="btn-log-weight-trigger"
        >
          <Scale className="w-4 h-4 mr-1.5" />
          LOG WEIGHT
        </button>
      </div>

      {/* Weight Target Indicators */}
      <div className="grid grid-cols-2 gap-3" id="profile-weights-grid">
        <div className="p-3.5 bg-zinc-900/20 border border-zinc-800 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider">Current Weight</span>
          <span className="text-base font-black text-white block mt-0.5 font-mono">{currentWeight} lbs</span>
        </div>
        <div className="p-3.5 bg-zinc-900/20 border border-zinc-800 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider">Target Weight</span>
          <span className="text-base font-black text-white block mt-0.5 font-mono">{targetWeight} lbs</span>
        </div>
      </div>

      {/* Interactive Weight logger dialog */}
      {showLogWeight && (
        <form 
          onSubmit={handleAddWeight}
          className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/95 flex gap-3 items-end animate-slide-up"
          id="log-weight-form"
        >
          <div className="flex-1 space-y-1.5 text-left">
            <label className="text-[10px] text-zinc-200 uppercase font-mono tracking-wider">Update Current Weight (lbs)</label>
            <input 
              type="number"
              step="0.1"
              required
              placeholder="e.g. 175.5"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold rounded-lg cursor-pointer transition-all border-0 h-9"
            id="weight-submit-btn"
          >
            UPDATE
          </button>
        </form>
      )}

      {/* Completed Lift summary statistics cards */}
      <div className="grid grid-cols-2 gap-3" id="profile-summary-stats">
        <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider">Completed Lifts</span>
          <div className="flex items-center gap-1.5 mt-2 text-white">
            <CheckCircle2 className="w-4.5 h-4.5 text-white" />
            <span className="text-lg font-black font-mono leading-none">{completedCount}</span>
            <span className="text-[10px] text-zinc-300 font-sans font-medium">Sessions</span>
          </div>
        </div>

        <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider">Training Streak</span>
          <div className="flex items-center gap-1.5 mt-2 text-white">
            <Flame className="w-4.5 h-4.5 text-white" />
            <span className="text-lg font-black font-mono leading-none">{currentStreak}</span>
            <span className="text-[10px] text-zinc-300 font-sans font-medium">Days</span>
          </div>
        </div>
      </div>

      {/* Completed History List */}
      <div className="space-y-3" id="workout-history-panel">
        <h4 className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider font-bold">Logged Workout History</h4>
        
        {workoutHistory.length === 0 ? (
          <div className="p-5 text-center rounded-xl border border-zinc-800 text-zinc-300 text-xs font-mono bg-zinc-950">
            No workout data available yet.
          </div>
        ) : (
          <div className="space-y-2" id="history-list-rows">
            {workoutHistory.map(hist => (
              <div 
                key={hist.id}
                className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-between"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white tracking-wide">{hist.name}</h5>
                    <p className="text-[10px] text-zinc-300 font-mono mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-300" />
                      {hist.completedAt}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-200 bg-zinc-900 px-2 py-0.5 rounded">
                  {hist.duration}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div className="space-y-3 pt-4 border-t border-zinc-800" id="profile-settings-panel">
        <h4 className="text-[10px] font-mono uppercase text-zinc-300 tracking-wider font-bold">Settings</h4>
        
        <div className="space-y-2">
          {/* Reset Stats */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-3.5 rounded-xl border border-zinc-800 hover:bg-zinc-900/20 transition-all font-mono text-left font-bold text-xs flex justify-between items-center text-zinc-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                Reset Workout Data & Statistics
              </span>
              <span className="text-[10px] text-zinc-300">RESET ALL</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 text-left space-y-3 animate-fade-in" id="reset-confirm-box">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block">
                ⚠️ CONFIRM WIPE OUT
              </span>
              <p className="text-xs text-zinc-200">
                Are you absolutely sure you want to delete your logged workouts and reset all workout counts?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleResetData}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white border-0 h-9 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all"
                  id="confirm-reset-btn"
                >
                  YES, WIPE DATA
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-0 h-9 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full p-3.5 rounded-xl border border-zinc-800 hover:bg-zinc-900/20 transition-all font-mono text-left font-bold text-xs flex justify-between items-center text-zinc-200 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-zinc-300" />
              Sign Out Account
            </span>
            <span className="text-[10px] text-zinc-300">EXIT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
