/**
 * DesiFit Premium BMI Calculator — app.js
 * ============================================================
 * Features:
 *  - BMI, BMR (Mifflin-St Jeor), TDEE, Body Fat (US Navy),
 *    Lean Body Mass, Waist-to-Height, Waist-to-Hip ratios,
 *    BMI Prime, Ponderal Index, Healthy Weight Range,
 *    Ideal Body Weight (Devine formula), Daily Calorie needs
 *  - Metric / Imperial unit conversions
 *  - Animated gauge, progress rings, calorie bars
 *  - Personalized recommendations
 *  - History stored in localStorage
 *  - CSV & PDF (print) export
 *  - Share via URL / Web Share API / Twitter / WhatsApp
 *  - Three neon color themes (green / blue / purple)
 *  - Particle background, FAQ accordion
 *  - Fully accessible (ARIA, keyboard navigation)
 * ============================================================
 */

'use strict';

/* ============================================================
   CONSTANTS & CONFIGURATION
   ============================================================ */

const HISTORY_KEY = 'desifit_history';
const THEME_KEY = 'desifit_theme';

/** BMI category thresholds */
const BMI_CATEGORIES = [
  { max: 16, label: 'Severely Underweight', color: '#00bfff', score: 30 },
  { max: 18.5, label: 'Underweight', color: '#00bfff', score: 55 },
  { max: 25, label: 'Normal Weight', color: '#00ff88', score: 100 },
  { max: 30, label: 'Overweight', color: '#ffa500', score: 65 },
  { max: 35, label: 'Obese Class I', color: '#ff4500', score: 40 },
  { max: 40, label: 'Obese Class II', color: '#ff0040', score: 20 },
  { max: Infinity, label: 'Obese Class III', color: '#c0001e', score: 10 },
];

/** Ideal body fat ranges [male, female] */
const BF_RANGES = {
  athletic: [6, 14, 14, 20],
  fitness: [14, 17, 21, 24],
  normal: [18, 24, 25, 31],
  obese: [25, 100, 32, 100],
};

/** Calorie goal modifiers */
const CALORIE_GOALS = [
  { label: 'Extreme Cut (−1000)', modifier: -1000 },
  { label: 'Mild Cut (−500)', modifier: -500 },
  { label: 'Maintenance', modifier: 0 },
  { label: 'Mild Bulk (+300)', modifier: 300 },
  { label: 'Bulk (+500)', modifier: 500 },
];

/** FAQ data */
const FAQ_DATA = [
  {
    q: 'What is BMI and what are its limitations?',
    a: 'BMI (Body Mass Index) is a ratio of weight to height squared. It\'s a quick screening tool for body weight categories. However, it doesn\'t account for muscle mass, bone density, fat distribution, age, or ethnicity. Athletes may be classified as "overweight" despite very low body fat.'
  },
  {
    q: 'What is BMR and how is it calculated?',
    a: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain basic physiological functions. We use the Mifflin-St Jeor equation: Men: (10 × kg) + (6.25 × cm) − (5 × age) + 5. Women: (10 × kg) + (6.25 × cm) − (5 × age) − 161.'
  },
  {
    q: 'How is body fat estimated?',
    a: 'We use the US Navy Body Fat Formula, which requires neck, waist, and hip (females only) measurements. For males: 86.010 × log₁₀(waist − neck) − 70.041 × log₁₀(height) + 36.76. For females: 163.205 × log₁₀(waist + hip − neck) − 97.684 × log₁₀(height) − 78.387.'
  },
  {
    q: 'What is BMI Prime?',
    a: 'BMI Prime is the ratio of your BMI to 25 (the upper limit of normal weight). A BMI Prime > 1.0 indicates overweight. For example, a BMI of 30 gives a BMI Prime of 1.2.'
  },
  {
    q: 'What is the Ponderal Index?',
    a: 'Ponderal Index (PI) is similar to BMI but uses the cube root of height instead of the square. Formula: PI = kg / m³. Normal range is 11–14 kg/m³. It may be more accurate for very tall or very short individuals.'
  },
  {
    q: 'What is the Waist-to-Height ratio?',
    a: 'Waist-to-Height Ratio (WHtR) divides your waist circumference by your height. A healthy value is < 0.5. Values ≥ 0.5 indicate excess central adiposity regardless of BMI.'
  },
  {
    q: 'What is Ideal Body Weight (IBW)?',
    a: 'IBW is calculated using the Devine formula. Men: 50 + 2.3 × (inches over 5 feet). Women: 45.5 + 2.3 × (inches over 5 feet). It represents a healthy target weight for your height.'
  },
  {
    q: 'How is the healthy weight range determined?',
    a: 'The healthy weight range is calculated from BMI values 18.5 to 24.9, multiplied by height squared in meters. For example, for a 175 cm tall person: min = 18.5 × 1.75² = 56.6 kg, max = 24.9 × 1.75² = 76.2 kg.'
  },
  {
    q: 'Is my data stored or shared?',
    a: 'No data is ever sent to any server. All calculations happen locally in your browser, and history is saved only in your device\'s localStorage. Clearing browser data will remove your history.'
  },
  {
    q: 'What does TDEE mean?',
    a: 'TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor. It represents the total calories you burn per day including exercise. Eating at TDEE maintains your current weight.'
  }
];

/* ============================================================
   GOAL PLANS — Diet, Exercise, Macros for each goal
   ============================================================ */
