export type ModelGenerationResult = {
  modelUrl: string
  thumbnailUrl: string
  fileSize: number
  createdAt: string
}

export async function generate3DModel(
  imageFile: File,
  foodId: string,
): Promise<ModelGenerationResult> {
  if (!imageFile) {
    throw new Error('Food image is required.')
  }

  // PROTOTYPE:
  // Later this function will call our Node/Express backend.
  await new Promise((resolve) =>
    setTimeout(resolve, 5000),
  )

  return {
    modelUrl: `/models/${foodId}.glb`,
    thumbnailUrl: URL.createObjectURL(imageFile),
    fileSize: 0,
    createdAt: new Date().toISOString(),
  }
}