import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FoodModel = {
  id: string
  foodId: string
  foodName: string
  modelUrl: string
  thumbnailUrl: string
  fileSize: number
  status: 'READY'
  createdAt: string
}

type ModelStore = {
  models: FoodModel[]

  saveModel: (
    model: Omit<FoodModel, 'id'>,
  ) => void

  deleteModel: (id: string) => void
}

export const useModelStore = create<ModelStore>()(
  persist(
    (set) => ({
      models: [],

      saveModel: (model) =>
        set((state) => ({
          models: [
            {
              ...model,
              id: `model-${Date.now()}`,
            },
            ...state.models,
          ],
        })),

      deleteModel: (id) =>
        set((state) => ({
          models: state.models.filter(
            (model) => model.id !== id,
          ),
        })),
    }),
    {
      name: 'smart-serve-models',
    },
  ),
)