const GOAL_PLANS = {
  'fat-loss': {
    title: '🔥 Fat Loss',
    summary: 'Calorie deficit with high protein to preserve muscle while burning fat.',
    macros: { protein: '40%', carbs: '30%', fat: '30%', note: 'Deficit: 400–600 kcal below TDEE' },
    diet: {
      nonveg: [
        { icon: '🥚', name: 'Eggs & Egg Whites', desc: 'High protein, keeps you full. 3–4 whole eggs + 3 whites at breakfast.', badge: 'Protein' },
        { icon: '🍗', name: 'Chicken Breast / Turkey', desc: 'Lean protein, very low fat. Grill, bake or air-fry — avoid frying.', badge: 'Lean Protein' },
        { icon: '🐟', name: 'Salmon & Tuna', desc: 'Omega-3 fats reduce inflammation and support fat metabolism.', badge: 'Healthy Fat' },
        { icon: '🥦', name: 'Broccoli, Spinach, Kale', desc: 'Low-calorie, high-fibre veggies. Fill half your plate with these.', badge: 'Low Cal' },
        { icon: '🍠', name: 'Sweet Potato & Oats', desc: 'Complex carbs for sustained energy. Eat around workouts.', badge: 'Complex Carb' },
        { icon: '🥗', name: 'Greek Yogurt & Cottage Cheese', desc: 'Slow-digesting casein protein — great for evening meals.', badge: 'Casein' },
        { icon: '🫐', name: 'Berries & Apples', desc: 'Low-sugar fruits high in fibre. Helps manage cravings.', badge: 'Low Sugar' },
        { icon: '🥤', name: 'Green Tea / Black Coffee', desc: 'Mild thermogenic effect; appetite suppression. Avoid sugar.', badge: 'Thermogenic' },
      ],
      veg: [
        { icon: '🥚', name: 'Eggs & Egg Whites', desc: 'High protein, keeps you full. 3–4 whole eggs + 3 whites at breakfast.', badge: 'Protein' },
        { icon: '🥗', name: 'Greek Yogurt & Cottage Cheese', desc: 'Slow-digesting casein protein — great for evening meals.', badge: 'Casein' },
        { icon: '🥛', name: 'Whey / Casein Protein', desc: 'Essential to hit protein targets without excess carbs/fat.', badge: 'Supplement' },
        { icon: '🌱', name: 'Tofu & Tempeh', desc: 'High protein, low calorie vegan staples. Great for fat loss.', badge: 'Plant Protein' },
        { icon: '🫘', name: 'Lentils & Beans', desc: 'High protein and fibre to keep you full and satisfied.', badge: 'High Fibre' },
        { icon: '🥦', name: 'Broccoli, Spinach, Kale', desc: 'Low-calorie, high-fibre veggies. Fill half your plate with these.', badge: 'Low Cal' },
        { icon: '🍠', name: 'Sweet Potato & Oats', desc: 'Complex carbs for sustained energy. Eat around workouts.', badge: 'Complex Carb' },
        { icon: '🫐', name: 'Berries & Apples', desc: 'Low-sugar fruits high in fibre. Helps manage cravings.', badge: 'Low Sugar' },
      ],
      vegan: [
        { icon: '🌱', name: 'Tofu & Tempeh', desc: 'High protein, low calorie vegan staples. Great for fat loss.', badge: 'Vegan Protein' },
        { icon: '🥛', name: 'Plant-Based Protein Powder', desc: 'Pea or soy isolate. Essential to hit protein targets.', badge: 'Supplement' },
        { icon: '🫘', name: 'Lentils & Beans', desc: 'High protein and fibre to keep you full and satisfied.', badge: 'High Fibre' },
        { icon: '🥦', name: 'Broccoli, Spinach, Kale', desc: 'Low-calorie, high-fibre veggies. Fill half your plate with these.', badge: 'Low Cal' },
        { icon: '🍠', name: 'Sweet Potato & Oats', desc: 'Complex carbs for sustained energy. Eat around workouts.', badge: 'Complex Carb' },
        { icon: '🥗', name: 'Soy / Almond Yogurt', desc: 'High protein snack. Look for unsweetened options.', badge: 'Snack' },
        { icon: '🫐', name: 'Berries & Apples', desc: 'Low-sugar fruits high in fibre. Helps manage cravings.', badge: 'Low Sugar' },
        { icon: '🥤', name: 'Green Tea / Black Coffee', desc: 'Mild thermogenic effect; appetite suppression. Avoid sugar.', badge: 'Thermogenic' },
      ]
    },
    avoid: [
      { icon: '🍕', name: 'Junk Food & Fast Food', desc: 'Ultra-processed, calorie-dense with no nutritional benefit.' },
      { icon: '🧃', name: 'Fruit Juices & Sodas', desc: 'Liquid calories spike insulin and add empty carbs.' },
      { icon: '🍺', name: 'Alcohol', desc: 'Slows fat oxidation and adds empty calories.' },
    ],
    exercise: [
      { icon: '🏃', name: 'HIIT Cardio', desc: '3–4×/week · 20–30 min intervals (40s on / 20s off). Burns fat in less time than steady-state.', badge: '3–4×/wk' },
      { icon: '🏋️', name: 'Strength Training', desc: '3–4×/week · Compound lifts (squat, deadlift, bench, row). Preserves muscle during deficit.', badge: '3–4×/wk' },
      { icon: '🚶', name: 'Daily Walking', desc: '7,000–10,000 steps/day. Low-impact NEAT (Non-Exercise Activity Thermogenesis).', badge: 'Daily' },
      { icon: '🧘', name: 'Yoga / Stretching', desc: '1–2×/week · Reduces cortisol, improves sleep quality — both crucial for fat loss.', badge: '1–2×/wk' },
      { icon: '🚴', name: 'Cycling / Elliptical', desc: 'On rest days · 30–45 min steady-state at 60–70% max heart rate.', badge: 'Rest Days' },
    ],
  },
  'muscle-build': {
    title: '💪 Muscle Build',
    summary: 'Calorie surplus with heavy progressive overload and high protein intake.',
    macros: { protein: '30%', carbs: '50%', fat: '20%', note: 'Surplus: 300–500 kcal above TDEE' },
    diet: {
      nonveg: [
        { icon: '🥩', name: 'Beef, Chicken & Salmon', desc: 'Primary protein sources. Aim for 1.6–2.2g protein per kg bodyweight daily.', badge: 'Protein' },
        { icon: '🍚', name: 'White Rice & Pasta', desc: 'Fast-digesting carbs — ideal pre/post workout to fuel and replenish glycogen.', badge: 'Fast Carb' },
        { icon: '🥔', name: 'Potatoes & Sweet Potatoes', desc: 'Calorie-dense whole food carbs. Easy to hit calorie surplus.', badge: 'Complex Carb' },
        { icon: '🥜', name: 'Peanut Butter & Nuts', desc: 'Calorie-dense healthy fats. Easy to add 200+ kcal to meals.', badge: 'Healthy Fat' },
        { icon: '🥛', name: 'Whole Milk & Greek Yogurt', desc: 'Protein + calories combo. Great for mass gain and recovery.', badge: 'Dairy' },
        { icon: '🍌', name: 'Bananas & Dates', desc: 'High-carb fruits great as pre-workout fuel or to hit calorie targets.', badge: 'Pre-Workout' },
        { icon: '🥚', name: 'Whole Eggs', desc: '6g protein + healthy fats + micronutrients. Eat the yolk.', badge: 'Complete Food' },
        { icon: '🧃', name: 'Mass Gainer Shake', desc: 'Oats + banana + milk + peanut butter + whey = 700+ kcal.', badge: 'Calorie Boost' },
      ],
      veg: [
        { icon: '🥛', name: 'Whole Milk & Greek Yogurt', desc: 'Protein + calories combo. Great for mass gain and recovery.', badge: 'Dairy' },
        { icon: '🥚', name: 'Whole Eggs', desc: '6g protein + healthy fats + micronutrients. Eat the yolk.', badge: 'Complete Food' },
        { icon: '🌱', name: 'Tofu, Tempeh & Seitan', desc: 'Primary protein sources. Eat in large quantities to hit targets.', badge: 'Plant Protein' },
        { icon: '🫘', name: 'Chickpeas & Lentils', desc: 'Great source of both carbs and protein for muscle building.', badge: 'Complex Food' },
        { icon: '🍚', name: 'White Rice & Pasta', desc: 'Fast-digesting carbs — ideal pre/post workout to fuel and replenish glycogen.', badge: 'Fast Carb' },
        { icon: '🥔', name: 'Potatoes & Sweet Potatoes', desc: 'Calorie-dense whole food carbs. Easy to hit calorie surplus.', badge: 'Complex Carb' },
        { icon: '🥜', name: 'Peanut Butter & Nuts', desc: 'Calorie-dense healthy fats. Easy to add 200+ kcal to meals.', badge: 'Healthy Fat' },
        { icon: '🧃', name: 'Mass Gainer Shake', desc: 'Oats + banana + milk + peanut butter + whey = 700+ kcal.', badge: 'Calorie Boost' },
      ],
      vegan: [
        { icon: '🌱', name: 'Tofu, Tempeh & Seitan', desc: 'Primary protein sources. Eat in large quantities to hit targets.', badge: 'Vegan Protein' },
        { icon: '🫘', name: 'Chickpeas & Lentils', desc: 'Great source of both carbs and protein for muscle building.', badge: 'Complex Food' },
        { icon: '🍚', name: 'White Rice & Pasta', desc: 'Fast-digesting carbs — ideal pre/post workout to fuel and replenish glycogen.', badge: 'Fast Carb' },
        { icon: '🥔', name: 'Potatoes & Sweet Potatoes', desc: 'Calorie-dense whole food carbs. Easy to hit calorie surplus.', badge: 'Complex Carb' },
        { icon: '🥜', name: 'Peanut Butter & Nuts', desc: 'Calorie-dense healthy fats. Easy to add 200+ kcal to meals.', badge: 'Healthy Fat' },
        { icon: '🥛', name: 'Soy Milk / Oat Milk', desc: 'Soy milk has similar protein to cow\'s milk. Great for shakes.', badge: 'Dairy Alt' },
        { icon: '🍌', name: 'Bananas & Dates', desc: 'High-carb fruits great as pre-workout fuel or to hit calorie targets.', badge: 'Pre-Workout' },
        { icon: '🧃', name: 'Mass Gainer Shake', desc: 'Oats + banana + soy milk + peanut butter + vegan protein = 700+ kcal.', badge: 'Calorie Boost' },
      ]
    },
    avoid: [
      { icon: '🥗', name: 'Extreme Low-Calorie Foods', desc: 'Salads and diet foods make it hard to hit your surplus.' },
      { icon: '🍺', name: 'Alcohol', desc: 'Suppresses testosterone, impairs protein synthesis and recovery.' },
      { icon: '🍩', name: 'Excessive Sugar / Junk', desc: 'Causes fat gain without muscle. Keep junk food under 10% of calories.' },
    ],
    exercise: [
      { icon: '🏋️', name: 'Heavy Compound Lifts', desc: 'Squat, Deadlift, Bench Press, Overhead Press, Barbell Row — 4–6 reps · 4–5 sets · 80–90% 1RM.', badge: '4–5×/wk' },
      { icon: '💪', name: 'Hypertrophy Isolation', desc: 'Curls, tricep ext, lateral raises, cable flyes — 8–12 reps · 3–4 sets · 70–80% 1RM.', badge: '3–4×/wk' },
      { icon: '📈', name: 'Progressive Overload', desc: 'Add weight or reps every 1–2 weeks. The core principle of muscle growth.', badge: 'Every Session' },
      { icon: '😴', name: 'Sleep 8–9 Hours', desc: 'Most muscle growth (GH release) happens during deep sleep. Non-negotiable.', badge: 'Daily' },
      { icon: '🧘', name: 'Deload Week', desc: 'Every 4–6 weeks, reduce volume by 40–50% to recover and come back stronger.', badge: 'Monthly' },
    ],
  },
  'weight-gain': {
    title: '📈 Weight Gain',
    summary: 'Aggressive calorie surplus to gain both muscle and body mass.',
    macros: { protein: '25%', carbs: '55%', fat: '20%', note: 'Surplus: 500–1000 kcal above TDEE' },
    diet: {
      nonveg: [
        { icon: '🍚', name: 'Rice, Pasta & Bread', desc: 'Easy-to-eat calorie-dense carbs. Make every meal carb-heavy.', badge: 'Calorie Dense' },
        { icon: '🥜', name: 'Nut Butters & Avocado', desc: '9 kcal/g of fat. Add to every meal — easiest way to spike calories.', badge: 'Fat Dense' },
        { icon: '🥛', name: 'Full-Fat Dairy', desc: 'Whole milk, cheese, cream — calorie-dense and high in protein.', badge: 'Dairy' },
        { icon: '🍳', name: 'Olive Oil Cooking', desc: 'Cook everything in olive oil to add 120 kcal per tablespoon.', badge: 'Calorie Boost' },
        { icon: '🥩', name: 'Fatty Meats (Beef, Lamb)', desc: 'More calorie-dense than lean meats. Include red meat 3–4×/week.', badge: 'High Cal' },
        { icon: '🥤', name: 'Calorie-Dense Smoothies', desc: 'Blend oats + whole milk + banana + peanut butter + honey = 700–900 kcal easily.', badge: 'Liquid Calories' },
        { icon: '🍫', name: 'Dark Chocolate 70%+', desc: 'Healthy fats + calories + antioxidants. 30–40g daily is fine.', badge: 'Healthy Treat' },
        { icon: '🫘', name: 'Legumes & Lentils', desc: 'Cheap, calorie-rich, protein-rich. Add to every meal as a side.', badge: 'Budget Friendly' },
      ],
      veg: [
        { icon: '🥛', name: 'Full-Fat Dairy', desc: 'Whole milk, cheese, cream — calorie-dense and high in protein.', badge: 'Dairy' },
        { icon: '🍚', name: 'Rice, Pasta & Bread', desc: 'Easy-to-eat calorie-dense carbs. Make every meal carb-heavy.', badge: 'Calorie Dense' },
        { icon: '🥜', name: 'Nut Butters & Avocado', desc: '9 kcal/g of fat. Add to every meal — easiest way to spike calories.', badge: 'Fat Dense' },
        { icon: '🍳', name: 'Olive Oil / Butter', desc: 'Cook everything in oil or butter to add 120 kcal per tablespoon.', badge: 'Calorie Boost' },
        { icon: '🌱', name: 'Seitan & Tempeh', desc: 'Very protein dense. Fry or bake with sauces for extra calories.', badge: 'High Cal' },
        { icon: '🥤', name: 'Calorie-Dense Smoothies', desc: 'Blend oats + milk + banana + peanut butter + honey = 700+ kcal.', badge: 'Liquid Calories' },
        { icon: '🍫', name: 'Dark Chocolate 70%+', desc: 'Healthy fats + calories + antioxidants. 30–40g daily is fine.', badge: 'Healthy Treat' },
        { icon: '🫘', name: 'Legumes & Lentils', desc: 'Cheap, calorie-rich, protein-rich. Add to every meal as a side.', badge: 'Budget Friendly' },
      ],
      vegan: [
        { icon: '🍚', name: 'Rice, Pasta & Bread', desc: 'Easy-to-eat calorie-dense carbs. Make every meal carb-heavy.', badge: 'Calorie Dense' },
        { icon: '🥜', name: 'Nut Butters & Avocado', desc: '9 kcal/g of fat. Add to every meal — easiest way to spike calories.', badge: 'Fat Dense' },
        { icon: '🥛', name: 'Coconut Milk / Soy Milk', desc: 'Calorie-dense plant milks. Use in curries and smoothies.', badge: 'Dairy Alt' },
        { icon: '🍳', name: 'Olive Oil Cooking', desc: 'Cook everything in olive oil to add 120 kcal per tablespoon.', badge: 'Calorie Boost' },
        { icon: '🌱', name: 'Seitan & Tempeh', desc: 'Very protein dense. Fry or bake with sauces for extra calories.', badge: 'High Cal' },
        { icon: '🥤', name: 'Calorie-Dense Smoothies', desc: 'Blend oats + soy milk + banana + peanut butter + maple syrup = 700+ kcal.', badge: 'Liquid Calories' },
        { icon: '🍫', name: 'Dark Chocolate 70%+', desc: 'Healthy fats + calories + antioxidants. 30–40g daily is fine.', badge: 'Healthy Treat' },
        { icon: '🫘', name: 'Legumes & Lentils', desc: 'Cheap, calorie-rich, protein-rich. Add to every meal as a side.', badge: 'Budget Friendly' },
      ]
    },
    avoid: [
      { icon: '💧', name: 'Drinking Water Before Meals', desc: 'Fills stomach, reduces appetite. Drink after meals instead.' },
      { icon: '🥗', name: 'Diet Foods & Low-Cal Options', desc: 'Avoid light/diet versions of everything — get full-fat.' },
    ],
    exercise: [
      { icon: '🏋️', name: 'Heavy Strength Training', desc: 'Full body or PPL (Push-Pull-Legs) split · 3–5 days/week. Focus on compound movements.', badge: '3–5×/wk' },
      { icon: '🐢', name: 'Minimal Cardio', desc: 'At most 1–2 light cardio sessions to maintain heart health. Don\'t burn your surplus.', badge: '1–2×/wk' },
      { icon: '📈', name: 'Track Your Calories', desc: 'Use a food scale. You MUST eat more than you burn — track to confirm.', badge: 'Daily' },
      { icon: '😴', name: 'Maximize Sleep', desc: '8–9 hours. Growth hormone peaks during deep sleep — critical for weight gain.', badge: 'Daily' },
    ],
  },
  'leaning': {
    title: '⚡ Leaning (Body Recomp)',
    summary: 'Simultaneous fat loss & muscle gain at maintenance calories using periodization.',
    macros: { protein: '40%', carbs: '35%', fat: '25%', note: 'Near Maintenance: ±100–200 kcal of TDEE' },
    diet: {
      nonveg: [
        { icon: '🍗', name: 'Chicken Breast & White Fish', desc: 'Very lean proteins — high protein, low calorie, zero fat. Foundation of every meal.', badge: 'Lean Protein' },
        { icon: '🥚', name: 'Egg Whites + Whole Eggs', desc: '4 whites + 1 whole egg = high protein, moderate calories. Perfect ratio.', badge: 'Protein' },
        { icon: '🥦', name: 'High-Volume Vegetables', desc: 'Fill 50% of your plate with veggies — creates fullness at minimal calories.', badge: 'Volume Eating' },
        { icon: '🍠', name: 'Sweet Potato & Brown Rice', desc: 'Eat carbs primarily around training. Carb-cycle for best results.', badge: 'Carb Timing' },
        { icon: '🫐', name: 'Berries & Citrus Fruits', desc: 'Low-sugar, high-fibre fruits that support fat burning and recovery.', badge: 'Low Sugar' },
        { icon: '🥗', name: 'Greek Yogurt (0% Fat)', desc: 'High protein snack. Add berries for a filling, low-calorie dessert.', badge: 'Snack' },
        { icon: '💧', name: 'Water & Green Tea', desc: 'Stay hydrated. Green tea boosts metabolism by 3–4%. Aim 3L water/day.', badge: 'Hydration' },
      ],
      veg: [
        { icon: '🥚', name: 'Egg Whites + Whole Eggs', desc: '4 whites + 1 whole egg = high protein, moderate calories. Perfect ratio.', badge: 'Protein' },
        { icon: '🥗', name: 'Greek Yogurt (0% Fat)', desc: 'High protein snack. Add berries for a filling, low-calorie dessert.', badge: 'Snack' },
        { icon: '🌱', name: 'Tofu & Seitan', desc: 'Lean plant proteins. Essential for body recomp.', badge: 'Lean Protein' },
        { icon: '🥛', name: 'Whey Protein Isolate', desc: 'Essential to keep protein high while keeping calories/carbs in check.', badge: 'Protein' },
        { icon: '🥦', name: 'High-Volume Vegetables', desc: 'Fill 50% of your plate with veggies — creates fullness at minimal calories.', badge: 'Volume Eating' },
        { icon: '🍠', name: 'Sweet Potato & Brown Rice', desc: 'Eat carbs primarily around training. Carb-cycle for best results.', badge: 'Carb Timing' },
        { icon: '🫐', name: 'Berries & Citrus Fruits', desc: 'Low-sugar, high-fibre fruits that support fat burning and recovery.', badge: 'Low Sugar' },
        { icon: '💧', name: 'Water & Green Tea', desc: 'Stay hydrated. Green tea boosts metabolism by 3–4%. Aim 3L water/day.', badge: 'Hydration' },
      ],
      vegan: [
        { icon: '🌱', name: 'Tofu & Seitan', desc: 'Lean plant proteins. Essential for body recomp on a plant-based diet.', badge: 'Lean Protein' },
        { icon: '🥛', name: 'Plant Protein Powder', desc: 'Essential to keep protein high while keeping calories/carbs in check.', badge: 'Protein' },
        { icon: '🥦', name: 'High-Volume Vegetables', desc: 'Fill 50% of your plate with veggies — creates fullness at minimal calories.', badge: 'Volume Eating' },
        { icon: '🍠', name: 'Sweet Potato & Brown Rice', desc: 'Eat carbs primarily around training. Carb-cycle for best results.', badge: 'Carb Timing' },
        { icon: '🫐', name: 'Berries & Citrus Fruits', desc: 'Low-sugar, high-fibre fruits that support fat burning and recovery.', badge: 'Low Sugar' },
        { icon: '🥗', name: 'Soy Yogurt (Unsweetened)', desc: 'High protein snack. Add berries for a filling, low-calorie dessert.', badge: 'Snack' },
        { icon: '💧', name: 'Water & Green Tea', desc: 'Stay hydrated. Green tea boosts metabolism by 3–4%. Aim 3L water/day.', badge: 'Hydration' },
      ]
    },
    avoid: [
      { icon: '🍞', name: 'Refined Carbs', desc: 'White bread, white rice outside workouts — spike insulin and store fat.' },
      { icon: '🍺', name: 'Alcohol', desc: 'Pauses fat burning for 24–48 hours after consumption.' },
    ],
    exercise: [
      { icon: '🏋️', name: 'Resistance Training', desc: '4–5×/week · 10–15 rep range · moderate weight. Stimulates muscle while burning calories.', badge: '4–5×/wk' },
      { icon: '🏃', name: 'Moderate Cardio', desc: '2–3×/week · 25–35 min · Zone 2 heart rate (60–70% max HR). Maximizes fat oxidation.', badge: '2–3×/wk' },
      { icon: '⚡', name: 'Carb Cycling', desc: 'High carbs on training days, low carbs on rest days. Optimizes recomposition.', badge: 'Nutrition' },
      { icon: '😴', name: 'Quality Sleep', desc: '7–9 hours. Sleep debt increases cortisol which directly blocks fat loss.', badge: 'Daily' },
      { icon: '🧘', name: 'Yoga / Mobility Work', desc: '1–2×/week · Reduces inflammation and injury risk during high-frequency training.', badge: '1–2×/wk' },
    ],
  },
  'cutting': {
    title: '✂️ Cutting (Aggressive Deficit)',
    summary: 'Aggressive fat loss with strict deficit while protecting hard-earned muscle.',
    macros: { protein: '45%', carbs: '25%', fat: '30%', note: 'Deficit: 700–1000 kcal below TDEE' },
    diet: {
      nonveg: [
        { icon: '🍗', name: 'Chicken Breast, Turkey, Tilapia', desc: 'Ultra-lean proteins only. Calorie budget is tight — every gram of protein counts.', badge: 'Must Eat' },
        { icon: '🥚', name: 'Egg Whites (Bulk)', desc: '1 egg white = 17 kcal, 4g protein. Replace whole eggs during a cut.', badge: 'Low Cal' },
        { icon: '🌿', name: 'Leafy Greens (Unlimited)', desc: 'Spinach, arugula, kale, romaine — eat as much as you want. Near-zero calories.', badge: 'Unlimited' },
        { icon: '🍵', name: 'Green Tea & Black Coffee', desc: 'Suppress appetite and boost metabolism without any calories.', badge: 'Appetite Ctrl' },
        { icon: '💊', name: 'Whey Protein Isolate', desc: 'Lowest calorie protein supplement. 25g protein, 110 kcal — use to hit protein targets.', badge: 'Supplement' },
        { icon: '🥒', name: 'Cucumbers, Celery, Broccoli', desc: 'Negative-calorie effect foods. Eat to fight hunger during deficit.', badge: 'Anti-Hunger' },
        { icon: '🍋', name: 'Lemon Water', desc: 'Flavour water without calories. Helps digestion and keeps appetite managed.', badge: 'Hydration' },
      ],
      veg: [
        { icon: '🥚', name: 'Egg Whites (Bulk)', desc: '1 egg white = 17 kcal, 4g protein. Replace whole eggs during a cut.', badge: 'Low Cal' },
        { icon: '🥛', name: 'Whey Protein Isolate', desc: 'Lowest calorie protein supplement. 25g protein, 110 kcal — use to hit protein targets.', badge: 'Supplement' },
        { icon: '🌱', name: 'Seitan & Extra Firm Tofu', desc: 'Ultra-lean plant proteins. Avoid fatty vegan substitutes.', badge: 'Must Eat' },
        { icon: '🌿', name: 'Leafy Greens (Unlimited)', desc: 'Spinach, arugula, kale, romaine — eat as much as you want. Near-zero calories.', badge: 'Unlimited' },
        { icon: '🍵', name: 'Green Tea & Black Coffee', desc: 'Suppress appetite and boost metabolism without any calories.', badge: 'Appetite Ctrl' },
        { icon: '🥒', name: 'Cucumbers, Celery, Broccoli', desc: 'Negative-calorie effect foods. Eat to fight hunger during deficit.', badge: 'Anti-Hunger' },
        { icon: '🍋', name: 'Lemon Water', desc: 'Flavour water without calories. Helps digestion and keeps appetite managed.', badge: 'Hydration' },
      ],
      vegan: [
        { icon: '🌱', name: 'Seitan & Extra Firm Tofu', desc: 'Ultra-lean plant proteins. Avoid fatty vegan substitutes.', badge: 'Must Eat' },
        { icon: '🥛', name: 'Pea Protein Isolate', desc: 'Very low carb/fat. Use to hit protein targets without breaking calorie bank.', badge: 'Low Cal' },
        { icon: '🌿', name: 'Leafy Greens (Unlimited)', desc: 'Spinach, arugula, kale, romaine — eat as much as you want. Near-zero calories.', badge: 'Unlimited' },
        { icon: '🍵', name: 'Green Tea & Black Coffee', desc: 'Suppress appetite and boost metabolism without any calories.', badge: 'Appetite Ctrl' },
        { icon: '🥒', name: 'Cucumbers, Celery, Broccoli', desc: 'Negative-calorie effect foods. Eat to fight hunger during deficit.', badge: 'Anti-Hunger' },
        { icon: '🍋', name: 'Lemon Water', desc: 'Flavour water without calories. Helps digestion and keeps appetite managed.', badge: 'Hydration' },
      ]
    },
    avoid: [
      { icon: '🍚', name: 'High-Carb Foods', desc: 'Especially refined carbs — they spike insulin and prevent fat release.' },
      { icon: '🥜', name: 'Nuts & Nut Butters', desc: 'Easy to overeat — 30g peanut butter = 190 kcal. Measure strictly or avoid.' },
      { icon: '🍺', name: 'Alcohol', desc: 'Stops fat burning entirely for hours. Incompatible with a serious cut.' },
      { icon: '🍕', name: 'Processed / Restaurant Food', desc: 'Hidden calories and oils make tracking impossible.' },
    ],
    exercise: [
      { icon: '🏋️', name: 'Heavy Lifting (4–5 reps)', desc: 'Maintain strength-focused training even in deficit. Heavy weights signal muscle preservation.', badge: '4–5×/wk' },
      { icon: '🏃', name: 'Fasted LISS Cardio', desc: 'Morning fasted cardio 30–45 min at low intensity. Maximises fat burning.', badge: '4–5×/wk' },
      { icon: '🔥', name: 'HIIT Sessions', desc: '2×/week max. Short high-intensity intervals boost metabolism for 24h after.', badge: '2×/wk' },
      { icon: '🚶', name: '12,000+ Steps Daily', desc: 'Aggressive NEAT is the most sustainable way to boost daily energy expenditure.', badge: 'Daily' },
      { icon: '❌', name: 'Avoid Overtraining', desc: 'High deficit + high volume = muscle loss and hormonal disruption. Listen to your body.', badge: 'Warning' },
    ],
  },
  'abs': {
    title: '🎯 Six-Pack Abs',
    summary: 'Abs are made in the kitchen. Reduce body fat below 12% (M) or 20% (F) + targeted core work.',
    macros: { protein: '40%', carbs: '30%', fat: '30%', note: 'Slight deficit: 300–500 kcal below TDEE' },
    diet: {
      nonveg: [
        { icon: '🍗', name: 'High Protein Every Meal', desc: 'Protein preserves abs muscle while cutting fat. 2g per kg bodyweight minimum.', badge: 'Foundation' },
        { icon: '🥦', name: 'Non-Starchy Vegetables', desc: 'Fill up on broccoli, cucumber, spinach, peppers. High fibre reduces bloating.', badge: 'Anti-Bloat' },
        { icon: '💧', name: '3–4L Water Daily', desc: 'Flushes sodium, reduces water retention and bloating which hides abs.', badge: 'Must Do' },
        { icon: '🧂', name: 'Cut Sodium & Processed Food', desc: 'High sodium causes water retention and belly bloat. Avoid sauces, canned food.', badge: 'Critical' },
        { icon: '🍌', name: 'Potassium-Rich Foods', desc: 'Banana, avocado, sweet potato — balances sodium and reduces water retention.', badge: 'Anti-Bloat' },
        { icon: '🫚', name: 'Healthy Fats Only', desc: 'Olive oil, avocado, fish oils — reduce inflammation and support fat burning.', badge: 'Good Fat' },
        { icon: '🚫', name: 'Zero Alcohol & Zero Sugary Drinks', desc: 'These are the #1 cause of belly fat. Non-negotiable for visible abs.', badge: 'Rule #1' },
      ],
      veg: [
        { icon: '🥚', name: 'Egg Whites & Greek Yogurt', desc: 'High protein to preserve abs muscle while cutting fat.', badge: 'Foundation' },
        { icon: '🌱', name: 'Tofu, Tempeh, Seitan', desc: 'Lean plant proteins. Essential for abs definition.', badge: 'Foundation' },
        { icon: '🥦', name: 'Non-Starchy Vegetables', desc: 'Fill up on broccoli, cucumber, spinach, peppers. High fibre reduces bloating.', badge: 'Anti-Bloat' },
        { icon: '💧', name: '3–4L Water Daily', desc: 'Flushes sodium, reduces water retention and bloating which hides abs.', badge: 'Must Do' },
        { icon: '🧂', name: 'Cut Sodium & Processed Food', desc: 'High sodium causes water retention and belly bloat. Avoid sauces, canned food.', badge: 'Critical' },
        { icon: '🍌', name: 'Potassium-Rich Foods', desc: 'Banana, avocado, sweet potato — balances sodium and reduces water retention.', badge: 'Anti-Bloat' },
        { icon: '🫚', name: 'Healthy Fats Only', desc: 'Olive oil, avocado, chia seeds — reduce inflammation and support fat burning.', badge: 'Good Fat' },
        { icon: '🚫', name: 'Zero Alcohol & Zero Sugary Drinks', desc: 'These are the #1 cause of belly fat. Non-negotiable for visible abs.', badge: 'Rule #1' },
      ],
      vegan: [
        { icon: '🌱', name: 'High Protein Every Meal', desc: 'Tofu, tempeh, seitan. Protein preserves abs muscle while cutting fat.', badge: 'Foundation' },
        { icon: '🥦', name: 'Non-Starchy Vegetables', desc: 'Fill up on broccoli, cucumber, spinach, peppers. High fibre reduces bloating.', badge: 'Anti-Bloat' },
        { icon: '💧', name: '3–4L Water Daily', desc: 'Flushes sodium, reduces water retention and bloating which hides abs.', badge: 'Must Do' },
        { icon: '🧂', name: 'Cut Sodium & Processed Food', desc: 'High sodium causes water retention and belly bloat. Avoid sauces, canned food.', badge: 'Critical' },
        { icon: '🍌', name: 'Potassium-Rich Foods', desc: 'Banana, avocado, sweet potato — balances sodium and reduces water retention.', badge: 'Anti-Bloat' },
        { icon: '🫚', name: 'Healthy Fats Only', desc: 'Olive oil, avocado, chia seeds — reduce inflammation and support fat burning.', badge: 'Good Fat' },
        { icon: '🚫', name: 'Zero Alcohol & Zero Sugary Drinks', desc: 'These are the #1 cause of belly fat. Non-negotiable for visible abs.', badge: 'Rule #1' },
      ]
    },
    avoid: [
      { icon: '🍺', name: 'Alcohol', desc: 'Causes visceral belly fat accumulation. Even beer belly is real.' },
      { icon: '🧂', name: 'High-Sodium Foods', desc: 'Causes water retention over abs — makes them invisible even at low BF.' },
      { icon: '🫧', name: 'Carbonated Drinks', desc: 'Gas bloating makes your stomach look bigger. Even sparkling water.' },
    ],
    exercise: [
      { icon: '🔥', name: 'Core Circuit (Daily)', desc: 'Plank 60s · Hanging Leg Raises 15 · Cable Crunches 20 · Russian Twists 20 · Dead Bug 10. 3 rounds.', badge: 'Daily' },
      { icon: '🏋️', name: 'Compound Lifts', desc: 'Squat, deadlift, and overhead press heavily recruit the core — build a thick, strong midsection.', badge: '4×/wk' },
      { icon: '🏃', name: 'Fat-Burning Cardio', desc: 'HIIT 3×/week + 10,000 steps daily. Abs only show below ~12% BF (male) / 20% BF (female).', badge: '3×/wk' },
      { icon: '🦵', name: 'Dragon Flag', desc: 'The most effective abs exercise. Work up to 3 sets of 8 for shredded lower abs.', badge: 'Advanced' },
      { icon: '🧘', name: 'Vacuum Exercise', desc: 'Stomach vacuums 3×/day — trains the transverse abdominis for a tight, flat stomach.', badge: 'Daily' },
    ],
  },
};

