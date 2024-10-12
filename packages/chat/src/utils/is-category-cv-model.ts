import { CV_MODEL } from '../models/cv-model'
import type { CVCategory } from '../types/cv'

export function isCategoryInModel(
  category: CVCategory,
  model: typeof CV_MODEL
): boolean {
  return category in model
}

export function getCategoryData(category: CVCategory) {
  if (isCategoryInModel(category, CV_MODEL)) {
    return CV_MODEL[category as keyof typeof CV_MODEL]
  }
  console.log(`Category ${category} does not exist in CV_MODEL.`)
  return null
}
