export interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  sets: number;
  reps: string;
  rest: string; // e.g., "90s"
  instructions: string[];
  mistakes: string[];
  coachingNotes: string;
  videoPlaceholder: string; // category key or label
  properFormGuide?: string;
  breathingInstructions?: string;
  trainingTips?: string;
  safetyWarnings?: string;
}

export interface WorkoutDay {
  id: string;
  name: string; // e.g., "Day 1: Push (Chest, Shoulders, Triceps)"
  target: string; // e.g., "Chest & Arms Focus"
  duration: string; // e.g., "60 min"
  exercises: Exercise[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  tagline: string;
  difficulty: string;
  durationWeeks: number;
  frequency: string; // e.g. "4-5 days/week"
  creatorNotes: string;
  days: WorkoutDay[];
}

export interface Meal {
  id: string;
  name: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  loggedAt: string; // date or time
}

export interface ProgressPhoto {
  id: string;
  date: string;
  weight: number;
  label: string;
  imagePlaceholderColor: string;
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface CreatorBrandingConfig {
  name: string;
  handle: string;
  primaryColor: string; // hex colour
  secondaryColor: string; // hex colour
  philosophy: string;
  personality: string;
  logoText: string;
  avatarUrl: string;
}

export interface MockMember {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: "Active" | "Churned" | "Pending";
  joinedDate: string;
  mrr: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  startingWeight: number;
  targetWeight: number;
  currentWeight: number;
  workoutStreak: number;
  completedWorkoutsCount: number;
  mealsLoggedStreak: number;
  mealsLoggedTodayCount: number;
  badgeIds: string[];
  points: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconType: "streak" | "workouts" | "weight" | "meals" | "first";
  requirementText: string;
  targetValue: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  displayName: string;
  workoutsCompleted: number;
  streak: number;
  points: number;
  isCurrentUser?: boolean;
}

