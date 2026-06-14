import React, { useState, useEffect } from "react";
import { 
  Home, Dumbbell, BookOpen, User,
  Wifi, Battery, Sparkles
} from "lucide-react";
import { DEFAULT_BRANDING, WORKOUT_PROGRAMS, EXERCISE_LIBRARY } from "./data";
import { CreatorBrandingConfig, UserProfile } from "./types";

// Import modular screens
import DashboardView from "./components/DashboardView";
import WorkoutsView from "./components/WorkoutsView";
import ExerciseLibraryView from "./components/ExerciseLibraryView";
import ProgressView from "./components/ProgressView"; // PROFILE view
import AuthView from "./components/AuthView";

export default function App() {
  const [branding] = useState<CreatorBrandingConfig>(DEFAULT_BRANDING);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [activeWorkout, setActiveWorkout] = useState<{ programId: string; dayIndex: number } | null>(null);

  // User Authentication State loaded from localStorage
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("creatorfit_session_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Preseed credentials for demo login smoothness
  useEffect(() => {
    const preseedDemo = async () => {
      try {
        const stored = localStorage.getItem("creatorfit_users");
        const users = stored ? JSON.parse(stored) : [];
        const hasLisa = users.some((u: any) => u.email === "lisaayem97@gmail.com");
        
        if (!hasLisa) {
          users.push({
            email: "lisaayem97@gmail.com",
            passwordHash: "9ebd8c84c1737f074a38fd96c9d08e5c5443fa7cb062cfbb90b6d19ca7b960c1",
            displayName: "Lisa Ayem",
            startingWeight: 180,
            targetWeight: 170,
            profile: {
              uid: "lisa-user-id",
              email: "lisaayem97@gmail.com",
              displayName: "Lisa Ayem",
              startingWeight: 180,
              targetWeight: 170,
              currentWeight: 175.5,
              workoutStreak: 2,
              completedWorkoutsCount: 2,
              mealsLoggedStreak: 0,
              mealsLoggedTodayCount: 0,
              badgeIds: [],
              points: 0
            }
          });
          localStorage.setItem("creatorfit_users", JSON.stringify(users));
        }
      } catch (e) {
        console.warn("Could not preseed credentials", e);
      }
    };
    preseedDemo();
  }, []);

  // Update Weight logged
  const handleLogWeight = (weight: number) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        currentWeight: weight
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("creatorfit_session_user", JSON.stringify(updatedProfile));
    }
  };

  // Workout handlers
  const handleStartWorkout = (programId: string, dayIndex: number) => {
    setActiveWorkout({ programId, dayIndex });
    setActiveTab("workouts");
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
  };

  const handleCompleteWorkout = () => {
    setActiveWorkout(null);
    setActiveTab("home");
    // Reload updated states from storage
    const saved = localStorage.getItem("creatorfit_session_user");
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  };

  const handleSignOut = () => {
    setUserProfile(null);
    localStorage.removeItem("creatorfit_session_user");
    setActiveTab("home");
    setActiveWorkout(null);
  };

  // Render active mobile view
  const renderTabContent = () => {
    if (!userProfile) {
      return (
        <AuthView 
          onAuthSuccess={(profile) => {
            setUserProfile(profile);
            localStorage.setItem("creatorfit_session_user", JSON.stringify(profile));
          }}
          brandColor={branding.secondaryColor}
          creatorName={branding.name}
        />
      );
    }

    switch (activeTab) {
      case "home":
        return (
          <DashboardView 
            branding={branding} 
            programs={WORKOUT_PROGRAMS} 
            onNavigate={(id) => setActiveTab(id)}
            onStartWorkout={handleStartWorkout}
            userProfile={userProfile}
          />
        );
      case "workouts":
        return (
          <WorkoutsView 
            programs={WORKOUT_PROGRAMS}
            activeWorkout={activeWorkout}
            onStartWorkout={handleStartWorkout}
            onCancelWorkout={handleCancelWorkout}
            onCompleteWorkout={handleCompleteWorkout}
          />
        );
      case "exercises":
        return <ExerciseLibraryView exerciseLibrary={EXERCISE_LIBRARY} />;
      case "profile":
        return <ProgressView userProfile={userProfile} onLogWeight={handleLogWeight} />;
      default:
        return <div className="text-white py-12">Tab under development</div>;
    }
  };

  return (
    <div 
      className="min-h-screen bg-zinc-950 font-sans flex items-center justify-center p-0 md:p-6 select-none"
      id="main-viewport-container"
    >
      {/* Desktop Ambient Background */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-rose-950/10 to-transparent pointer-events-none filter blur-3xl" />

      {/* Primary centered Smartphone Frame simulating mobile-first hardware limits */}
      <div 
        className="w-full max-w-md min-h-screen md:min-h-[812px] md:max-h-[850px] bg-black md:rounded-[40px] md:border-8 md:border-zinc-900 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-all"
        style={{ 
          boxShadow: `0 20px 50px -12px ${branding.secondaryColor}10` 
        }}
        id="smartphone-workspace-frame"
      >
        {/* Dynamic top speaker notch simulated on desktop viewports */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-40 items-center justify-center">
          <div className="w-12 h-1 bg-zinc-800 rounded" />
        </div>

        {/* Inside Main Interactive Phone Screen Container */}
        <div className="flex-1 bg-black pt-5 md:pt-8 flex flex-col overflow-hidden relative" id="mobile-viewport-inner">
          
          {/* Top Phone Status Bar - Hide during active workout for full-screen mode */}
          {!activeWorkout && (
            <div className="absolute top-2 left-6 right-6 flex justify-between items-center z-35 pointer-events-none text-zinc-500 text-[9px] font-mono select-none">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-2.5 h-2.5 text-zinc-600" />
                <Battery className="w-3 h-3 text-zinc-600" />
              </div>
            </div>
          )}

          {/* Branded Application Header - Hide during active workout for full-screen mode */}
          {!activeWorkout && (
            <header className="px-5 py-3 border-b border-zinc-900 w-full flex justify-between items-center bg-black/90 sticky top-0 z-20">
              <h1 
                className="text-xs font-black tracking-widest font-mono uppercase transition-colors flex items-center gap-1"
                style={{ color: branding.secondaryColor }}
              >
                ⚡ {branding.logoText}
              </h1>
              
              <div className="flex items-center gap-2">
                {userProfile && (
                  <span className="text-[8px] font-mono bg-zinc-900/80 text-zinc-400 border border-zinc-900 px-2 py-0.5 rounded uppercase font-semibold">
                    DEMO ATHLETE
                  </span>
                )}
                <img 
                  src={branding.avatarUrl} 
                  alt="Coach Lisa" 
                  className="w-6.5 h-6.5 object-cover rounded-full border border-zinc-900 bg-zinc-900" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </header>
          )}

          {/* Main scrollable body viewport */}
          <main className={`flex-1 overflow-y-auto scrollbar-none ${activeWorkout ? "p-0" : "px-5 pt-4"}`} id="mobile-content-view">
            {renderTabContent()}
          </main>

          {/* Bottom App Navigation inside Center Panel - Hide during active workout for full-screen mode */}
          {userProfile && !activeWorkout && (
            <nav className="border-t border-zinc-900 bg-black px-4 py-3.5 flex justify-between items-center z-20 select-none text-[9px] font-mono text-zinc-500">
              <button 
                onClick={() => { setActiveTab("home"); }}
                className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors cursor-pointer border-0 bg-transparent ${activeTab === "home" ? "text-white" : "hover:text-zinc-300"}`}
              >
                <Home className="w-5 h-5" style={activeTab === "home" ? { color: branding.secondaryColor } : undefined} />
                <span className="text-[8px] font-mono uppercase tracking-wider font-semibold mt-0.5">Home</span>
              </button>

              <button 
                onClick={() => { setActiveTab("workouts"); }}
                className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors cursor-pointer border-0 bg-transparent ${activeTab === "workouts" ? "text-white" : "hover:text-zinc-300"}`}
              >
                <Dumbbell className="w-5 h-5" style={activeTab === "workouts" ? { color: branding.secondaryColor } : undefined} />
                <span className="text-[8px] font-mono uppercase tracking-wider font-semibold mt-0.5">Workouts</span>
              </button>

              <button 
                onClick={() => { setActiveTab("exercises"); }}
                className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors cursor-pointer border-0 bg-transparent ${activeTab === "exercises" ? "text-white" : "hover:text-zinc-300"}`}
              >
                <BookOpen className="w-5 h-5" style={activeTab === "exercises" ? { color: branding.secondaryColor } : undefined} />
                <span className="text-[8px] font-mono uppercase tracking-wider font-semibold mt-0.5">Exercises</span>
              </button>

              <button 
                onClick={() => { setActiveTab("profile"); }}
                className={`flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors cursor-pointer border-0 bg-transparent ${activeTab === "profile" ? "text-white" : "hover:text-zinc-300"}`}
              >
                <User className="w-5 h-5" style={activeTab === "profile" ? { color: branding.secondaryColor } : undefined} />
                <span className="text-[8px] font-mono uppercase tracking-wider font-semibold mt-0.5">Profile</span>
              </button>
            </nav>
          )}

          {/* Physical bottom native phone indicator notch */}
          <div className="h-3 bg-black flex justify-center items-center pb-1">
            <div className="w-20 h-1 bg-zinc-800 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
}
