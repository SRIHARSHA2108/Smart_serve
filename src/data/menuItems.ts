import type { MenuItem } from '../types/menu'

export const menuItems: MenuItem[] = [
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    description:
      'Aromatic basmati rice layered with tender chicken, traditional spices, herbs and caramelized onions.',
    price: 320,
    category: 'Rice',

    imageUrl: '/images/chicken-biryani.jpg',
    glbUrl: '/models/chicken-biryani.glb',

    vegetarian: false,
    spiceLevel: 'Medium',

    calories: 520,
    protein: 28,
    carbs: 65,
    fat: 18,

    rating: 4.8,
    reviewCount: 1200,

    preparationTime: 25,

    ingredients: [
      'Basmati Rice',
      'Chicken',
      'Onion',
      'Tomato',
      'Yogurt',
      'Mint',
      'Coriander',
      'Biryani Spices',
    ],

    allergens: ['Dairy'],

    tags: ['High Protein', 'Bestseller', "Chef's Choice"],

    recommended: true,
    popular: true,
    chefChoice: true,
  },

  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    description:
      'Soft paneer cubes simmered in a creamy tomato and butter gravy with aromatic Indian spices.',
    price: 280,
    category: 'Main Course',

    imageUrl: '/images/paneer-butter-masala.jpg',
    glbUrl: '/models/paneer-butter-masala.glb',
    vegetarian: true,
    spiceLevel: 'Mild',

    calories: 460,
    protein: 18,
    carbs: 24,
    fat: 32,

    rating: 4.7,
    reviewCount: 856,

    preparationTime: 20,

    ingredients: [
      'Paneer',
      'Tomato',
      'Butter',
      'Cream',
      'Cashew',
      'Onion',
      'Indian Spices',
    ],

    allergens: ['Dairy', 'Tree Nuts'],

    tags: ['Vegetarian', 'Popular'],

    recommended: true,
    popular: true,
  },

  {
    id: 'masala-dosa',
    name: 'Masala Dosa',
    description:
      'Crispy South Indian rice and lentil crepe filled with seasoned potato masala.',
    price: 180,
    category: 'Main Course',

    imageUrl: '/images/masala-dosa.jpg',
    glbUrl: '/models/masala-dosa.glb',
    vegetarian: true,
    spiceLevel: 'Medium',

    calories: 390,
    protein: 9,
    carbs: 58,
    fat: 13,

    rating: 4.6,
    reviewCount: 742,

    preparationTime: 18,

    ingredients: [
      'Rice',
      'Urad Dal',
      'Potato',
      'Onion',
      'Mustard Seeds',
      'Curry Leaves',
    ],

    allergens: [],

    tags: ['Vegetarian', 'South Indian', 'Popular'],

    popular: true,
  },

  {
    id: 'tandoori-chicken',
    name: 'Tandoori Chicken',
    description:
      'Chicken marinated with yogurt and traditional spices, roasted until smoky and tender.',
    price: 360,
    category: 'Starters',

    imageUrl: '/images/tandoori-chicken.jpg',
    glbUrl: '/models/tandoori-chicken.glb',
    vegetarian: false,
    spiceLevel: 'Spicy',

    calories: 410,
    protein: 42,
    carbs: 10,
    fat: 22,

    rating: 4.8,
    reviewCount: 690,

    preparationTime: 30,

    ingredients: [
      'Chicken',
      'Yogurt',
      'Ginger',
      'Garlic',
      'Lemon',
      'Tandoori Spices',
    ],

    allergens: ['Dairy'],

    tags: ['High Protein', 'Spicy', "Chef's Choice"],

    recommended: true,
    chefChoice: true,
  },

  {
    id: 'garlic-naan',
    name: 'Garlic Naan',
    description:
      'Soft tandoor-baked Indian flatbread finished with garlic, butter and fresh coriander.',
    price: 60,
    category: 'Breads',

    imageUrl: '/images/garlic-naan.jpg',
    glbUrl: '/models/garlic-naan.glb',
    vegetarian: true,
    spiceLevel: 'Mild',

    calories: 260,
    protein: 7,
    carbs: 45,
    fat: 6,

    rating: 4.6,
    reviewCount: 512,

    preparationTime: 10,

    ingredients: [
      'Wheat Flour',
      'Garlic',
      'Butter',
      'Coriander',
      'Yogurt',
    ],

    allergens: ['Gluten', 'Dairy'],

    tags: ['Vegetarian'],
  },

  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    description:
      'Fragrant basmati rice cooked with seasonal vegetables, herbs and aromatic biryani spices.',
    price: 260,
    category: 'Rice',

    imageUrl: '/images/veg-biryani.jpg',
    glbUrl: '/models/veg-biryani.glb',
    vegetarian: true,
    spiceLevel: 'Medium',

    calories: 430,
    protein: 11,
    carbs: 72,
    fat: 11,

    rating: 4.5,
    reviewCount: 438,

    preparationTime: 22,

    ingredients: [
      'Basmati Rice',
      'Carrot',
      'Beans',
      'Peas',
      'Onion',
      'Mint',
      'Biryani Spices',
    ],

    allergens: [],

    tags: ['Vegetarian'],
  },

  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description:
      'Soft milk-solid dumplings soaked in warm cardamom and rose-flavoured sugar syrup.',
    price: 100,
    category: 'Desserts',

    imageUrl: '/images/gulab-jamun.jpg',
    glbUrl: '/models/gulab-jamun.glb',
    vegetarian: true,
    spiceLevel: 'Mild',

    calories: 290,
    protein: 5,
    carbs: 48,
    fat: 9,

    rating: 4.7,
    reviewCount: 625,

    preparationTime: 5,

    ingredients: [
      'Milk Solids',
      'Flour',
      'Sugar',
      'Cardamom',
      'Rose Water',
    ],

    allergens: ['Dairy', 'Gluten'],

    tags: ['Vegetarian', 'Sweet', 'Popular'],

    popular: true,
  },

  {
    id: 'fresh-lime-soda',
    name: 'Fresh Lime Soda',
    description:
      'Refreshing lime soda served chilled with your choice of sweet, salted or mixed flavour.',
    price: 80,
    category: 'Beverages',

    imageUrl: '/images/fresh-lime-soda.jpg',
    glbUrl: '/models/fresh-lime-soda.glb',
    vegetarian: true,
    spiceLevel: 'Mild',

    calories: 95,
    protein: 0,
    carbs: 24,
    fat: 0,

    rating: 4.4,
    reviewCount: 315,

    preparationTime: 5,

    ingredients: [
      'Fresh Lime',
      'Soda',
      'Sugar',
      'Salt',
    ],

    allergens: [],

    tags: ['Vegetarian', 'Low Calorie'],
  },
]