/* ============================================================
   STATE
   ============================================================ */
let currentUnit = 'metric';
let currentGender = 'male';
let currentGoal = 'fat-loss';
let currentDietPref = 'nonveg';
let currentTheme = localStorage.getItem(THEME_KEY) || 'green';
let lastResults = null;
let particles = [];
let animFrameId = null;

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const dom = {
  body: $('app-body'),
  navBtns: $$('.nav-btn'),
  tabs: {
    calculator: $('tab-calculator'),
    history: $('tab-history'),
    faq: $('tab-faq'),
  },
  // Theme
  themeDots: $$('.theme-dot'),
  // Unit toggle
  unitMetric: $('unit-metric'),
  unitImperial: $('unit-imperial'),
  // Inputs - height
  heightCm: $('height-cm'),
  heightFt: $('height-ft'),
  heightIn: $('height-in'),
  heightMetric: $('height-metric-inputs'),
  heightImperial: $('height-imperial-inputs'),
  // Inputs - weight
  weightKg: $('weight-kg'),
  weightLbs: $('weight-lbs'),
  weightMetric: $('weight-metric-inputs'),
  weightImperial: $('weight-imperial-inputs'),
  // Inputs - other
  age: $('input-age'),
  activityLevel: $('activity-level'),
  bodyfat: $('input-bodyfat'),
  // Waist/hip/neck metric
  waistCm: $('waist-cm'),
  waistIn: $('waist-in'),
  waistMetric: $('waist-metric-inputs'),
  waistImperial: $('waist-imperial-inputs'),
  hipCm: $('hip-cm'),
  hipIn: $('hip-in'),
  hipMetric: $('hip-metric-inputs'),
  hipImperial: $('hip-imperial-inputs'),
  neckCm: $('neck-cm'),
  neckIn: $('neck-in'),
  neckMetric: $('neck-metric-inputs'),
  neckImperial: $('neck-imperial-inputs'),
  // Gender
  genderMale: $('gender-male'),
  genderFemale: $('gender-female'),
  // Optional collapsible
  optionalToggle: $('optional-toggle'),
  optionalBody: $('optional-body'),
  // Buttons
  calcBtn: $('calculate-btn'),
  resetBtn: $('reset-btn'),
  // Results
  emptyState: $('empty-state'),
  resultsContent: $('results-content'),
  // Gauge
  bmiValueDisplay: $('bmi-value-display'),
  bmiCategoryBadge: $('bmi-category-badge'),
  gaugeNeedle: $('gauge-needle'),
  gaugePivot: $('gauge-pivot'),
  gaugeProgress: $('gauge-progress'),
  scalePointer: $('scale-pointer'),
  // Metrics
  metricsGrid: $('metrics-grid'),
  // Rings
  ringBmi: $('ring-bmi'),
  ringFat: $('ring-fat'),
  ringHealth: $('ring-health'),
  ringBmiVal: $('ring-bmi-val'),
  ringFatVal: $('ring-fat-val'),
  ringHealthVal: $('ring-health-val'),
  // Calorie
  calorieBars: $('calorie-bars'),
  // Recommendations
  recoList: $('reco-list'),
  // Plan card
  planCardTitle: $('plan-card-title'),
  planPanelDiet: $('plan-panel-diet'),
  planPanelExercise: $('plan-panel-exercise'),
  planPanelMacros: $('plan-panel-macros'),
  planTabDiet: $('plan-tab-diet'),
  planTabExercise: $('plan-tab-exercise'),
  planTabMacros: $('plan-tab-macros'),
  goalGrid: $('goal-grid'),
  dietNonveg: $('diet-nonveg'),
  dietVeg: $('diet-veg'),
  dietVegan: $('diet-vegan'),
  // Actions
  saveHistoryBtn: $('save-history-btn'),
  exportCsvBtn: $('export-csv-btn'),
  exportPdfBtn: $('export-pdf-btn'),
  shareResultsBtn: $('share-results-btn'),
  // Header
  printBtn: $('print-btn'),
  shareBtn: $('share-btn'),
  // History
  historyList: $('history-list'),
  historyEmpty: $('history-empty'),
  historyChartCard: $('history-chart-card'),
  exportHistoryCsv: $('export-history-csv'),
  clearHistoryBtn: $('clear-history-btn'),
  // FAQ
  faqList: $('faq-list'),
  // Toast
  toast: $('toast'),
  // Share modal
  shareModal: $('share-modal'),
  shareUrl: $('share-url'),
  copyUrlBtn: $('copy-url-btn'),
  modalClose: $('modal-close'),
  shareTwitter: $('share-twitter'),
  shareWhatsapp: $('share-whatsapp'),
  // Canvas
  particleCanvas: $('particleCanvas'),
};

