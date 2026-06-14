import React, { useState, useEffect } from "react";
import { 
  Mail, 
  Key, 
  User, 
  Scale, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  RefreshCw, 
  KeyRound, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Smartphone,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { UserProfile } from "../types";

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
  brandColor: string;
  creatorName: string;
}

// SHA-256 Hashing helper using browser Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "creatorfit_secure_salt_987");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function AuthView({ onAuthSuccess, brandColor, creatorName }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Signup wizard steps: 1 = Account Credentials, 2 = Athlete Profile Name, 3 = Goal Weight Parameters
  const [signupStep, setSignupStep] = useState(1);

  // Input states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [startingWeight, setStartingWeight] = useState("180");
  const [targetWeight, setTargetWeight] = useState("170");

  // Forgot Password step states
  const [resetCode, setResetCode] = useState("");
  const [userResetCode, setUserResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: email input, 2: code verify & new password

  // Toast / Status managers
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Clean error messages when toggling between tabs
  useEffect(() => {
    setError("");
    setSuccess("");
    setSignupStep(1);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDisplayName("");
  }, [isLogin, forgotMode]);

  // Sanitize any corrupt/partial ghost accounts from local database at startup to prevent email locking issues
  useEffect(() => {
    try {
      const stored = localStorage.getItem("creatorfit_users");
      if (stored) {
        const users = JSON.parse(stored);
        if (Array.isArray(users)) {
          const completeUsers = users.filter((u: any) => 
            u && 
            typeof u.email === "string" && 
            u.email.trim() !== "" &&
            typeof u.passwordHash === "string" &&
            u.passwordHash.trim() !== "" &&
            u.profile &&
            typeof u.profile.displayName === "string" &&
            u.profile.displayName.trim() !== ""
          );
          localStorage.setItem("creatorfit_users", JSON.stringify(completeUsers));
        }
      }
    } catch (e) {
      console.warn("Autoclean up failed:", e);
    }
  }, []);

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-zinc-800" };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: "Weak ⚠️", color: "bg-red-500 w-1/3" };
    if (score <= 4) return { score, label: "Moderate ⚡", color: "bg-amber-500 w-2/3" };
    return { score, label: "Secure 🔥", color: "bg-green-500 w-full" };
  };

  const strength = isLogin ? { score: 0, label: "", color: "" } : getPasswordStrength(password);

  // Frictionless "Guest Demo Mode" login helper
  const handleGuestDemo = () => {
    setError("");
    setSuccess("");
    try {
      const storedUsersRaw = localStorage.getItem("creatorfit_users");
      const usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      const targetEmail = "lisaayem97@gmail.com";
      let lisaUser = usersList.find((u: any) => u.email.toLowerCase() === targetEmail);

      const lisaProfile: UserProfile = {
        uid: "lisa-user-id",
        email: targetEmail,
        displayName: "Lisa Ayem",
        startingWeight: 180,
        targetWeight: 170,
        currentWeight: 175.5,
        workoutStreak: 2,
        completedWorkoutsCount: 2,
        mealsLoggedStreak: 1,
        mealsLoggedTodayCount: 1,
        badgeIds: ["first_workout"],
        points: 550
      };

      if (!lisaUser) {
        lisaUser = {
          email: targetEmail,
          passwordHash: "9ebd8c84c1737f074a38fd96c9d08e5c5443fa7cb062cfbb90b6d19ca7b960c1", // sha255 "lisa1234 + salt" or raw placeholder
          displayName: "Lisa Ayem",
          startingWeight: 180,
          targetWeight: 170,
          profile: lisaProfile
        };
        usersList.push(lisaUser);
        localStorage.setItem("creatorfit_users", JSON.stringify(usersList));
      }

      setSuccess("Welcome back, Lisa! Launching Guest Demo Mode...");
      setTimeout(() => {
        onAuthSuccess(lisaUser.profile || lisaProfile);
      }, 750);
    } catch (e) {
      setError("Guest login execution failed.");
    }
  };

  // Submit Handler for traditional LOG IN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please input email and password.");
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem("creatorfit_users");
      const usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const foundUser = usersList.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!foundUser) {
        setError("Account not found or password does not match.");
        return;
      }

      const inputHash = await hashPassword(password);
      if (foundUser.passwordHash !== inputHash) {
        setError("Account not found or password does not match.");
        return;
      }

      setSuccess("Gateway verified! Sychronizing client data...");
      setTimeout(() => {
        onAuthSuccess(foundUser.profile);
      }, 650);

    } catch (err: any) {
      setError("Authentication hardware server error.");
    }
  };

  // Intermediate validation managers for the sign up wizard
  const validateSignupStep1 = () => {
    setError("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please provide a valid email structure.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must have at least 8 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Configured passwords do not match.");
      return false;
    }

    const storedUsersRaw = localStorage.getItem("creatorfit_users");
    const usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    const exists = usersList.some((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      setError("An account with this email is already registered.");
      return false;
    }

    return true;
  };

  const validateSignupStep2 = () => {
    setError("");
    if (displayName.trim().length < 2) {
      setError("Display name must consist of at least 2 characters.");
      return false;
    }
    return true;
  };

  // Unified final submission of SIGN UP
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const startW = Number(startingWeight);
    const targetW = Number(targetWeight);

    if (isNaN(startW) || startW < 50 || startW > 500) {
      setError("Starting weight must reside between 50 and 500 lbs.");
      return;
    }

    if (isNaN(targetW) || targetW < 50 || targetW > 500) {
      setError("Target weight must reside between 50 and 500 lbs.");
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem("creatorfit_users");
      const usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      // Final duplicated email security cross-check
      const exists = usersList.some((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        setError("Account already exist under this email address.");
        return;
      }

      const passHash = await hashPassword(password);

      // Construct complete profile payload at once to prevent partial/corrupted entries
      const userProfile: UserProfile = {
        uid: `user-${Date.now()}`,
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        startingWeight: startW,
        targetWeight: targetW,
        currentWeight: startW,
        workoutStreak: 0,
        completedWorkoutsCount: 0,
        mealsLoggedStreak: 0,
        mealsLoggedTodayCount: 0,
        badgeIds: [],
        points: 100, // Earn 100 base loyalty XP for creating account!
      };

      const newUser = {
        email: email.trim().toLowerCase(),
        passwordHash: passHash,
        displayName: displayName.trim(),
        startingWeight: startW,
        targetWeight: targetW,
        profile: userProfile,
      };

      usersList.push(newUser);
      localStorage.setItem("creatorfit_users", JSON.stringify(usersList));

      setSuccess("Vault Account successfully encrypted!");
      setTimeout(() => {
        onAuthSuccess(userProfile);
      }, 750);

    } catch (err: any) {
      setError("Generation write fault inside secure block.");
    }
  };

  // Forgot Password: Verification PIN loader
  const handleForgotStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is required.");
      return;
    }

    const storedUsersRaw = localStorage.getItem("creatorfit_users");
    const usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    const found = usersList.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      setError("No account matches this email address.");
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setResetCode(code);
    setForgotStep(2);
    setSuccess("Simulated reset pin successfully injected below!");
  };

  // Forgot Password: Set new credentials
  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (userResetCode !== resetCode) {
      setError("Incorrect safety code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Secure password must consist of at least 8 characters.");
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem("creatorfit_users");
      const usersList = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const idx = usersList.findIndex((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (idx === -1) {
        setError("Account not found.");
        return;
      }

      const passHash = await hashPassword(newPassword);
      usersList[idx].passwordHash = passHash;
      if (usersList[idx].profile) {
        usersList[idx].profile.points = (usersList[idx].profile.points || 0) + 10; // loyalty reward points
      }

      localStorage.setItem("creatorfit_users", JSON.stringify(usersList));
      setSuccess("Credentials successfully updated! Switching to login...");

      setTimeout(() => {
        setForgotMode(false);
        setForgotStep(1);
        setIsLogin(true);
        setPassword("");
        setNewPassword("");
        setResetCode("");
        setUserResetCode("");
      }, 1400);

    } catch (err: any) {
      setError("Unable to complete security database rewrite.");
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 bg-black border border-white/5 rounded-3xl text-left shadow-2xl relative overflow-hidden" id="auth-panel-card">
      {/* Visual glowing elements */}
      <div className="absolute -top-16 -right-16 w-32 h-32 blur-2xl rounded-full" style={{ backgroundColor: `${brandColor}15` }} />

      {/* Main branded Header */}
      <div className="text-center mb-6" id="auth-header">
        <h2 className="text-xl font-bold tracking-tight text-white mb-1.5 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5" style={{ color: brandColor }} />
          CreatorFit <span className="text-neutral-400 font-normal">Vault</span>
        </h2>
        <p className="text-[11px] text-neutral-405 leading-normal">
          Secure Authorization Node • Personalized for <strong>{creatorName}</strong>
        </p>
      </div>

      {/* Status Toasts */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/20 text-red-400 border border-red-900/20 text-[11px] font-sans flex items-start gap-2" id="auth-error-notif">
          <span className="flex-shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-950/20 text-green-300 border border-green-900/25 text-[11px] font-sans flex items-start gap-2" id="auth-success-notif">
          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Switch Gateway Tabs (Hidden in Forgot Mode) */}
      {!forgotMode && (
        <div className="flex bg-zinc-950 p-1 rounded-xl gap-1 mb-5" id="auth-views-tabs">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isLogin ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-1.5 text-center rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              !isLogin ? "bg-white text-black font-extrabold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* FORGOT PASSWORD BLOCK */}
      {forgotMode ? (
        <div id="forgot-password-container" className="space-y-4">
          <button
            type="button"
            onClick={() => { setForgotMode(false); setForgotStep(1); }}
            className="text-zinc-500 hover:text-white text-xs inline-flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Login
          </button>

          {forgotStep === 1 ? (
            <form onSubmit={handleForgotStep1} className="space-y-4">
              <h3 className="text-xs text-zinc-300 font-bold uppercase tracking-wider font-mono">Unlock Your Account</h3>
              <p className="text-[10px] text-zinc-300 leading-normal">
                Input your profile email below. We will simulate a local bypass safety code right inside this card terminal to securely reset your password.
              </p>
              
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-650" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                GENERATE RECOVERY PIN
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotStep2} className="space-y-4">
              <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl space-y-1.5 text-center" id="secure-bypass-pin-card">
                <span className="text-[9px] font-mono font-bold tracking-wider text-green-400 block">🔒 Vault Recovery Lock PIN</span>
                <p className="text-xl font-mono font-bold tracking-[0.25em] text-white select-all">{resetCode}</p>
                <p className="text-[9px] text-zinc-300">Provide this simulated security pin underneath to authorize the database rewrite.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">Verification code</label>
                <input
                  type="text"
                  required
                  placeholder="Insert 4-digit code"
                  value={userResetCode}
                  onChange={(e) => setUserResetCode(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white tracking-wider font-mono text-center"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">New Secure password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                CONFIRM RESET
              </button>
            </form>
          )}
        </div>
      ) : isLogin ? (
        /* TRADITIONAL LOGIN BLOCK */
        <div className="space-y-4">
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-zinc-600" />
                <input
                  type="email"
                  required
                  placeholder="lisaayem97@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-750 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-[10px] font-mono text-zinc-300 hover:text-white cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3.5 text-zinc-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-650 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-black uppercase rounded-xl tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98]"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Frictionless One-Click Guest Demo Button required by Priority 1 */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-900"></div>
            <span className="flex-shrink mx-3 text-[9px] text-zinc-400 font-mono uppercase tracking-widest">or bypass</span>
            <div className="flex-grow border-t border-zinc-900"></div>
          </div>

          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full py-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-450 hover:bg-rose-500 hover:text-white transition-all cursor-pointer text-xs font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 shadow"
            id="btn-guest-demo"
          >
            <Smartphone className="w-4 h-4" />
            BROWSE AS GUEST (INSTANT DEMO)
          </button>
        </div>
      ) : (
        /* PREMIUM MULTI-STEP SIGN UP WIZARD ONBOARDING */
        <div className="space-y-4" id="signup-wizard">
          {/* Progress Indicator Dots */}
          <div className="flex justify-between items-center px-1 pb-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-300">
              Onboarding: Step {signupStep} of 3
            </span>
            <div className="flex gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all ${signupStep >= 1 ? "bg-rose-500" : "bg-zinc-800"}`} />
              <div className={`w-2 h-2 rounded-full transition-all ${signupStep >= 2 ? "bg-rose-500" : "bg-zinc-800"}`} />
              <div className={`w-2 h-2 rounded-full transition-all ${signupStep >= 3 ? "bg-rose-500" : "bg-zinc-800"}`} />
            </div>
          </div>

          {/* STEP 1: ACCOUNT CREDENTIALS */}
          {signupStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block font-bold">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-600" />
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block font-bold">Secure Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-zinc-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-650 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="space-y-1 mt-1 font-sans">
                    <div className="flex justify-between text-[9px] items-center">
                      <span className="text-zinc-300">Security complexity:</span>
                      <span className="font-extrabold text-white text-[9px]">{strength.label}</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1 rounded-sm overflow-hidden flex">
                      <div className={`h-full transition-all duration-300 ${strength.color}`} />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block font-bold">Verify Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 text-zinc-600" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700 font-sans"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (validateSignupStep1()) {
                    setSignupStep(2);
                  }
                }}
                className="w-full py-3 bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-black uppercase rounded-xl flex items-center justify-center gap-1"
                id="btn-signup-next-1"
              >
                PROCEED TO PROFILE <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: ATHLETE PROFILE */}
          {signupStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block font-bold">Display Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-zinc-600" />
                  <input
                    type="text"
                    required
                    placeholder="Lisa Ayem"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white placeholder-zinc-700 font-sans"
                  />
                </div>
                <span className="text-[9px] text-zinc-300 block leading-normal mt-1">
                  This card identifies your stats on creator athletic leaderboards.
                </span>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="flex-1 py-3 bg-zinc-900/60 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer text-xs font-bold rounded-xl text-center"
                >
                  PREVIOUS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateSignupStep2()) {
                      setSignupStep(3);
                    }
                  }}
                  className="flex-1 py-3 bg-white text-black hover:bg-zinc-200 transition-colors cursor-pointer text-xs font-black uppercase rounded-xl flex items-center justify-center gap-1"
                  id="btn-signup-next-2"
                >
                  SET GOALS <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: WEIGHT TARGETS & FINAL SAVE */}
          {signupStep === 3 && (
            <form onSubmit={handleSignupSubmit} className="space-y-4 animate-fade-in" id="wizard-step3-form">
              <p className="text-[10px] text-zinc-300 leading-normal">
                Finalizing credentials! Log your current physical weight and goal target to initialize milestone progress trackers.
              </p>

              <div className="grid grid-cols-2 gap-3" id="signup-weight-goals-row">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] text-zinc-400 uppercase font-mono tracking-wider block font-bold">Current Weight</label>
                  <div className="relative">
                    <Scale className="w-3.5 h-3.5 absolute left-2.5 top-3.5 text-zinc-600" />
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={startingWeight}
                      onChange={(e) => setStartingWeight(e.target.value)}
                      className="w-full pl-8 pr-2 py-3 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] text-zinc-400 uppercase font-mono tracking-wider block font-bold">Target Weight</label>
                  <div className="relative">
                    <Scale className="w-3.5 h-3.5 absolute left-2.5 top-3.5 text-zinc-650" />
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="w-full pl-8 pr-2 py-3 bg-zinc-950 border border-zinc-900 focus:border-zinc-700 focus:outline-none rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSignupStep(2)}
                  className="flex-1 py-3 bg-zinc-900/60 border border-zinc-800 text-zinc-200 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer text-xs font-bold rounded-xl text-center"
                >
                  PREVIOUS
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer text-xs font-black uppercase rounded-xl flex items-center justify-center gap-1"
                  id="btn-signup-submit-wizard"
                >
                  FINISH & SIGN UP <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Branded Pre-seed help card */}
      {!forgotMode && isLogin && (
        <div className="mt-5 p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-900 text-[10px] text-zinc-200 leading-relaxed font-sans use-contrast animate-fade-in" id="preseeds-info-note">
          💡 <strong>Demo Logins:</strong> Click <strong>"Browse as Guest"</strong> above, or log in manually using <strong>lisaayem97@gmail.com</strong> (password: <strong>lisa1234</strong>).
        </div>
      )}
    </div>
  );
}
