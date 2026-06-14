import { WorkoutProgram, Exercise, Meal, ProgressPhoto, PersonalRecord, CreatorBrandingConfig, MockMember } from "./types";

export const DEFAULT_BRANDING: CreatorBrandingConfig = {
  name: "Coach Lisa Ayem",
  handle: "@lisa_lifts",
  primaryColor: "#000000",
  secondaryColor: "#e11d48", // Rose Red
  logoText: "ACTIVE LIFT",
  philosophy: "Optimizing progressive athletic compound lifts with clear step-by-step form mechanics.",
  personality: "Technical, direct, supportive with deep emphasis on proper joint ranges.",
  avatarUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=300&auto=format&fit=crop"
};

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: "ex-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "Chest, Front Delts, Triceps",
    difficulty: "Intermediate",
    sets: 4,
    reps: "6-8",
    rest: "2-3 min",
    instructions: [
      "Lie flat on the bench, pressing your feet firmly into the ground to build tension.",
      "Grip the bar slightly wider than shoulder-width apart, and actively retract and depress your shoulder blades.",
      "Unrack the weight and lower the bar under strict control to your mid-chest, keeping elbows tucked at an athletic 45-degree angle.",
      "Drive the bar back upward explosively to full lockout while contracting your chest muscles."
    ],
    mistakes: [
      "Flaring elbows flat to 90 degrees (highly damaging for rotator cuffs).",
      "Bouncing the iron off your rib cage.",
      "Lifting your hips and glutes off the pad."
    ],
    coachingNotes: "Make sure you pack your lats down before starting. Treat the bench as a full-body movement; drive through your legs to generate force from the floor.",
    videoPlaceholder: "chest_bench",
    properFormGuide: "Maintain a slight natural arch in the lower back while keeping the glutes and upper back in continuous contact with the bench. Drive your heels down hard.",
    breathingInstructions: "Take a huge belly breath at the top, brace your core, lower the load while holding that tension, and exhale strongly once you pass the sticking point on the drive up.",
    trainingTips: "Squeeze the bar as hard as possible to recruit more motor units in the arms and chest. Pull the bar apart with your hands to keep the upper back tense.",
    safetyWarnings: "Always utilize safety pins or have an experienced spotter nearby. Never hook your thumbs underneath the bar in a thumbless 'suicide' grip."
  },
  {
    id: "ex-incline-db-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "Upper Chest, Anterior Deltoids",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-10",
    rest: "90s",
    instructions: [
      "Set an incline bench to roughly 30 to 40 degrees.",
      "Sit back with dumbbells at shoulder height, palms rotated forward and slightly angled.",
      "Press the weights vertically in an arc, bringing them together at the apex without clanging.",
      "Lower under absolute control until you achieve a broad, deep stretch across the upper pectorals."
    ],
    mistakes: [
      "Setting the incline too high (above 45 degrees shifts stress entirely to shoulder joints).",
      "Shortening the range of motion by stopping early."
    ],
    coachingNotes: "Stop dumbbells just short of touching. Keeping a constant tension environment on the upper clavicular pecs is what stimulates real growth.",
    videoPlaceholder: "chest_incline",
    properFormGuide: "Keep the chest elevated high. Don't let your shoulders roll forward at the peak of the press, which turns off pectoral stimulation.",
    breathingInstructions: "Inhale slowly as you descend and expand the chest cavity. Exhale with high power on the push.",
    trainingTips: "Keep dumbbells angled at 45 degrees relative to each other to save the rotators. Think of pushing your biceps into your chest.",
    safetyWarnings: "Do not drop dumbbells from the top; lower them cleanly to your knees before resting."
  },
  {
    id: "ex-overhead-press",
    name: "Standing Barbell Overhead Press",
    muscleGroup: "Shoulders (Full Deltoids), Triceps",
    difficulty: "Advanced",
    sets: 4,
    reps: "5-7",
    rest: "2 min",
    instructions: [
      "Rack the barbell at upper chest height. Grip firmly with wrists stacked straight.",
      "Squeeze your glutes, quadriceps, and abdominal wall to establish a rock-solid platform.",
      "Press the bar overhead in a clean vertical path, tucking your chin slightly to avoid hitting your nose.",
      "Push your head through 'the window' as soon as the bar passes your forehead, locking it out overhead."
    ],
    mistakes: [
      "Hyperextending the lower back to simulate vertical path height.",
      "Failing to get a full lockout, cutting reps short."
    ],
    coachingNotes: "This is the ultimate test of upper body power. If your glutes are loose, your vertical force transmission leaks. Lock those glutes!",
    videoPlaceholder: "shoulder_ohp",
    properFormGuide: "Forearms must remain perfectly vertical under the bar at all times. Squeeze glutes like crazy to protect your spinal lumbar region.",
    breathingInstructions: "Inhale at the bottom, brace hard, press upward, and release your breath only at the locked out apex.",
    trainingTips: "Push your hands UP and OUT at the top to secure maximum trap recruitment and stable shoulder mechanics.",
    safetyWarnings: "If you feel a loss of balance, safely guide the bar back down to your collarbones; never drop a barbell over your neck or back."
  },
  {
    id: "ex-lat-pulldown",
    name: "Wide-Grip Lat Pulldown",
    muscleGroup: "Lats (Latissimus Dorsi), Upper Back, Biceps",
    difficulty: "Beginner",
    sets: 4,
    reps: "10-12",
    rest: "90s",
    instructions: [
      "Sit securely at the system station, adjusting the roller pads tightly against your thighs.",
      "Grip the overhead bar wide, retract your collarbones, and lean your chest back 10 degrees.",
      "Pull the bar directly to your upper breastbone by driving your elbows downward and backward.",
      "Control the ascent slowly, feeling the stretch inside your outer back musculature."
    ],
    mistakes: [
      "Leaning back excessively to pull with your body weight.",
      "Pulling the bar back behind your neck, creating serious neck stress."
    ],
    coachingNotes: "Imagine trying to put your elbows in your back pockets. This shifts the focus off your biceps and onto your lower and outer lats.",
    videoPlaceholder: "back_lat",
    properFormGuide: "Pull through your pinky fingers and drive through your elbows. The chest should remain lifted up to meet the bar.",
    breathingInstructions: "Exhale fully as you pull the bar down. Inhale steadily as you control the bar back to top stretch.",
    trainingTips: "Use a thumbless grip here to reduce forearm/bicep takeover and increase back activation.",
    safetyWarnings: "Do not let go of the bar at the top or let the load yank your shoulders aggressively into hyper-flexion."
  },
  {
    id: "ex-barbell-row",
    name: "Bent-Over Barbell Row",
    muscleGroup: "Lats, Rhomboids, Traps, Spinal Erectors",
    difficulty: "Intermediate",
    sets: 4,
    reps: "8-10",
    rest: "2 min",
    instructions: [
      "Deadlift the bar, then hinge forward at your hips at a 45-degree angle, keeping your back straight.",
      "Grip the bar slightly wider than shoulders (underhand for lats, overhand for upper back).",
      "Pull the bar towards your lower stomach, bringing the shoulder blades together at the apex.",
      "Extend your arms fully under control, keeping the spine completely rigid."
    ],
    mistakes: [
      "Rounding the spinal erectores (massive risk of lumbar disc injury).",
      "Standing up too straight to use momentum to bounce the load."
    ],
    coachingNotes: "Keep your chest puffed out and back locked. The back must remain stationary like a steel table. Only the arms and scapulae are driving.",
    videoPlaceholder: "back_row",
    properFormGuide: "Your torso must remain dead-still. Do not hike the hips up and down. Focus on pulling with the elbows.",
    breathingInstructions: "Inhale to prep your trunk context, hold breath while lifting, and exhale at the belly touch.",
    trainingTips: "Keep your wrists straight to prevent pull fatigue. Drive the elbows as high as possible.",
    safetyWarnings: "At the first sign of back rounding or lower back pain, terminate the set immediately."
  },
  {
    id: "ex-squat",
    name: "Barbell Back Squat",
    muscleGroup: "Quadriceps, Glutes, Hamstrings, Adductors",
    difficulty: "Advanced",
    sets: 4,
    reps: "6-8",
    rest: "3 min",
    instructions: [
      "Rest the bar securely across your upper muscle traps. Stand back.",
      "Position feet slightly wider than shoulders, with toes flared outward 15-30 degrees.",
      "Inhale deeply, brace your abs, and sit down into your hips while pushing knees outward.",
      "Descend until your crease of hips drops below parallel, then drive back up to start."
    ],
    mistakes: [
      "Knees caving inwards (valgus collapse, high joint stress).",
      "Lifting heels, pushing weight forward onto your toes."
    ],
    coachingNotes: "Drive outward against the sides of your shoes. This forces hip abduction and glute activation, stabilizing your knees and keeping your squat powerful.",
    videoPlaceholder: "legs_squat",
    properFormGuide: "Ensure your weight is evenly distributed between heel, big toe, and outer foot. Bracing your abs is critical.",
    breathingInstructions: "Inhale a massive breath into your gut, brace your core hard, squat down and up, then exhale only when you recover the top.",
    trainingTips: "Maintain a tight grip on the bar, pulling it down into your shoulders to keep your back rigid and chest up.",
    safetyWarnings: "Always squat inside a rack with safety bars set just below your bottom depth. Never walk backward to rack the bar."
  },
  {
    id: "ex-romanian-deadlift",
    name: "Romanian Deadlift (RDL)",
    muscleGroup: "Hamstrings, Gluteus Maximus, Lower Back",
    difficulty: "Intermediate",
    sets: 3,
    reps: "8-10",
    rest: "2 min",
    instructions: [
      "Stand holding dumbbells or a barbell at hip height with shoulders pulled back.",
      "Initiate by reaching your hips backward as if trying to press open a door with your glutes.",
      "Lower the weights slowly, keeping them in constant contact with your shins, till you feel a high hamstring stretch.",
      "Drive hips forward powerfully, fully engaging your glutes and hamstrings."
    ],
    mistakes: [
      "Allowing the lower spine to round.",
      "Bending the knees too much, which converts the lift into a standard squat."
    ],
    coachingNotes: "Think of your hips as drawer. Your hands are just ropes holding the weight. All that matters is pushing the hips all the way back, then drawing them forward.",
    videoPlaceholder: "legs_rdl",
    properFormGuide: "Only go down as far as your hamstrings allow without your back rounding. Keep the bar tucked extremely close to your shins.",
    breathingInstructions: "Breathe in on the stretch phase, brace your core, and exhale as your hips lock out.",
    trainingTips: "Focus purely on pushing your hips backward. Hold the load on your heels to maximize hamstring load.",
    safetyWarnings: "Do not let the bar swing forward away from your body; this heavily multiples severe spinal load forces."
  },
  {
    id: "ex-tricep-pushdown",
    name: "Cable Tricep Pushdown",
    muscleGroup: "Arms (Triceps Brachii)",
    difficulty: "Beginner",
    sets: 3,
    reps: "12-15",
    rest: "60s",
    instructions: [
      "Attach a double-rope to the cable post. Step back slightly.",
      "Pin your elbows to your ribcage and hinge forward at the waist 10 degrees.",
      "Push the rope downward, flaring the ends apart at the bottom to maximize contraction.",
      "Guide the arms back up slowly, letting hands reach upper chest height."
    ],
    mistakes: [
      "Allowing elbows to swing forward and backward (using shoulders)."
    ],
    coachingNotes: "Lock your upper arm in place. Pretend your elbows are bolted to your rib cage. Absolute isolation of the lateral head of the tricep.",
    videoPlaceholder: "arms_tricep",
    properFormGuide: "Ensure your wrists remain aligned, and do not use torso weight or momentum to push downward.",
    breathingInstructions: "Exhale on extension; inhale under control on the return.",
    trainingTips: "Hold the peak contraction at the bottom for one full solid second for incredible muscle fiber recruiting.",
    safetyWarnings: "Squeeze tight; do not let the rope snap upward and strain your joints."
  },
  {
    id: "ex-bicep-curl",
    name: "Dumbbell Incline Bicep Curl",
    muscleGroup: "Arms (Biceps Brachii)",
    difficulty: "Beginner",
    sets: 3,
    reps: "10-12",
    rest: "60s",
    instructions: [
      "Recline on an incline bench set to 40-45 degrees, weights hanging down.",
      "Turn your palms forward and lock your shoulder sockets in place.",
      "Curl the dumbbells up in an arc, squeezing your biceps hard at the peak.",
      "Slowly lower the dumbbells to full extension, resisting gravity all the way."
    ],
    mistakes: [
      "Swinging elbows forward to cheat the weights up.",
      "Allowing wrists to limp at the top."
    ],
    coachingNotes: "Because you are on an incline, the bicep's long head is placed under a severe stretch at the bottom. Start from a dead stop each rep.",
    videoPlaceholder: "arms_bicep",
    properFormGuide: "The elbows must stay pinned behind your rib line. The only moving part is your forearm.",
    breathingInstructions: "Inhale as you extend the weights down; exhale fully on the curl squeeze.",
    trainingTips: "At the peak, squeeze your pinkies outward to maximize the bicep supination squeeze.",
    safetyWarnings: "If you feel tendons snapping or elbow pressure, reduce weight or adjust incline angle."
  }
];