/* ============================================================
   PLAN CARD — DIET & EXERCISE RENDERING
   ============================================================ */
function renderPlanCard(goal) {
  const plan = GOAL_PLANS[goal];
  if (!plan) return;

  // Update card title
  if (dom.planCardTitle) dom.planCardTitle.textContent = plan.title + ' — Diet & Exercise Plan';

  /* ---- Diet Panel ---- */
  if (dom.planPanelDiet) {
    dom.planPanelDiet.innerHTML = `
      <p class="plan-goal-title">${plan.title}</p>
      <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:1rem;line-height:1.55">${plan.summary}</p>
      <div class="plan-section-label">✅ Foods to Eat</div>
      <div class="plan-items">
        ${plan.diet[currentDietPref].map((item, i) => `
          <div class="plan-item" style="animation-delay:${i * 0.05}s">
            <span class="plan-item-icon">${item.icon}</span>
            <div class="plan-item-body">
              <div class="plan-item-name">${item.name}</div>
              <div class="plan-item-desc">${item.desc}</div>
            </div>
            <span class="plan-item-badge">${item.badge}</span>
          </div>
        `).join('')}
      </div>
      ${plan.avoid ? `
        <div class="plan-section-label">❌ Foods to Avoid</div>
        <div class="plan-items">
          ${plan.avoid.map((item, i) => `
            <div class="plan-item" style="animation-delay:${(plan.diet[currentDietPref].length + i) * 0.05}s;border-color:rgba(255,68,68,0.2)">
              <span class="plan-item-icon">${item.icon}</span>
              <div class="plan-item-body">
                <div class="plan-item-name" style="color:#ff8888">${item.name}</div>
                <div class="plan-item-desc">${item.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    `;
  }

  /* ---- Exercise Panel ---- */
  if (dom.planPanelExercise) {
    dom.planPanelExercise.innerHTML = `
      <div class="plan-section-label">🏋️ Training Plan</div>
      <div class="plan-items">
        ${plan.exercise.map((item, i) => `
          <div class="plan-item" style="animation-delay:${i * 0.06}s">
            <span class="plan-item-icon">${item.icon}</span>
            <div class="plan-item-body">
              <div class="plan-item-name">${item.name}</div>
              <div class="plan-item-desc">${item.desc}</div>
            </div>
            <span class="plan-item-badge">${item.badge}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ---- Macros Panel ---- */
  if (dom.planPanelMacros) {
    dom.planPanelMacros.innerHTML = `
      <div class="plan-section-label">📊 Macro Targets</div>
      <div class="plan-macros">
        <div class="macro-box">
          <div class="macro-val">${plan.macros.protein}</div>
          <div class="macro-label">Protein</div>
        </div>
        <div class="macro-box">
          <div class="macro-val">${plan.macros.carbs}</div>
          <div class="macro-label">Carbs</div>
        </div>
        <div class="macro-box">
          <div class="macro-val">${plan.macros.fat}</div>
          <div class="macro-label">Fat</div>
        </div>
      </div>
      <p style="font-size:0.78rem;color:var(--text-secondary);margin-top:0.85rem;padding:0.7rem;border:1px solid var(--border);border-radius:var(--radius-sm);background:rgba(0,0,0,0.2);line-height:1.5">
        💡 <strong>Calorie Target:</strong> ${plan.macros.note}
      </p>
      <div class="plan-section-label" style="margin-top:1rem">📖 Macro Guide</div>
      <div class="plan-items">
        <div class="plan-item">
          <span class="plan-item-icon">🥩</span>
          <div class="plan-item-body">
            <div class="plan-item-name">Protein (4 kcal/g)</div>
            <div class="plan-item-desc">Chicken, eggs, fish, Greek yogurt, whey. Aim for ${plan.macros.protein} of total calories. Crucial for muscle preservation and satiety.</div>
          </div>
        </div>
        <div class="plan-item">
          <span class="plan-item-icon">🍚</span>
          <div class="plan-item-body">
            <div class="plan-item-name">Carbs (4 kcal/g)</div>
            <div class="plan-item-desc">Oats, rice, sweet potato, fruits. Aim for ${plan.macros.carbs} of calories. Primary fuel for training — time around workouts.</div>
          </div>
        </div>
        <div class="plan-item">
          <span class="plan-item-icon">🥑</span>
          <div class="plan-item-body">
            <div class="plan-item-name">Fat (9 kcal/g)</div>
            <div class="plan-item-desc">Olive oil, avocado, nuts, fatty fish. Aim for ${plan.macros.fat} of calories. Essential for hormones, joints, and brain function.</div>
          </div>
        </div>
      </div>
    `;
  }

  /* ---- Wire plan tab switching ---- */
  [dom.planTabDiet, dom.planTabExercise, dom.planTabMacros].forEach((tab, idx) => {
    if (!tab) return;
    tab.onclick = () => {
      [dom.planTabDiet, dom.planTabExercise, dom.planTabMacros].forEach(t => {
        if (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); }
      });
      [dom.planPanelDiet, dom.planPanelExercise, dom.planPanelMacros].forEach(p => {
        if (p) p.classList.remove('active');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panels = [dom.planPanelDiet, dom.planPanelExercise, dom.planPanelMacros];
      if (panels[idx]) panels[idx].classList.add('active');
    };
  });
}

/* ============================================================
   GOAL BUTTON INITIALIZATION
   ============================================================ */
function initGoalButtons() {
  const goalBtns = document.querySelectorAll('.goal-btn');
  goalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      goalBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentGoal = btn.dataset.goal;

      // If results are already shown, re-render the plan card
      if (lastResults) {
        renderPlanCard(currentGoal);
        showToast(`Goal set: ${GOAL_PLANS[currentGoal]?.title || currentGoal}`);
      }
    });
  });
}

