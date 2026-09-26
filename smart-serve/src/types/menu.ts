export type FoodCategory =
  | 'Starters'
  | 'Main Course'
  | 'Breads'
  | 'Rice'
  | 'Desserts'
  | 'Beverages'

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy'

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  category: FoodCategory

  imageUrl: string
  glbUrl?: string

  vegetarian: boolean
  spiceLevel: SpiceLevel

  calories: number
  protein: number
  carbs: number
  fat: number

  rating: number
  reviewCount: number

  preparationTime: number

  ingredients: string[]
  allergens: string[]

  tags: string[]

  recommended?: boolean
  popular?: boolean
  chefChoice?: boolean
}