export const WORKOUT_PROGRAMS: WorkoutProgram[] = [
  {
    id: "program-ppl",
    title: "Apex Hypertrophy Split (Push/Pull/Legs)",
    tagline: "Build foundational mass and raw athletic power in 3 target-focused sessions per loop.",
    difficulty: "Intermediate to Advanced",
    durationWeeks: 12,
    frequency: "5-6 days/week",
    creatorNotes: "Standard Push/Pull/Legs gives you the perfect frequency and recovery ratio. Try to progress on every single lift, even if it's adding 1 more repetition or 1 lb.",
    days: [
      {
        id: "day-push",
        name: "Day 1: Push (Chest, Shoulders, Triceps)",
        target: "Upper body pushing mechanics and shoulder mass",
        duration: "65 min",
        exercises: [
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-bench-press")!, sets: 4, reps: "6-8" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-incline-db-press")!, sets: 3, reps: "8-10" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-overhead-press")!, sets: 3, reps: "6-8" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-tricep-pushdown")!, sets: 3, reps: "12-15" }
        ]
      },
      {
        id: "day-pull",
        name: "Day 2: Pull (Back, Rear Delts, Biceps)",
        target: "V-Taper frame and secondary pull elements",
        duration: "60 min",
        exercises: [
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-barbell-row")!, sets: 4, reps: "8-10" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-lat-pulldown")!, sets: 3, reps: "10-12" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-bicep-curl")!, sets: 3, reps: "10-12" }
        ]
      },
      {
        id: "day-legs",
        name: "Day 3: Legs (Quads, Hamstrings, Calves)",
        target: "Glute, hamstring and quad structural overload",
        duration: "70 min",
        exercises: [
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-squat")!, sets: 4, reps: "6-8" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-romanian-deadlift")!, sets: 3, reps: "8-10" }
        ]
      }
    ]
  },
  {
    id: "program-shred",
    title: "Metabolic Shred & Sculpt",
    tagline: "Unleash rapid conditioning and body recomposition while maintaining raw muscular tissue.",
    difficulty: "Beginner to Intermediate",
    durationWeeks: 8,
    frequency: "4 days/week",
    creatorNotes: "Workouts are shorter but extremely high intensity. Focus on keeping your rest periods strictly under 75 seconds to maintain high metabolic output.",
    days: [
      {
        id: "day-met-upper",
        name: "Day 1: Upper Body Core Volumizer",
        target: "Chest, upper back, and high heart-rate intervals",
        duration: "45 min",
        exercises: [
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-incline-db-press")!, sets: 4, reps: "12-15" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-lat-pulldown")!, sets: 4, reps: "12-15" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-tricep-pushdown")!, sets: 3, reps: "15" }
        ]
      },
      {
        id: "day-met-lower",
        name: "Day 2: Lower Body Quad Focus & Hinge",
        target: "Lower body depletion work",
        duration: "50 min",
        exercises: [
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-squat")!, sets: 4, reps: "12" },
          { ...EXERCISE_LIBRARY.find(e => e.id === "ex-romanian-deadlift")!, sets: 4, reps: "12" }
        ]
      }
    ]
  }
];