function initDietButtons() {
  const btns = [dom.dietNonveg, dom.dietVeg, dom.dietVegan];
  btns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      
      currentDietPref = btn.id.replace('diet-', ''); // nonveg, veg, vegan
      
      if (lastResults) {
        renderPlanCard(currentGoal);
        const labels = { 'nonveg': 'Non-Veg', 'veg': 'Vegetarian', 'vegan': 'Vegan' };
        showToast(`Diet set to: ${labels[currentDietPref]}`);
      }
    });
  });
}

/* ============================================================
   PARTICLE BACKGROUND
   ============================================================ */
function initParticles() {
  const canvas = dom.particleCanvas;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  // Create particles
  particles = Array.from({ length: 60 }, () => createParticle(W, H));

  function createParticle(w, h, fromBottom = false) {
    return {
      x: Math.random() * w,
      y: fromBottom ? h + 10 : Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.4 + 0.1),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1,
      dAlpha: (Math.random() - 0.5) * 0.004,
    };
  }

  function getNeonColor() {
    const style = getComputedStyle(document.documentElement);
    // Read from CSS variable fallback
    const theme = dom.body.className.replace('theme-', '');
    if (dom.body.classList.contains('theme-blue')) return 'rgba(0, 212, 255,';
    if (dom.body.classList.contains('theme-purple')) return 'rgba(191, 0, 255,';
    return 'rgba(0, 255, 136,';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = getNeonColor();

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.dAlpha;

      if (p.alpha <= 0.05) p.dAlpha = Math.abs(p.dAlpha);
      if (p.alpha >= 0.6) p.dAlpha = -Math.abs(p.dAlpha);

      // Reset if out of view
      if (p.y < -10) {
        Object.assign(p, createParticle(W, H, true));
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${col} ${p.alpha})`;
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(draw);
  }

  draw();
}

/* ============================================================
   THEME MANAGEMENT
   ============================================================ */
function applyTheme(theme) {
  dom.body.className = `theme-${theme}`;
  currentTheme = theme;
  localStorage.setItem(THEME_KEY, theme);

  // Update active dot
  dom.themeDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.theme === theme);
  });
}

/* ============================================================
   UNIT TOGGLE LOGIC
   ============================================================ */
function setUnit(unit) {
  currentUnit = unit;

  const isMetric = unit === 'metric';

  dom.unitMetric.classList.toggle('active', isMetric);
  dom.unitImperial.classList.toggle('active', !isMetric);
  dom.unitMetric.setAttribute('aria-pressed', isMetric);
  dom.unitImperial.setAttribute('aria-pressed', !isMetric);

  // Toggle height inputs
  dom.heightMetric.classList.toggle('hidden', !isMetric);
  dom.heightImperial.classList.toggle('hidden', isMetric);

  // Toggle weight inputs
  dom.weightMetric.classList.toggle('hidden', !isMetric);
  dom.weightImperial.classList.toggle('hidden', isMetric);

  // Toggle waist/hip/neck inputs
  dom.waistMetric.classList.toggle('hidden', !isMetric);
  dom.waistImperial.classList.toggle('hidden', isMetric);
  dom.hipMetric.classList.toggle('hidden', !isMetric);
  dom.hipImperial.classList.toggle('hidden', isMetric);
  dom.neckMetric.classList.toggle('hidden', !isMetric);
  dom.neckImperial.classList.toggle('hidden', isMetric);

  // Cross-convert existing values
  convertExistingValues(isMetric);
}

function convertExistingValues(toMetric) {
  // Height
  if (toMetric) {
    const ft = parseFloat(dom.heightFt.value) || 0;
    const inches = parseFloat(dom.heightIn.value) || 0;
    if (ft || inches) {
      dom.heightCm.value = round((ft * 30.48) + (inches * 2.54), 1);
    }
    const lbs = parseFloat(dom.weightLbs.value);
    if (lbs) dom.weightKg.value = round(lbs / 2.20462, 1);
    const wIn = parseFloat(dom.waistIn.value);
    if (wIn) dom.waistCm.value = round(wIn * 2.54, 1);
    const hIn = parseFloat(dom.hipIn.value);
    if (hIn) dom.hipCm.value = round(hIn * 2.54, 1);
    const nIn = parseFloat(dom.neckIn.value);
    if (nIn) dom.neckCm.value = round(nIn * 2.54, 1);
  } else {
    const cm = parseFloat(dom.heightCm.value);
    if (cm) {
      const totalInches = cm / 2.54;
      dom.heightFt.value = Math.floor(totalInches / 12);
      dom.heightIn.value = round(totalInches % 12, 1);
    }
    const kg = parseFloat(dom.weightKg.value);
    if (kg) dom.weightLbs.value = round(kg * 2.20462, 1);
    const wCm = parseFloat(dom.waistCm.value);
    if (wCm) dom.waistIn.value = round(wCm / 2.54, 1);
    const hCm = parseFloat(dom.hipCm.value);
    if (hCm) dom.hipIn.value = round(hCm / 2.54, 1);
    const nCm = parseFloat(dom.neckCm.value);
    if (nCm) dom.neckIn.value = round(nCm / 2.54, 1);
  }
}

/* ============================================================
   COLLECT INPUTS → normalize to metric kg/cm
   ============================================================ */
function collectInputs() {
  let heightCm, weightKg, waistCm, hipCm, neckCm;

  if (currentUnit === 'metric') {
    heightCm = parseFloat(dom.heightCm.value) || null;
    weightKg = parseFloat(dom.weightKg.value) || null;
    waistCm = parseFloat(dom.waistCm.value) || null;
    hipCm = parseFloat(dom.hipCm.value) || null;
    neckCm = parseFloat(dom.neckCm.value) || null;
  } else {
    const ft = parseFloat(dom.heightFt.value) || 0;
    const inch = parseFloat(dom.heightIn.value) || 0;
    const totalCm = (ft * 30.48) + (inch * 2.54);
    heightCm = totalCm || null;

    const lbs = parseFloat(dom.weightLbs.value) || null;
    weightKg = lbs ? lbs / 2.20462 : null;

    const wIn = parseFloat(dom.waistIn.value) || null;
    waistCm = wIn ? wIn * 2.54 : null;
    const hIn = parseFloat(dom.hipIn.value) || null;
    hipCm = hIn ? hIn * 2.54 : null;
    const nIn = parseFloat(dom.neckIn.value) || null;
    neckCm = nIn ? nIn * 2.54 : null;
  }

  return {
    heightCm,
    weightKg,
    waistCm,
    hipCm,
    neckCm,
    age: parseFloat(dom.age.value) || null,
    gender: currentGender,
    activityLevel: parseFloat(dom.activityLevel.value),
    userBodyfat: parseFloat(dom.bodyfat.value) || null,
  };
}

/* ============================================================
   CALCULATION ENGINE
   ============================================================ */
function calculate(inp) {
  const { heightCm, weightKg, age, gender, activityLevel,
    waistCm, hipCm, neckCm, userBodyfat } = inp;

  if (!heightCm || !weightKg) return null;

  const h = heightCm / 100;  // meters
  const hM = h;

  /* ---- BMI ---- */
  const bmi = weightKg / (hM * hM);

  /* ---- BMI Category ---- */
  const cat = getBmiCategory(bmi);

  /* ---- BMI Prime ---- */
  const bmiPrime = bmi / 25;

  /* ---- Ponderal Index ---- */
  const ponderal = weightKg / (hM ** 3);

  /* ---- Healthy Weight Range ---- */
  const healthyMin = 18.5 * hM * hM;
  const healthyMax = 24.9 * hM * hM;

  /* ---- Ideal Body Weight (Devine) ---- */
  const heightInches = heightCm / 2.54;
  const inchesOver5ft = Math.max(0, heightInches - 60);
  const ibwMale = 50 + 2.3 * inchesOver5ft;
  const ibwFemale = 45.5 + 2.3 * inchesOver5ft;
  const ibw = gender === 'male' ? ibwMale : ibwFemale;

  /* ---- BMR (Mifflin-St Jeor) ---- */
  let bmr = null;
  if (age) {
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
  }

  /* ---- TDEE ---- */
  const tdee = bmr ? bmr * activityLevel : null;

  /* ---- Body Fat % (US Navy Formula) ---- */
  let bodyFatPct = userBodyfat || null;
  if (!bodyFatPct && waistCm && neckCm) {
    if (gender === 'male') {
      const val = 86.010 * Math.log10(waistCm - neckCm) - 70.041 * Math.log10(heightCm) + 36.76;
      bodyFatPct = Math.max(3, Math.min(60, val));
    } else if (hipCm) {
      const val = 163.205 * Math.log10(waistCm + hipCm - neckCm) - 97.684 * Math.log10(heightCm) - 78.387;
      bodyFatPct = Math.max(8, Math.min(60, val));
    }
  }

  /* ---- Lean Body Mass ---- */
  let leanMass = null;
  if (bodyFatPct !== null) {
    leanMass = weightKg * (1 - bodyFatPct / 100);
  } else {
    // Boer formula fallback
    if (gender === 'male') {
      leanMass = (0.407 * weightKg) + (0.267 * heightCm) - 19.2;
    } else {
      leanMass = (0.252 * weightKg) + (0.473 * heightCm) - 48.3;
    }
  }

  /* ---- Waist-to-Height Ratio ---- */
  const whr = waistCm ? waistCm / heightCm : null;

  /* ---- Waist-to-Hip Ratio ---- */
  const whr2 = (waistCm && hipCm) ? waistCm / hipCm : null;

  /* ---- Body Fat Score ---- */
  let fatScore = null;
  if (bodyFatPct !== null) {
    // Ideal ranges: Male 8-19%, Female 21-33%
    const idealMin = gender === 'male' ? 8 : 21;
    const idealMax = gender === 'male' ? 19 : 33;
    if (bodyFatPct < idealMin) {
      fatScore = Math.round(Math.max(40, 100 - (idealMin - bodyFatPct) * 5));
    } else if (bodyFatPct <= idealMax) {
      fatScore = 100;
    } else {
      fatScore = Math.round(Math.max(5, 100 - (bodyFatPct - idealMax) * 3));
    }
  }

  /* ---- Health Score ---- */
  const bmiScore = cat.score;
  const overallScore = fatScore !== null
    ? Math.round((bmiScore * 0.6) + (fatScore * 0.4))
    : bmiScore;

  /* ---- Calorie Goals ---- */
  const calorieGoals = tdee
    ? CALORIE_GOALS.map(g => ({ label: g.label, calories: Math.max(1200, Math.round(tdee + g.modifier)) }))
    : null;

  return {
    bmi: round(bmi, 1),
    bmiRaw: bmi,
    category: cat,
    bmiPrime: round(bmiPrime, 2),
    ponderal: round(ponderal, 1),
    healthyMin: round(healthyMin, 1),
    healthyMax: round(healthyMax, 1),
    ibw: round(ibw, 1),
    bmr: bmr ? Math.round(bmr) : null,
    tdee: tdee ? Math.round(tdee) : null,
    bodyFatPct: bodyFatPct ? round(bodyFatPct, 1) : null,
    leanMass: round(leanMass, 1),
    whr,
    whr2,
    bmiScore,
    fatScore,
    overallScore,
    calorieGoals,
    inputs: inp,
  };
}

function getBmiCategory(bmi) {
  return BMI_CATEGORIES.find(c => bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
}

/* ============================================================
   RENDER RESULTS
   ============================================================ */
function renderResults(r) {
  // Show results, hide empty state
  dom.emptyState.classList.add('hidden');
  dom.resultsContent.classList.remove('hidden');

  /* -- Gauge -- */
  updateGauge(r.bmi, r.category);

  /* -- Metrics Grid -- */
  renderMetricsGrid(r);

  /* -- Progress Rings -- */
  animateRing(dom.ringBmi, r.bmiScore, dom.ringBmiVal, `${r.bmiScore}%`);
  animateRing(dom.ringFat, r.fatScore ?? 50, dom.ringFatVal, r.fatScore != null ? `${r.fatScore}%` : 'N/A');
  animateRing(dom.ringHealth, r.overallScore, dom.ringHealthVal, `${r.overallScore}%`);

  /* -- Calorie Bars -- */
  renderCalorieBars(r);

  /* -- Recommendations -- */
  renderRecommendations(r);

  /* -- Diet & Exercise Plan -- */
  renderPlanCard(currentGoal);
}

/* ============================================================
   GAUGE UPDATE
   ============================================================ */
function updateGauge(bmi, cat) {
  const cx = 110, cy = 110, radius = 80;
  const startAngle = Math.PI;       // 180° (left)
  const endAngle = 2 * Math.PI;   // 360° (right) = top arc

  // Helper: angle → SVG point on arc
  function polarToXY(angle) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  function describeArc(a1, a2) {
    const s = polarToXY(a1);
    const e = polarToXY(a2);
    const large = (a2 - a1) > Math.PI ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  // Background arc
  $('gauge-bg').setAttribute('d', describeArc(startAngle, endAngle));
  $('gauge-bg').setAttribute('stroke', 'rgba(255,255,255,0.06)');

  // Colored segments: < 16 | 16-18.5 | 18.5-25 | 25-30 | 30-35 | 35-40+
  const range = [16, 18.5, 25, 30, 35, 40];
  const totalRange = 40 - 16;
  const colors = ['#00bfff', '#00bfff', '#00ff88', '#ffa500', '#ff4500', '#ff0040'];
  const segIds = ['gauge-seg-1', 'gauge-seg-2', 'gauge-seg-3', 'gauge-seg-4', 'gauge-seg-5'];
  const segs = [[16, 18.5], [18.5, 25], [25, 30], [30, 35], [35, 40]];
  const segCols = ['#00bfff', '#00ff88', '#ffa500', '#ff4500', '#ff0040'];

  segs.forEach(([s, e], i) => {
    const a1 = startAngle + ((s - 16) / totalRange) * Math.PI;
    const a2 = startAngle + ((e - 16) / totalRange) * Math.PI;
    const el = $(segIds[i]);
    el.setAttribute('d', describeArc(a1, a2));
    el.setAttribute('stroke', segCols[i]);
    el.setAttribute('stroke-opacity', '0.35');
  });

  // Clamp BMI to gauge range
  const bmiClamped = Math.max(16, Math.min(40, bmi));
  const progress = (bmiClamped - 16) / totalRange;
  const needleAngle = startAngle + progress * Math.PI;

  // Progress arc (highlight)
  const progArc = describeArc(startAngle, startAngle + progress * Math.PI);
  const gaugeProgress = $('gauge-progress');
  gaugeProgress.setAttribute('d', progArc);
  gaugeProgress.setAttribute('stroke', cat.color);
  gaugeProgress.setAttribute('stroke-opacity', '0.85');
  gaugeProgress.style.filter = `drop-shadow(0 0 6px ${cat.color})`;

  // Needle
  const needleX = cx + (radius - 16) * Math.cos(needleAngle);
  const needleY = cy + (radius - 16) * Math.sin(needleAngle);
  const needle = $('gauge-needle');
  needle.setAttribute('x2', needleX);
  needle.setAttribute('y2', needleY);
  needle.setAttribute('stroke', cat.color);
  needle.style.filter = `drop-shadow(0 0 4px ${cat.color})`;

  const pivot = $('gauge-pivot');
  pivot.setAttribute('fill', cat.color);
  pivot.style.filter = `drop-shadow(0 0 6px ${cat.color})`;

  // BMI value & badge
  dom.bmiValueDisplay.textContent = bmi.toFixed(1);
  dom.bmiValueDisplay.style.color = cat.color;
  dom.bmiValueDisplay.style.textShadow = `0 0 20px ${cat.color}80, 0 0 40px ${cat.color}40`;

  dom.bmiCategoryBadge.textContent = cat.label;
  dom.bmiCategoryBadge.style.color = cat.color;
  dom.bmiCategoryBadge.style.borderColor = cat.color;
  dom.bmiCategoryBadge.style.boxShadow = `0 0 12px ${cat.color}40`;
  dom.bmiCategoryBadge.style.background = `${cat.color}15`;

  // Scale pointer (0–100% of scale bar width)
  const pct = Math.max(0, Math.min(100, ((bmiClamped - 16) / totalRange) * 100));
  dom.scalePointer.style.left = `${pct}%`;
  dom.scalePointer.style.background = cat.color;
  dom.scalePointer.style.boxShadow = `0 0 8px ${cat.color}`;
}

/* ============================================================
   METRICS GRID
   ============================================================ */
function renderMetricsGrid(r) {
  const displayUnit = currentUnit;
  const toKgOrLbs = (kg) => displayUnit === 'metric'
    ? `${kg} kg`
    : `${round(kg * 2.20462, 1)} lbs`;

  const metrics = [
    {
      icon: '⚖️',
      value: r.bmi.toFixed(1),
      label: 'BMI',
      sub: `${r.category.label}`,
    },
    {
      icon: '💪',
      value: `${r.bmiPrime}`,
      label: 'BMI Prime',
      sub: r.bmiPrime < 1 ? 'Below normal weight' : r.bmiPrime === 1 ? 'Normal weight upper' : 'Above normal weight',
    },
    {
      icon: '🏛️',
      value: `${r.ponderal}`,
      label: 'Ponderal Index',
      sub: `kg/m³ · Normal: 11–14`,
    },
    {
      icon: '🎯',
      value: toKgOrLbs(r.ibw),
      label: 'Ideal Weight',
      sub: `Devine formula`,
    },
    {
      icon: '📏',
      value: `${toKgOrLbs(r.healthyMin)} – ${toKgOrLbs(r.healthyMax)}`,
      label: 'Healthy Weight Range',
      sub: `BMI 18.5 – 24.9`,
    },
    ...(r.bmr ? [{
      icon: '🔥',
      value: `${r.bmr}`,
      label: 'BMR',
      sub: `kcal/day at rest`,
    }] : []),
    ...(r.tdee ? [{
      icon: '⚡',
      value: `${r.tdee}`,
      label: 'TDEE',
      sub: `Total daily calories burned`,
    }] : []),
    ...(r.bodyFatPct !== null ? [{
      icon: '🫀',
      value: `${r.bodyFatPct}%`,
      label: 'Body Fat',
      sub: r.inputs.userBodyfat ? 'User provided' : 'US Navy estimate',
    }] : []),
    {
      icon: '🦴',
      value: toKgOrLbs(r.leanMass),
      label: 'Lean Body Mass',
      sub: `Fat-free mass`,
    },
    ...(r.whr !== null ? [{
      icon: '📐',
      value: round(r.whr, 2),
      label: 'Waist-to-Height',
      sub: r.whr < 0.5 ? '✓ Healthy (<0.5)' : '⚠ High (≥0.5)',
    }] : []),
    ...(r.whr2 !== null ? [{
      icon: '🔵',
      value: round(r.whr2, 2),
      label: 'Waist-to-Hip',
      sub: currentGender === 'male'
        ? (r.whr2 < 0.9 ? '✓ Low risk' : '⚠ High risk')
        : (r.whr2 < 0.85 ? '✓ Low risk' : '⚠ High risk'),
    }] : []),
  ];

  dom.metricsGrid.innerHTML = metrics
    .map((m, i) => `
      <div class="metric-card fade-in" data-delay="${Math.min(i + 1, 8)}">
        <div class="metric-icon">${m.icon}</div>
        <div class="metric-value">${m.value}</div>
        <div class="metric-label">${m.label}</div>
        <div class="metric-sub">${m.sub}</div>
      </div>
    `)
    .join('');
}

/* ============================================================
   PROGRESS RINGS
   ============================================================ */
function animateRing(ringEl, score, labelEl, displayVal) {
  const circumference = 2 * Math.PI * 30; // r=30
  const pct = Math.max(0, Math.min(100, score ?? 50));
  const dash = ((100 - pct) / 100) * circumference;

  // Animate
  setTimeout(() => {
    ringEl.style.strokeDashoffset = dash;
    const color = pct >= 80 ? 'var(--neon)' : pct >= 55 ? '#ffa500' : '#ff4444';
    ringEl.style.stroke = color;
    ringEl.style.filter = `drop-shadow(0 0 4px ${color})`;
  }, 100);

  labelEl.textContent = displayVal;
}

/* ============================================================
   CALORIE BARS
   ============================================================ */
function renderCalorieBars(r) {
  if (!r.calorieGoals) {
    dom.calorieBars.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;">Enter age to see calorie targets.</p>`;
    return;
  }

  const max = Math.max(...r.calorieGoals.map(g => g.calories));
  dom.calorieBars.innerHTML = r.calorieGoals.map((g, i) => `
    <div class="calorie-row" style="animation-delay:${i * 0.08}s">
      <div class="calorie-row-header">
        <span class="calorie-label">${g.label}</span>
        <span class="calorie-val">${g.calories.toLocaleString()} kcal</span>
      </div>
      <div class="calorie-bar-track">
        <div class="calorie-bar-fill" id="cbar-${i}" style="width:0%"></div>
      </div>
    </div>
  `).join('');

  // Animate widths
  setTimeout(() => {
    r.calorieGoals.forEach((g, i) => {
      const el = $(`cbar-${i}`);
      if (el) el.style.width = `${(g.calories / max) * 100}%`;
    });
  }, 200);
}

