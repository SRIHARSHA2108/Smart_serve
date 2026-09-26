import type { FoodCategory } from '../types/menu'

export type MenuCategory = FoodCategory | 'All'

export const menuCategories: MenuCategory[] = [
  'All',
  'Starters',
  'Main Course',
  'Breads',
  'Rice',
  'Desserts',
  'Beverages',
]