export const SAMPLE_MEAL_PLANS = [
  {
    id: "plan-bulk",
    name: "Lean Gains Bulking (3,000 kcal)",
    description: "Designed for steady muscle mass acquisition without excessive fat gain.",
    macros: { targetCalories: 3000, targetProtein: 185, targetCarbs: 350, targetFats: 90 },
    meals: [
      { name: "Apex Power Oats", carbs: "80g", protein: "40g", fats: "15g", kcal: 620 },
      { name: "Cream of Rice & Grass-Fed Beef", carbs: "90g", protein: "48g", fats: "20g", kcal: 730 },
      { name: "Pre-Workout Shake & Banana", carbs: "40g", protein: "25g", fats: "2g", kcal: 280 },
      { name: "Wild Salmon, Jasmine Rice, Broccoli", carbs: "100g", protein: "45g", fats: "25g", kcal: 810 },
      { name: "Casein Mousse & Peanut Butter", carbs: "40g", protein: "27g", fats: "28g", kcal: 560 }
    ]
  },
  {
    id: "plan-cut",
    name: "Metabolic Shredding (2,000 kcal)",
    description: "Optimized for deep fat loss while safeguarding full muscle mass.",
    macros: { targetCalories: 2000, targetProtein: 180, targetCarbs: 160, targetFats: 70 },
    meals: [
      { name: "Egg White Omelette with Mushrooms & Avocado", carbs: "12g", protein: "35g", fats: "18g", kcal: 350 },
      { name: "Lean Chicken Breast, Sweet Potato & Spinach", carbs: "45g", protein: "50g", fats: "8g", kcal: 450 },
      { name: "Greek Yogurt, Berries & Whey Protein", carbs: "25g", protein: "40g", fats: "6g", kcal: 310 },
      { name: "Grilled Cod Filet, Quinoa & Asparagus", carbs: "48g", protein: "45g", fats: "10g", kcal: 460 },
      { name: "Slow-Digerating Nightly Shake & Almonds", carbs: "30g", protein: "10g", fats: "28g", kcal: 430 }
    ]
  }
];

