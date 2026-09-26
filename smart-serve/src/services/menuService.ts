import { menuItems } from '../data/menuItems'
import type { FoodCategory, MenuItem } from '../types/menu'

export type MenuFilters = {
  search?: string
  category?: FoodCategory | 'All'
  vegetarian?: boolean
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy'
}

export async function getMenuItems(): Promise<MenuItem[]> {
  await simulateNetworkDelay()

  return menuItems
}

export async function getMenuItemById(
  id: string,
): Promise<MenuItem | undefined> {
  await simulateNetworkDelay()

  return menuItems.find((item) => item.id === id)
}

export async function getRecommendedItems(): Promise<MenuItem[]> {
  await simulateNetworkDelay()

  return menuItems.filter((item) => item.recommended)
}

export async function filterMenuItems(
  filters: MenuFilters,
): Promise<MenuItem[]> {
  await simulateNetworkDelay(150)

  const search = filters.search?.trim().toLowerCase()

  return menuItems.filter((item) => {
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(search),
      )

    const matchesCategory =
      !filters.category ||
      filters.category === 'All' ||
      item.category === filters.category

    const matchesVegetarian =
      filters.vegetarian === undefined ||
      item.vegetarian === filters.vegetarian

    const matchesSpice =
      !filters.spiceLevel ||
      item.spiceLevel === filters.spiceLevel

    return (
      matchesSearch &&
      matchesCategory &&
      matchesVegetarian &&
      matchesSpice
    )
  })
}

function simulateNetworkDelay(delay = 300) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay)
  })
}