/* ============================================================
   RECOMMENDATIONS
   ============================================================ */
function renderRecommendations(r) {
  const cat = r.category.label.toLowerCase();
  const recos = [];

  /* BMI-based */
  if (cat.includes('underweight')) {
    recos.push({
      icon: '🥗',
      title: 'Increase Caloric Intake',
      text: 'Aim for a calorie surplus of 300–500 kcal/day with nutrient-dense foods. Focus on healthy fats, complex carbs, and protein.',
    });
    recos.push({
      icon: '🏋️',
      title: 'Strength Training',
      text: 'Incorporate resistance training 3–4x/week to build muscle mass along with increased calorie intake.',
    });
    recos.push({
      icon: '🩺',
      title: 'Medical Check-up',
      text: 'Consider consulting a healthcare provider if underweight is unexplained — it may indicate an underlying condition.',
    });
  } else if (cat.includes('normal')) {
    recos.push({
      icon: '✅',
      title: 'Maintain Your Healthy Weight',
      text: 'Excellent! Keep up your balanced lifestyle. Aim for 150 min moderate exercise/week and eat a varied diet.',
    });
    recos.push({
      icon: '🥦',
      title: 'Prioritize Food Quality',
      text: 'Focus on whole foods, lean proteins, healthy fats, and plenty of vegetables to sustain your ideal weight.',
    });
    recos.push({
      icon: '😴',
      title: 'Optimize Recovery',
      text: 'Ensure 7–9 hours of quality sleep nightly. Poor sleep can disrupt hunger hormones and lead to weight gain.',
    });
  } else if (cat.includes('overweight')) {
    recos.push({
      icon: '🔥',
      title: 'Aim for Moderate Deficit',
      text: `${r.tdee ? `Your TDEE is ~${r.tdee} kcal. ` : ''}A 300–500 kcal daily deficit leads to ~0.5 kg/week sustainable fat loss.`,
    });
    recos.push({
      icon: '🚶',
      title: 'Increase Daily Movement',
      text: 'Add 7,000–10,000 steps/day and 2–3 strength sessions/week. Small activity increases compound over time.',
    });
    recos.push({
      icon: '🧘',
      title: 'Manage Stress',
      text: 'High cortisol from stress promotes fat storage, especially around the abdomen. Consider mindfulness or yoga.',
    });
  } else {
    recos.push({
      icon: '🩺',
      title: 'Consult a Healthcare Professional',
      text: 'At this BMI range, working with a doctor or registered dietitian is strongly recommended for a safe, personalized plan.',
    });
    recos.push({
      icon: '🔥',
      title: 'Start with Small, Sustainable Changes',
      text: 'Even a 5–10% weight reduction significantly improves metabolic markers. Focus on consistency, not perfection.',
    });
    recos.push({
      icon: '💧',
      title: 'Hydration & Sleep',
      text: 'Drink 2–3L of water daily and prioritize 7–9h of sleep — both are powerful yet overlooked weight management tools.',
    });
  }

  /* Waist ratio recommendations */
  if (r.whr !== null && r.whr >= 0.5) {
    recos.push({
      icon: '📐',
      title: 'Reduce Central Adiposity',
      text: `Your waist-to-height ratio (${round(r.whr, 2)}) indicates excess abdominal fat. Prioritize cardio and a calorie deficit.`,
    });
  }

  /* Body fat recommendations */
  if (r.bodyFatPct !== null) {
    const idealMin = currentGender === 'male' ? 8 : 21;
    const idealMax = currentGender === 'male' ? 19 : 33;
    if (r.bodyFatPct > idealMax) {
      recos.push({
        icon: '🫀',
        title: 'Body Fat Reduction',
        text: `Your estimated body fat (${r.bodyFatPct}%) is above the fitness range (${idealMin}–${idealMax}%). Combine strength training with a moderate deficit.`,
      });
    }
  }

  /* Nutrition tip */
  recos.push({
    icon: '🥩',
    title: 'Protein Target',
    text: `Aim for ${round(r.inputs.weightKg * (currentUnit === 'metric' ? 1.6 : 0.72), 0)}g protein daily — helps preserve muscle during fat loss and supports satiety.`,
  });

  dom.recoList.innerHTML = recos.map((reco, i) => `
    <div class="reco-item fade-in" data-delay="${Math.min(i + 1, 8)}">
      <span class="reco-icon">${reco.icon}</span>
      <div class="reco-text">
        <strong>${reco.title}</strong>
        ${reco.text}
      </div>
    </div>
  `).join('');
}