export const INITIAL_LOGGED_MEALS: Meal[] = [
  {
    id: "meal-1",
    name: "Morning Oat Bowl + Whey",
    type: "Breakfast",
    calories: 480,
    protein: 38,
    carbs: 60,
    fats: 10,
    loggedAt: "08:15"
  },
  {
    id: "meal-2",
    name: "Spiced Chicken & Greens",
    type: "Lunch",
    calories: 520,
    protein: 48,
    carbs: 45,
    fats: 12,
    loggedAt: "13:00"
  },
  {
    id: "meal-3",
    name: "Post-Workout Shake",
    type: "Snack",
    calories: 220,
    protein: 26,
    carbs: 15,
    fats: 3,
    loggedAt: "17:30"
  }
];

export const WEIGHT_HISTORY = [
  { Day: "May 1", Weight: 184.2 },
  { Day: "May 8", Weight: 183.5 },
  { Day: "May 15", Weight: 182.9 },
  { Day: "May 22", Weight: 182.4 },
  { Day: "May 29", Weight: 181.8 },
  { Day: "Jun 5", Weight: 181.2 },
  { Day: "Jun 10", Weight: 180.5 }
];

export const PROGRESS_PHOTOS: ProgressPhoto[] = [
  { id: "p1", date: "May 1, 2026", weight: 184.2, label: "Day 1 Baseline", imagePlaceholderColor: "bg-neutral-800" },
  { id: "p2", date: "May 15, 2026", weight: 182.9, label: "Week 2 Check-in", imagePlaceholderColor: "bg-neutral-700" },
  { id: "p3", date: "Jun 1, 2026", weight: 181.8, label: "Week 4 Conditioning", imagePlaceholderColor: "bg-neutral-600" },
  { id: "p4", date: "Jun 10, 2026", weight: 180.5, label: "Current Conditioning", imagePlaceholderColor: "bg-neutral-500" }
];

