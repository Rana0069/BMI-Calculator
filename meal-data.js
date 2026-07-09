'use strict';

const FOOD_DB = {
  "chicken-breast": {
    "name": "Chicken Breast",
    "unit": "g",
    "cal": 165,
    "pro": 31,
    "carb": 0,
    "fat": 3.6,
    "fib": 0
  },
  "chicken-thigh": {
    "name": "Chicken Thigh",
    "unit": "g",
    "cal": 209,
    "pro": 26,
    "carb": 0,
    "fat": 11,
    "fib": 0
  },
  "eggs": {
    "name": "Whole Eggs",
    "unit": "g",
    "cal": 155,
    "pro": 13,
    "carb": 1.1,
    "fat": 11,
    "fib": 0
  },
  "egg-whites": {
    "name": "Egg Whites",
    "unit": "ml",
    "cal": 52,
    "pro": 11,
    "carb": 0.7,
    "fat": 0.2,
    "fib": 0
  },
  "salmon": {
    "name": "Salmon",
    "unit": "g",
    "cal": 208,
    "pro": 20,
    "carb": 0,
    "fat": 13,
    "fib": 0
  },
  "tuna-canned": {
    "name": "Tuna (canned)",
    "unit": "g",
    "cal": 116,
    "pro": 26,
    "carb": 0,
    "fat": 1,
    "fib": 0
  },
  "lean-beef": {
    "name": "Lean Beef",
    "unit": "g",
    "cal": 215,
    "pro": 26,
    "carb": 0,
    "fat": 12,
    "fib": 0
  },
  "turkey": {
    "name": "Turkey Breast",
    "unit": "g",
    "cal": 135,
    "pro": 30,
    "carb": 0,
    "fat": 1,
    "fib": 0
  },
  "shrimp": {
    "name": "Shrimp",
    "unit": "g",
    "cal": 99,
    "pro": 24,
    "carb": 0,
    "fat": 0.3,
    "fib": 0
  },
  "greek-yogurt": {
    "name": "Greek Yogurt (0%)",
    "unit": "g",
    "cal": 59,
    "pro": 10,
    "carb": 3.6,
    "fat": 0.4,
    "fib": 0
  },
  "cottage-cheese": {
    "name": "Cottage Cheese",
    "unit": "g",
    "cal": 98,
    "pro": 11,
    "carb": 3.4,
    "fat": 4.3,
    "fib": 0
  },
  "paneer": {
    "name": "Paneer",
    "unit": "g",
    "cal": 265,
    "pro": 18,
    "carb": 1.2,
    "fat": 20,
    "fib": 0
  },
  "milk-whole": {
    "name": "Whole Milk",
    "unit": "ml",
    "cal": 61,
    "pro": 3.2,
    "carb": 4.8,
    "fat": 3.3,
    "fib": 0
  },
  "milk-skim": {
    "name": "Skim Milk",
    "unit": "ml",
    "cal": 35,
    "pro": 3.4,
    "carb": 5,
    "fat": 0.2,
    "fib": 0
  },
  "whey-protein": {
    "name": "Whey Protein",
    "unit": "g",
    "cal": 400,
    "pro": 80,
    "carb": 10,
    "fat": 6,
    "fib": 0
  },
  "plant-protein": {
    "name": "Plant Protein Powder",
    "unit": "g",
    "cal": 380,
    "pro": 75,
    "carb": 12,
    "fat": 8,
    "fib": 1
  },
  "tofu-firm": {
    "name": "Firm Tofu",
    "unit": "g",
    "cal": 76,
    "pro": 8,
    "carb": 1.9,
    "fat": 4.8,
    "fib": 0.3
  },
  "tempeh": {
    "name": "Tempeh",
    "unit": "g",
    "cal": 193,
    "pro": 19,
    "carb": 9,
    "fat": 11,
    "fib": 1.4
  },
  "seitan": {
    "name": "Seitan",
    "unit": "g",
    "cal": 140,
    "pro": 25,
    "carb": 5,
    "fat": 2,
    "fib": 0.5
  },
  "edamame": {
    "name": "Edamame",
    "unit": "g",
    "cal": 121,
    "pro": 11,
    "carb": 9,
    "fat": 5,
    "fib": 5.2
  },
  "lentils-cooked": {
    "name": "Lentils",
    "unit": "g",
    "cal": 116,
    "pro": 9,
    "carb": 20,
    "fat": 0.4,
    "fib": 7.9
  },
  "chickpeas-cooked": {
    "name": "Chickpeas",
    "unit": "g",
    "cal": 164,
    "pro": 8.9,
    "carb": 27,
    "fat": 2.6,
    "fib": 7.6
  },
  "rajma-cooked": {
    "name": "Rajma (Kidney Beans)",
    "unit": "g",
    "cal": 127,
    "pro": 8.7,
    "carb": 22,
    "fat": 0.5,
    "fib": 7.4
  },
  "black-beans": {
    "name": "Black Beans",
    "unit": "g",
    "cal": 132,
    "pro": 8.9,
    "carb": 24,
    "fat": 0.5,
    "fib": 8.7
  },
  "dal-cooked": {
    "name": "Dal",
    "unit": "g",
    "cal": 116,
    "pro": 9,
    "carb": 20,
    "fat": 0.4,
    "fib": 5.5
  },
  "soy-chunks-cooked": {
    "name": "Soy Chunks",
    "unit": "g",
    "cal": 120,
    "pro": 18,
    "carb": 8,
    "fat": 0.5,
    "fib": 1
  },
  "soy-milk": {
    "name": "Soy Milk",
    "unit": "ml",
    "cal": 54,
    "pro": 3.3,
    "carb": 6.3,
    "fat": 1.8,
    "fib": 0.4
  },
  "oats": {
    "name": "Rolled Oats",
    "unit": "g",
    "cal": 389,
    "pro": 17,
    "carb": 66,
    "fat": 7,
    "fib": 10
  },
  "rice-white-cooked": {
    "name": "White Rice",
    "unit": "g",
    "cal": 130,
    "pro": 2.7,
    "carb": 28,
    "fat": 0.3,
    "fib": 0.4
  },
  "rice-brown-cooked": {
    "name": "Brown Rice",
    "unit": "g",
    "cal": 123,
    "pro": 2.7,
    "carb": 26,
    "fat": 1,
    "fib": 1.8
  },
  "sweet-potato": {
    "name": "Sweet Potato",
    "unit": "g",
    "cal": 86,
    "pro": 1.6,
    "carb": 20,
    "fat": 0.1,
    "fib": 3
  },
  "roti-wheat": {
    "name": "Whole Wheat Roti",
    "unit": "g",
    "cal": 264,
    "pro": 9,
    "carb": 53,
    "fat": 3,
    "fib": 7
  },
  "quinoa-cooked": {
    "name": "Quinoa",
    "unit": "g",
    "cal": 120,
    "pro": 4.4,
    "carb": 21,
    "fat": 1.9,
    "fib": 2.8
  },
  "pasta-whole": {
    "name": "Whole Wheat Pasta",
    "unit": "g",
    "cal": 131,
    "pro": 5.5,
    "carb": 26,
    "fat": 0.9,
    "fib": 3.9
  },
  "banana": {
    "name": "Banana",
    "unit": "g",
    "cal": 89,
    "pro": 1.1,
    "carb": 23,
    "fat": 0.3,
    "fib": 2.6
  },
  "apple": {
    "name": "Apple",
    "unit": "g",
    "cal": 52,
    "pro": 0.3,
    "carb": 14,
    "fat": 0.2,
    "fib": 2.4
  },
  "orange": {
    "name": "Orange",
    "unit": "g",
    "cal": 47,
    "pro": 0.9,
    "carb": 12,
    "fat": 0.1,
    "fib": 2.4
  },
  "berries": {
    "name": "Mixed Berries",
    "unit": "g",
    "cal": 57,
    "pro": 0.8,
    "carb": 14,
    "fat": 0.3,
    "fib": 2
  },
  "mango": {
    "name": "Mango",
    "unit": "g",
    "cal": 60,
    "pro": 0.8,
    "carb": 15,
    "fat": 0.4,
    "fib": 1.6
  },
  "dates": {
    "name": "Dates",
    "unit": "g",
    "cal": 282,
    "pro": 2.5,
    "carb": 75,
    "fat": 0.4,
    "fib": 8
  },
  "peanut-butter": {
    "name": "Peanut Butter",
    "unit": "g",
    "cal": 588,
    "pro": 25,
    "carb": 20,
    "fat": 50,
    "fib": 6
  },
  "almond-butter": {
    "name": "Almond Butter",
    "unit": "g",
    "cal": 614,
    "pro": 21,
    "carb": 19,
    "fat": 55,
    "fib": 7
  },
  "almonds": {
    "name": "Almonds",
    "unit": "g",
    "cal": 579,
    "pro": 21,
    "carb": 22,
    "fat": 50,
    "fib": 12.5
  },
  "walnuts": {
    "name": "Walnuts",
    "unit": "g",
    "cal": 654,
    "pro": 15,
    "carb": 14,
    "fat": 65,
    "fib": 6.7
  },
  "cashews": {
    "name": "Cashews",
    "unit": "g",
    "cal": 553,
    "pro": 18,
    "carb": 30,
    "fat": 44,
    "fib": 3.3
  },
  "avocado": {
    "name": "Avocado",
    "unit": "g",
    "cal": 160,
    "pro": 2,
    "carb": 9,
    "fat": 15,
    "fib": 6.7
  },
  "olive-oil": {
    "name": "Olive Oil",
    "unit": "ml",
    "cal": 884,
    "pro": 0,
    "carb": 0,
    "fat": 100,
    "fib": 0
  },
  "chia-seeds": {
    "name": "Chia Seeds",
    "unit": "g",
    "cal": 486,
    "pro": 17,
    "carb": 42,
    "fat": 31,
    "fib": 34
  },
  "flaxseeds": {
    "name": "Flaxseeds",
    "unit": "g",
    "cal": 534,
    "pro": 18,
    "carb": 29,
    "fat": 42,
    "fib": 27
  },
  "pumpkin-seeds": {
    "name": "Pumpkin Seeds",
    "unit": "g",
    "cal": 559,
    "pro": 30,
    "carb": 11,
    "fat": 49,
    "fib": 6
  },
  "broccoli": {
    "name": "Broccoli",
    "unit": "g",
    "cal": 34,
    "pro": 2.8,
    "carb": 7,
    "fat": 0.4,
    "fib": 2.6
  },
  "spinach": {
    "name": "Spinach",
    "unit": "g",
    "cal": 23,
    "pro": 2.9,
    "carb": 3.6,
    "fat": 0.4,
    "fib": 2.2
  },
  "kale": {
    "name": "Kale",
    "unit": "g",
    "cal": 35,
    "pro": 2.9,
    "carb": 4.4,
    "fat": 0.5,
    "fib": 4.1
  },
  "mixed-veg": {
    "name": "Mixed Vegetables",
    "unit": "g",
    "cal": 40,
    "pro": 2,
    "carb": 8,
    "fat": 0.3,
    "fib": 2.5
  },
  "cucumber": {
    "name": "Cucumber",
    "unit": "g",
    "cal": 15,
    "pro": 0.7,
    "carb": 3.6,
    "fat": 0.1,
    "fib": 0.5
  },
  "bell-pepper": {
    "name": "Bell Pepper",
    "unit": "g",
    "cal": 31,
    "pro": 1,
    "carb": 6,
    "fat": 0.3,
    "fib": 2.1
  },
  "mushrooms": {
    "name": "Mushrooms",
    "unit": "g",
    "cal": 22,
    "pro": 3.1,
    "carb": 3.3,
    "fat": 0.3,
    "fib": 1
  },
  "honey": {
    "name": "Honey",
    "unit": "g",
    "cal": 304,
    "pro": 0.3,
    "carb": 82,
    "fat": 0,
    "fib": 0.2
  }
};