/* ============================================================
   FAQ
   ============================================================ */
function renderFAQ() {
  dom.faqList.innerHTML = FAQ_DATA.map((item, i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}">
        ${item.q}
        <span class="faq-chevron" aria-hidden="true">▾</span>
      </button>
      <div class="faq-answer" id="faq-answer-${i}" aria-hidden="true">
        <div class="faq-answer-inner">${item.a}</div>
      </div>
    </div>
  `).join('');

  // FAQ toggle
  dom.faqList.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      dom.faqList.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   HISTORY
   ============================================================ */
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch { return []; }
}

function saveToHistory(r) {
  const history = getHistory();
  const entry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    bmi: r.bmi,
    category: r.category.label,
    color: r.category.color,
    weight: r.inputs.weightKg,
    height: r.inputs.heightCm,
    bodyFat: r.bodyFatPct,
    bmr: r.bmr,
    tdee: r.tdee,
  };
  history.unshift(entry);
  // Keep last 50
  if (history.length > 50) history.length = 50;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function renderHistory() {
  const history = getHistory();
  if (history.length === 0) {
    dom.historyList.innerHTML = '';
    dom.historyEmpty.classList.remove('hidden');
    dom.historyChartCard.classList.add('hidden');
    return;
  }

  dom.historyEmpty.classList.add('hidden');
  dom.historyChartCard.classList.remove('hidden');

  dom.historyList.innerHTML = history.map(entry => `
    <div class="history-item" data-id="${entry.id}">
      <span class="history-date">${entry.date}</span>
      <span class="history-bmi" style="color:${entry.color}">${entry.bmi}</span>
      <span class="history-cat" style="border-color:${entry.color};color:${entry.color}">${entry.category}</span>
      <span class="history-meta">
        ${entry.height ? entry.height + ' cm' : ''} · ${entry.weight ? round(entry.weight, 1) + ' kg' : ''}
        ${entry.bodyFat ? ' · ' + entry.bodyFat + '% BF' : ''}
        ${entry.tdee ? ' · ' + entry.tdee + ' kcal' : ''}
      </span>
      <button class="history-delete" data-id="${entry.id}" aria-label="Delete entry">✕</button>
    </div>
  `).join('');

  // Delete buttons
  dom.historyList.querySelectorAll('.history-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteHistoryEntry(parseInt(btn.dataset.id));
    });
  });

  renderHistoryChart(history);
}

function deleteHistoryEntry(id) {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  renderHistory();
  showToast('Entry deleted');
}

/* ============================================================
   HISTORY CHART (vanilla canvas — no dependencies!)
   ============================================================ */
function renderHistoryChart(history) {
  const canvas = $('historyChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [...history].reverse().slice(-20); // last 20 in chronological order

  if (data.length < 2) {
    canvas.style.display = 'none';
    return;
  }
  canvas.style.display = 'block';

  // Set canvas size
  canvas.width = canvas.parentElement.clientWidth - 40 || 600;
  canvas.height = 200;
  const W = canvas.width;
  const H = canvas.height;

  const padding = { top: 20, bottom: 40, left: 45, right: 20 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;

  const bmis = data.map(d => d.bmi);
  const minBmi = Math.max(10, Math.min(...bmis) - 2);
  const maxBmi = Math.min(50, Math.max(...bmis) + 2);

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  const gridCount = 5;
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= gridCount; i++) {
    const y = padding.top + (i / gridCount) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();

    // Y-axis labels
    const val = round(maxBmi - (i / gridCount) * (maxBmi - minBmi), 1);
    ctx.fillStyle = 'rgba(138,170,138,0.6)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val, padding.left - 6, y + 4);
  }

  // Healthy zone band (18.5 – 25)
  const hy1 = padding.top + ((maxBmi - 25) / (maxBmi - minBmi)) * chartH;
  const hy2 = padding.top + ((maxBmi - 18.5) / (maxBmi - minBmi)) * chartH;
  ctx.fillStyle = 'rgba(0,255,136,0.06)';
  ctx.fillRect(padding.left, hy1, chartW, hy2 - hy1);
  ctx.strokeStyle = 'rgba(0,255,136,0.2)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padding.left, hy1); ctx.lineTo(W - padding.right, hy1);
  ctx.moveTo(padding.left, hy2); ctx.lineTo(W - padding.right, hy2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Points
  const points = data.map((d, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + ((maxBmi - d.bmi) / (maxBmi - minBmi)) * chartH,
    bmi: d.bmi,
    color: d.color,
  }));

  // Line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0,255,136,0.6)';
  ctx.lineWidth = 2;
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Filled area
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.lineTo(points[points.length - 1].x, H - padding.bottom);
  ctx.lineTo(points[0].x, H - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,255,136,0.04)';
  ctx.fill();

  // Dots
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = p.color || '#00ff88';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // X labels (dates abbreviated)
  ctx.fillStyle = 'rgba(138,170,138,0.6)';
  ctx.font = '9px Inter, sans-serif';
  ctx.textAlign = 'center';
  const step = Math.ceil(data.length / 6);
  data.forEach((d, i) => {
    if (i % step === 0 || i === data.length - 1) {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const label = d.date.split(',')[0]; // short date
      ctx.fillText(label, x, H - 8);
    }
  });
}

/* ============================================================
   CSV EXPORT
   ============================================================ */
function exportCsv(data, filename) {
  const rows = [Object.keys(data[0]).join(',')];
  data.forEach(row => {
    rows.push(Object.values(row).map(v => `"${v ?? ''}"`).join(','));
  });
  downloadFile(rows.join('\n'), filename, 'text/csv');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function resultsToCsvRow(r) {
  return {
    Date: new Date().toISOString(),
    BMI: r.bmi,
    Category: r.category.label,
    BMIPrime: r.bmiPrime,
    Ponderal: r.ponderal,
    HeightCm: r.inputs.heightCm,
    WeightKg: round(r.inputs.weightKg, 2),
    IBW_kg: r.ibw,
    HealthyMin: r.healthyMin,
    HealthyMax: r.healthyMax,
    BMR_kcal: r.bmr ?? '',
    TDEE_kcal: r.tdee ?? '',
    BodyFat_pct: r.bodyFatPct ?? '',
    LeanMass_kg: r.leanMass,
    WaistHeight: r.whr != null ? round(r.whr, 3) : '',
    WaistHip: r.whr2 != null ? round(r.whr2, 3) : '',
    Age: r.inputs.age ?? '',
    Gender: r.inputs.gender,
    Activity: r.inputs.activityLevel,
  };
}

/* ============================================================
   SHARE / MODAL
   ============================================================ */
function buildShareText(r) {
  return `My DesiFit results: BMI ${r.bmi} (${r.category.label})` +
    (r.bodyFatPct ? `, Body Fat ${r.bodyFatPct}%` : '') +
    (r.tdee ? `, TDEE ${r.tdee} kcal` : '') +
    `. Calculate yours → ${location.href}`;
}

function openShareModal(r) {
  const text = buildShareText(r);
  const url = location.href;
  dom.shareUrl.value = url;

  dom.shareTwitter.onclick = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };
  dom.shareWhatsapp.onclick = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  dom.shareModal.classList.remove('hidden');
  dom.shareModal.querySelector('.modal-box').focus?.();
}

function closeShareModal() {
  dom.shareModal.classList.add('hidden');
}

/* ============================================================
   TOAST
   ============================================================ */
let toastTimer;
function showToast(msg, duration = 3000) {
  dom.toast.textContent = msg;
  dom.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove('show'), duration);
}

/* ============================================================
   NAVIGATION / TABS
   ============================================================ */
function switchTab(tab) {
  dom.navBtns.forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });

  Object.entries(dom.tabs).forEach(([key, el]) => {
    el.classList.toggle('active', key === tab);
    el.classList.toggle('hidden', key !== tab);
  });

  if (tab === 'history') renderHistory();
  if (tab === 'faq') renderFAQ();
}

/* ============================================================
   VALIDATION
   ============================================================ */
function validateInputs(inp) {
  const errors = [];
  if (!inp.heightCm) errors.push('Height is required.');
  if (!inp.weightKg) errors.push('Weight is required.');
  if (inp.heightCm && (inp.heightCm < 50 || inp.heightCm > 300)) errors.push('Height must be between 50–300 cm.');
  if (inp.weightKg && (inp.weightKg < 10 || inp.weightKg > 500)) errors.push('Weight must be between 10–500 kg.');
  if (inp.age && (inp.age < 2 || inp.age > 120)) errors.push('Age must be between 2–120 years.');
  return errors;
}

/* ============================================================
   RESET
   ============================================================ */
function resetAll() {
  [dom.heightCm, dom.heightFt, dom.heightIn, dom.weightKg, dom.weightLbs,
  dom.age, dom.waistCm, dom.waistIn, dom.hipCm, dom.hipIn,
  dom.neckCm, dom.neckIn, dom.bodyfat].forEach(el => { if (el) el.value = ''; });

  dom.emptyState.classList.remove('hidden');
  dom.resultsContent.classList.add('hidden');
  lastResults = null;
  showToast('All fields cleared');
}

/* ============================================================
   UTILITY
   ============================================================ */
function round(n, d) {
  return Math.round(n * 10 ** d) / 10 ** d;
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
function initEventListeners() {

  /* ---- Theme dots ---- */
  dom.themeDots.forEach(dot => {
    dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
  });

  /* ---- Nav tabs ---- */
  dom.navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  /* ---- Unit toggle ---- */
  dom.unitMetric.addEventListener('click', () => setUnit('metric'));
  dom.unitImperial.addEventListener('click', () => setUnit('imperial'));

  /* ---- Gender toggle ---- */
  dom.genderMale.addEventListener('click', () => {
    currentGender = 'male';
    dom.genderMale.classList.add('active');
    dom.genderFemale.classList.remove('active');
    dom.genderMale.setAttribute('aria-pressed', 'true');
    dom.genderFemale.setAttribute('aria-pressed', 'false');
  });

  dom.genderFemale.addEventListener('click', () => {
    currentGender = 'female';
    dom.genderFemale.classList.add('active');
    dom.genderMale.classList.remove('active');
    dom.genderFemale.setAttribute('aria-pressed', 'true');
    dom.genderMale.setAttribute('aria-pressed', 'false');
  });

  /* ---- Optional collapsible ---- */
  dom.optionalToggle.addEventListener('click', () => {
    const isExpanded = dom.optionalToggle.getAttribute('aria-expanded') === 'true';
    dom.optionalToggle.setAttribute('aria-expanded', !isExpanded);
    dom.optionalBody.setAttribute('aria-hidden', isExpanded);
    dom.optionalBody.classList.toggle('open', !isExpanded);
  });

  /* ---- Calculate button ---- */
  dom.calcBtn.addEventListener('click', () => {
    const inp = collectInputs();
    const errors = validateInputs(inp);

    if (errors.length > 0) {
      showToast('⚠ ' + errors[0]);
      return;
    }

    const results = calculate(inp);
    if (!results) {
      showToast('⚠ Could not calculate. Check your inputs.');
      return;
    }

    lastResults = results;
    renderResults(results);

    // Scroll to results on mobile
    if (window.innerWidth < 900) {
      document.getElementById('results-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ---- Allow Enter key to calculate ---- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.neon-input, .neon-select')) {
      dom.calcBtn.click();
    }
  });

  /* ---- Reset ---- */
  dom.resetBtn.addEventListener('click', resetAll);

  /* ---- Save to history ---- */
  dom.saveHistoryBtn.addEventListener('click', () => {
    if (!lastResults) { showToast('Calculate first!'); return; }
    saveToHistory(lastResults);
    showToast('✓ Saved to history');
  });

  /* ---- Export CSV ---- */
  dom.exportCsvBtn.addEventListener('click', () => {
    if (!lastResults) { showToast('Calculate first!'); return; }
    exportCsv([resultsToCsvRow(lastResults)], 'desifit-bmi.csv');
    showToast('✓ CSV downloaded');
  });

  /* ---- Export PDF (Print) ---- */
  dom.exportPdfBtn.addEventListener('click', () => {
    if (!lastResults) { showToast('Calculate first!'); return; }
    window.print();
  });

  /* ---- Share results ---- */
  dom.shareResultsBtn.addEventListener('click', () => {
    if (!lastResults) { showToast('Calculate first!'); return; }
    if (navigator.share) {
      navigator.share({
        title: 'My DesiFit BMI Results',
        text: buildShareText(lastResults),
        url: location.href,
      }).catch(() => { });
    } else {
      openShareModal(lastResults);
    }
  });

  /* ---- Header share/print buttons ---- */
  dom.shareBtn.addEventListener('click', () => {
    if (!lastResults) { showToast('Calculate first!'); return; }
    openShareModal(lastResults);
  });
  dom.printBtn.addEventListener('click', () => window.print());

  /* ---- Share modal ---- */
  dom.modalClose.addEventListener('click', closeShareModal);
  dom.shareModal.addEventListener('click', e => {
    if (e.target === dom.shareModal) closeShareModal();
  });
  dom.copyUrlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(dom.shareUrl.value)
      .then(() => showToast('✓ URL copied!'))
      .catch(() => showToast('Copy failed. Select URL manually.'));
  });

  /* ---- History actions ---- */
  dom.exportHistoryCsv.addEventListener('click', () => {
    const history = getHistory();
    if (!history.length) { showToast('No history to export.'); return; }
    exportCsv(history, 'desifit-history.csv');
    showToast('✓ History CSV downloaded');
  });

  dom.clearHistoryBtn.addEventListener('click', () => {
    if (!confirm('Clear all history? This cannot be undone.')) return;
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    showToast('History cleared');
  });

  /* ---- Tooltip keyboard support ---- */
  document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
    let tooltipEl;
    trigger.addEventListener('focus', () => {
      const id = trigger.getAttribute('aria-describedby');
      tooltipEl = document.getElementById(id);
      if (tooltipEl) tooltipEl.style.display = 'block';
    });
    trigger.addEventListener('blur', () => {
      if (tooltipEl) tooltipEl.style.display = '';
    });
  });

  /* ---- Resize history chart on window resize ---- */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const h = getHistory();
      if (h.length > 1) renderHistoryChart(h);
    }, 300);
  });
}

/* ============================================================
   REAL-TIME CALCULATION (auto-calc on change)
   ============================================================ */
function initRealTimeCalc() {
  const allInputs = [
    dom.heightCm, dom.heightFt, dom.heightIn,
    dom.weightKg, dom.weightLbs,
    dom.age, dom.activityLevel, dom.bodyfat,
    dom.waistCm, dom.waistIn, dom.hipCm, dom.hipIn,
    dom.neckCm, dom.neckIn,
  ];

  let debounceTimer;
  allInputs.forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const inp = collectInputs();
        const errors = validateInputs(inp);
        if (!errors.length) {
          const r = calculate(inp);
          if (r) {
            lastResults = r;
            renderResults(r);
          }
        }
      }, 400);
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  // Apply saved theme
  applyTheme(currentTheme);

  // Init goal buttons
  initGoalButtons();
  initDietButtons();

  // Init particles
  initParticles();

  // Init event listeners
  initEventListeners();

  // Init real-time calculation
  initRealTimeCalc();

  // Render FAQ
  renderFAQ();

  // Check URL params for pre-filled values (for share links)
  const params = new URLSearchParams(location.search);
  if (params.get('h') && params.get('w')) {
    dom.heightCm.value = params.get('h');
    dom.weightKg.value = params.get('w');
    if (params.get('a')) dom.age.value = params.get('a');
    if (params.get('g')) {
      currentGender = params.get('g');
      if (currentGender === 'female') dom.genderFemale.click();
    }
    // Auto-calculate
    setTimeout(() => dom.calcBtn.click(), 300);
  }

  // Show history count in tab if exists
  const histCount = getHistory().length;
  if (histCount > 0) {
    const navHistory = document.getElementById('nav-history');
    if (navHistory) navHistory.textContent = `History (${histCount})`;
  }

  console.log('%cDesiFit BMI Calculator v1.0', 'color: #00ff88; font-size: 16px; font-weight: bold;');
  console.log('%cAll calculations are performed locally. No data is sent to any server.', 'color: #8aaa8a;');
}

/* ============================================================
   KICK OFF
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);