export const PERSONAL_RECORDS: PersonalRecord[] = [
  { id: "pr-1", exerciseName: "Barbell Bench Press", weight: 245, reps: 5, date: "2026-06-01" },
  { id: "pr-2", exerciseName: "Barbell Back Squat", weight: 315, reps: 4, date: "2026-05-28" },
  { id: "pr-3", exerciseName: "Standing Barbell OHP", weight: 145, reps: 6, date: "2026-06-05" }
];

export const SUBSCRIPTION_PLAN_TEMPLATES = [
  {
    id: "sub-month",
    name: "The Monthly Apex Athlete",
    price: 29.99,
    period: "month",
    benefits: [
      "Full premium workout splits",
      "Interactive meal logged tracker",
      "Custom nutrition guidelines",
      "Standard interactive AI Coach",
      "Progress analytics panel"
    ]
  },
  {
    id: "sub-year",
    name: "Apex Elite Year Pass",
    price: 199.99,
    period: "year",
    benefits: [
      "Access everything in monthly",
      "Save 44% compared to monthly billed",
      "Exclusive seasonal macro upgrades",
      "Priority coaching queue",
      "All future community splits"
    ],
    popular: true
  },
  {
    id: "sub-coaching",
    name: "Branded 1-on-1 VIP Elite",
    price: 149.99,
    period: "month",
    benefits: [
      "Personal premium workouts tailored directly",
      "Direct texting via custom chat portal",
      "Weekly video check-in reviews",
      "Unlimited workout file edits",
      "Fully customized physical merchandise"
    ]
  }
];

export const MOCK_MEMBERS: MockMember[] = [
  { id: "m1", name: "David K.", email: "david.k@icloud.com", plan: "Apex Elite Year Pass", status: "Active", joinedDate: "2026-05-12", mrr: 16.66 },
  { id: "m2", name: "Sarah J.", email: "sarah.jess@gmail.com", plan: "The Monthly Apex Athlete", status: "Active", joinedDate: "2026-06-01", mrr: 29.99 },
  { id: "m3", name: "Ethan Hunt", email: "ethan@imf.gov", plan: "Branded 1-on-1 VIP Elite", status: "Active", joinedDate: "2026-05-28", mrr: 149.99 },
  { id: "m4", name: "Elena Rostova", email: "elena.rostova@yandex.com", plan: "The Monthly Apex Athlete", status: "Active", joinedDate: "2026-04-15", mrr: 29.99 },
  { id: "m5", name: "Michael Chang", email: "mchang92@yahoo.com", plan: "Apex Elite Year Pass", status: "Active", joinedDate: "2026-05-20", mrr: 16.66 }
];