const GOAL_CALORIE_OFFSETS = {"fat-loss":-500,"muscle-build":400,"weight-gain":700,"leaning":-100,"cutting":-700,"abs":-400};

const _MI = {
  sunrise: "🌅",
  apple:   "🍎",
  plate:   "🍽️",
  coffee:  "☕️",
  moon:    "🌙",
  sleep:   "💤",
};

const MEAL_TEMPLATES = { "fat-loss": { "nonveg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "egg-whites", "base": 200 }, { "food": "eggs", "base": 50 }, { "food": "oats", "base": 60 }, { "food": "berries", "base": 100 }, { "food": "milk-skim", "base": 150 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "almonds", "base": 15 }, { "food": "apple", "base": 150 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "chicken-breast", "base": 200 }, { "food": "rice-brown-cooked", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "spinach", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "apple", "base": 120 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "salmon", "base": 150 }, { "food": "sweet-potato", "base": 150 }, { "food": "mixed-veg", "base": 150 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "cottage-cheese", "base": 150 }] }], "veg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 150 }, { "food": "oats", "base": 60 }, { "food": "milk-whole", "base": 200 }, { "food": "apple", "base": 100 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "almonds", "base": 15 }, { "food": "berries", "base": 100 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "paneer", "base": 100 }, { "food": "dal-cooked", "base": 200 }, { "food": "rice-brown-cooked", "base": 150 }, { "food": "mixed-veg", "base": 150 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "orange", "base": 150 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "soy-chunks-cooked", "base": 150 }, { "food": "roti-wheat", "base": 70 }, { "food": "broccoli", "base": 150 }, { "food": "spinach", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "milk-skim", "base": 250 }, { "food": "cottage-cheese", "base": 50 }] }], "vegan": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "oats", "base": 80 }, { "food": "soy-milk", "base": 250 }, { "food": "banana", "base": 80 }, { "food": "chia-seeds", "base": 15 }, { "food": "peanut-butter", "base": 15 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "apple", "base": 150 }, { "food": "almonds", "base": 20 }, { "food": "edamame", "base": 80 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "tofu-firm", "base": 200 }, { "food": "rice-brown-cooked", "base": 150 }, { "food": "lentils-cooked", "base": 100 }, { "food": "kale", "base": 100 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "berries", "base": 100 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "tempeh", "base": 150 }, { "food": "quinoa-cooked", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "bell-pepper", "base": 100 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "soy-milk", "base": 250 }, { "food": "chia-seeds", "base": 10 }] }] }, "muscle-build": { "nonveg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 200 }, { "food": "oats", "base": 100 }, { "food": "milk-whole", "base": 250 }, { "food": "banana", "base": 120 }, { "food": "peanut-butter", "base": 20 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "banana", "base": 120 }, { "food": "almonds", "base": 25 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "chicken-breast", "base": 250 }, { "food": "rice-white-cooked", "base": 250 }, { "food": "mixed-veg", "base": 150 }, { "food": "olive-oil", "base": 10 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "dates", "base": 30 }, { "food": "milk-whole", "base": 200 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "lean-beef", "base": 200 }, { "food": "sweet-potato", "base": 200 }, { "food": "broccoli", "base": 150 }, { "food": "olive-oil", "base": 10 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "cottage-cheese", "base": 200 }, { "food": "almonds", "base": 20 }] }], "veg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 200 }, { "food": "oats", "base": 100 }, { "food": "milk-whole", "base": 300 }, { "food": "banana", "base": 120 }, { "food": "peanut-butter", "base": 20 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "banana", "base": 120 }, { "food": "milk-whole", "base": 200 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "paneer", "base": 150 }, { "food": "soy-chunks-cooked", "base": 100 }, { "food": "rice-white-cooked", "base": 250 }, { "food": "dal-cooked", "base": 150 }, { "food": "roti-wheat", "base": 70 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "dates", "base": 30 }, { "food": "almonds", "base": 20 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "paneer", "base": 150 }, { "food": "rajma-cooked", "base": 200 }, { "food": "roti-wheat", "base": 105 }, { "food": "mixed-veg", "base": 150 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "milk-whole", "base": 300 }, { "food": "almonds", "base": 15 }] }], "vegan": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "oats", "base": 100 }, { "food": "soy-milk", "base": 300 }, { "food": "banana", "base": 120 }, { "food": "peanut-butter", "base": 30 }, { "food": "chia-seeds", "base": 15 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "banana", "base": 120 }, { "food": "dates", "base": 20 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "tempeh", "base": 200 }, { "food": "rice-white-cooked", "base": 250 }, { "food": "chickpeas-cooked", "base": 150 }, { "food": "mixed-veg", "base": 150 }, { "food": "olive-oil", "base": 10 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "dates", "base": 30 }, { "food": "cashews", "base": 20 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "tofu-firm", "base": 200 }, { "food": "lentils-cooked", "base": 200 }, { "food": "quinoa-cooked", "base": 200 }, { "food": "broccoli", "base": 150 }, { "food": "olive-oil", "base": 10 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "soy-milk", "base": 300 }, { "food": "peanut-butter", "base": 20 }] }] }, "weight-gain": { "nonveg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 250 }, { "food": "oats", "base": 120 }, { "food": "milk-whole", "base": 300 }, { "food": "banana", "base": 150 }, { "food": "peanut-butter", "base": 30 }, { "food": "honey", "base": 15 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "dates", "base": 50 }, { "food": "almonds", "base": 30 }, { "food": "milk-whole", "base": 250 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "lean-beef", "base": 250 }, { "food": "rice-white-cooked", "base": 300 }, { "food": "mixed-veg", "base": 150 }, { "food": "avocado", "base": 80 }, { "food": "olive-oil", "base": 15 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "whey-protein", "base": 30, "fixed": true }, { "food": "banana", "base": 150 }, { "food": "peanut-butter", "base": 30 }, { "food": "milk-whole", "base": 200 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "chicken-thigh", "base": 250 }, { "food": "sweet-potato", "base": 250 }, { "food": "rice-white-cooked", "base": 200 }, { "food": "broccoli", "base": 100 }, { "food": "olive-oil", "base": 15 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "cottage-cheese", "base": 200 }, { "food": "almond-butter", "base": 20 }] }], "veg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 250 }, { "food": "oats", "base": 120 }, { "food": "milk-whole", "base": 300 }, { "food": "banana", "base": 150 }, { "food": "peanut-butter", "base": 30 }, { "food": "honey", "base": 15 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 250 }, { "food": "dates", "base": 50 }, { "food": "cashews", "base": 30 }, { "food": "mango", "base": 150 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "paneer", "base": 200 }, { "food": "rajma-cooked", "base": 200 }, { "food": "rice-white-cooked", "base": 300 }, { "food": "roti-wheat", "base": 70 }, { "food": "olive-oil", "base": 10 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "milk-whole", "base": 300 }, { "food": "banana", "base": 150 }, { "food": "peanut-butter", "base": 30 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "paneer", "base": 150 }, { "food": "soy-chunks-cooked", "base": 150 }, { "food": "rice-white-cooked", "base": 250 }, { "food": "mixed-veg", "base": 150 }, { "food": "olive-oil", "base": 10 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "milk-whole", "base": 300 }, { "food": "almonds", "base": 20 }, { "food": "honey", "base": 10 }] }], "vegan": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "oats", "base": 120 }, { "food": "soy-milk", "base": 350 }, { "food": "banana", "base": 150 }, { "food": "peanut-butter", "base": 40 }, { "food": "chia-seeds", "base": 15 }, { "food": "honey", "base": 15 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "dates", "base": 50 }, { "food": "walnuts", "base": 30 }, { "food": "mango", "base": 150 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "tempeh", "base": 200 }, { "food": "chickpeas-cooked", "base": 200 }, { "food": "rice-white-cooked", "base": 300 }, { "food": "avocado", "base": 80 }, { "food": "olive-oil", "base": 15 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "banana", "base": 150 }, { "food": "almond-butter", "base": 30 }, { "food": "soy-milk", "base": 250 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "lentils-cooked", "base": 250 }, { "food": "tofu-firm", "base": 200 }, { "food": "rice-white-cooked", "base": 250 }, { "food": "mushrooms", "base": 100 }, { "food": "olive-oil", "base": 15 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "soy-milk", "base": 350 }, { "food": "peanut-butter", "base": 25 }, { "food": "chia-seeds", "base": 10 }] }] }, "leaning": { "nonveg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "egg-whites", "base": 200 }, { "food": "eggs", "base": 50 }, { "food": "oats", "base": 70 }, { "food": "berries", "base": 100 }, { "food": "milk-skim", "base": 150 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "almonds", "base": 15 }, { "food": "apple", "base": 150 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "chicken-breast", "base": 200 }, { "food": "rice-brown-cooked", "base": 180 }, { "food": "broccoli", "base": 150 }, { "food": "bell-pepper", "base": 100 }, { "food": "olive-oil", "base": 8 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "tuna-canned", "base": 100 }, { "food": "apple", "base": 150 }, { "food": "walnuts", "base": 15 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "salmon", "base": 180 }, { "food": "sweet-potato", "base": 150 }, { "food": "spinach", "base": 100 }, { "food": "mushrooms", "base": 100 }, { "food": "olive-oil", "base": 8 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "cottage-cheese", "base": 150 }, { "food": "almonds", "base": 10 }] }], "veg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 150 }, { "food": "oats", "base": 70 }, { "food": "milk-skim", "base": 250 }, { "food": "berries", "base": 100 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "almonds", "base": 15 }, { "food": "apple", "base": 150 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "paneer", "base": 120 }, { "food": "dal-cooked", "base": 200 }, { "food": "rice-brown-cooked", "base": 180 }, { "food": "kale", "base": 80 }, { "food": "mixed-veg", "base": 100 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "greek-yogurt", "base": 150 }, { "food": "berries", "base": 100 }, { "food": "walnuts", "base": 15 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "soy-chunks-cooked", "base": 150 }, { "food": "roti-wheat", "base": 70 }, { "food": "broccoli", "base": 150 }, { "food": "spinach", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "milk-skim", "base": 250 }, { "food": "almonds", "base": 10 }] }], "vegan": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "oats", "base": 80 }, { "food": "soy-milk", "base": 250 }, { "food": "berries", "base": 100 }, { "food": "chia-seeds", "base": 15 }, { "food": "almond-butter", "base": 15 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "apple", "base": 150 }, { "food": "pumpkin-seeds", "base": 20 }, { "food": "edamame", "base": 80 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "tempeh", "base": 180 }, { "food": "rice-brown-cooked", "base": 180 }, { "food": "lentils-cooked", "base": 150 }, { "food": "bell-pepper", "base": 100 }, { "food": "olive-oil", "base": 8 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "berries", "base": 100 }, { "food": "walnuts", "base": 15 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "tofu-firm", "base": 200 }, { "food": "quinoa-cooked", "base": 180 }, { "food": "broccoli", "base": 150 }, { "food": "mushrooms", "base": 100 }, { "food": "olive-oil", "base": 8 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "soy-milk", "base": 250 }, { "food": "chia-seeds", "base": 10 }] }] }, "cutting": { "nonveg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "egg-whites", "base": 300 }, { "food": "eggs", "base": 50 }, { "food": "oats", "base": 50 }, { "food": "berries", "base": 100 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "cucumber", "base": 150 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "turkey", "base": 200 }, { "food": "sweet-potato", "base": 120 }, { "food": "spinach", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "tuna-canned", "base": 120 }, { "food": "cucumber", "base": 200 }, { "food": "bell-pepper", "base": 100 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "shrimp", "base": 200 }, { "food": "broccoli", "base": 200 }, { "food": "mushrooms", "base": 100 }, { "food": "mixed-veg", "base": 150 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "cottage-cheese", "base": 150 }] }], "veg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "egg-whites", "base": 250 }, { "food": "eggs", "base": 50 }, { "food": "oats", "base": 50 }, { "food": "berries", "base": 100 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "cucumber", "base": 200 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "paneer", "base": 100 }, { "food": "dal-cooked", "base": 200 }, { "food": "spinach", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "roti-wheat", "base": 35 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "greek-yogurt", "base": 150 }, { "food": "cucumber", "base": 200 }, { "food": "bell-pepper", "base": 100 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "soy-chunks-cooked", "base": 150 }, { "food": "broccoli", "base": 200 }, { "food": "mushrooms", "base": 100 }, { "food": "kale", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "milk-skim", "base": 200 }, { "food": "cottage-cheese", "base": 80 }] }], "vegan": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "oats", "base": 60 }, { "food": "soy-milk", "base": 200 }, { "food": "berries", "base": 100 }, { "food": "flaxseeds", "base": 10 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "apple", "base": 150 }, { "food": "cucumber", "base": 150 }, { "food": "edamame", "base": 80 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "seitan", "base": 200 }, { "food": "lentils-cooked", "base": 200 }, { "food": "spinach", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "cucumber", "base": 200 }, { "food": "bell-pepper", "base": 100 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "tofu-firm", "base": 220 }, { "food": "black-beans", "base": 150 }, { "food": "broccoli", "base": 200 }, { "food": "mushrooms", "base": 100 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "soy-milk", "base": 200 }, { "food": "chia-seeds", "base": 10 }] }] }, "abs": { "nonveg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "egg-whites", "base": 200 }, { "food": "eggs", "base": 50 }, { "food": "oats", "base": 60 }, { "food": "berries", "base": 100 }, { "food": "chia-seeds", "base": 10 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "almonds", "base": 15 }, { "food": "apple", "base": 120 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "chicken-breast", "base": 200 }, { "food": "sweet-potato", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "kale", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "tuna-canned", "base": 100 }, { "food": "cucumber", "base": 150 }, { "food": "orange", "base": 120 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "salmon", "base": 150 }, { "food": "broccoli", "base": 200 }, { "food": "spinach", "base": 100 }, { "food": "mushrooms", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "cottage-cheese", "base": 150 }, { "food": "almonds", "base": 10 }] }], "veg": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "eggs", "base": 150 }, { "food": "oats", "base": 60 }, { "food": "milk-skim", "base": 200 }, { "food": "berries", "base": 100 }, { "food": "chia-seeds", "base": 10 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "greek-yogurt", "base": 200 }, { "food": "almonds", "base": 15 }, { "food": "orange", "base": 120 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "paneer", "base": 100 }, { "food": "dal-cooked", "base": 200 }, { "food": "broccoli", "base": 150 }, { "food": "roti-wheat", "base": 70 }, { "food": "kale", "base": 80 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "greek-yogurt", "base": 150 }, { "food": "cucumber", "base": 150 }, { "food": "berries", "base": 80 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "soy-chunks-cooked", "base": 150 }, { "food": "broccoli", "base": 200 }, { "food": "mushrooms", "base": 100 }, { "food": "spinach", "base": 80 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "milk-skim", "base": 200 }, { "food": "pumpkin-seeds", "base": 15 }] }], "vegan": [{ "icon": _MI.sunrise, "name": "Breakfast", "items": [{ "food": "oats", "base": 70 }, { "food": "soy-milk", "base": 250 }, { "food": "berries", "base": 100 }, { "food": "chia-seeds", "base": 15 }, { "food": "flaxseeds", "base": 10 }] }, { "icon": _MI.apple, "name": "Morning Snack", "items": [{ "food": "apple", "base": 150 }, { "food": "edamame", "base": 100 }, { "food": "pumpkin-seeds", "base": 15 }] }, { "icon": _MI.plate, "name": "Lunch", "items": [{ "food": "tofu-firm", "base": 200 }, { "food": "black-beans", "base": 150 }, { "food": "broccoli", "base": 150 }, { "food": "kale", "base": 100 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.coffee, "name": "Evening Snack", "items": [{ "food": "plant-protein", "base": 30, "fixed": true }, { "food": "cucumber", "base": 150 }, { "food": "orange", "base": 120 }] }, { "icon": _MI.moon, "name": "Dinner", "items": [{ "food": "tempeh", "base": 150 }, { "food": "lentils-cooked", "base": 150 }, { "food": "broccoli", "base": 200 }, { "food": "mushrooms", "base": 100 }, { "food": "olive-oil", "base": 5 }] }, { "icon": _MI.sleep, "name": "Before Bed", "items": [{ "food": "soy-milk", "base": 250 }, { "food": "chia-seeds", "base": 10 }] }] } };
