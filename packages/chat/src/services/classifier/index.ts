import nlp from 'compromise'
import { QUESTION_CATEGORIES } from '../../models/question-categories'
import { QuestionCategory } from '../../types/cv'
import { Logger } from 'pino'

export class ClassifierService {
  constructor(private readonly logger: Logger) {}

  extractNounsAndAdjectives = (text: string) => {
    const doc = nlp(text)

    return doc
      .not('#Pronoun #Verb #Determiner #Preposition #Conjunction #Adverb')
      .text()
  }

  classify = (userInput: string): QuestionCategory => {
    let bestMatch: QuestionCategory & {
      weight: number
    } = {
      ...QUESTION_CATEGORIES.unknown,
      weight: 0
    }

    try {
      const filteredUserInput = this.extractNounsAndAdjectives(
        userInput.toLowerCase()
      )

      console.log('Important words:', filteredUserInput)

      for (const questionCategory of Object.values(QUESTION_CATEGORIES)) {
        let totalWeight = 0
        for (const keywordObj of questionCategory.keywords) {
          if (keywordObj.weight) {
            if (filteredUserInput.includes(keywordObj.word)) {
              totalWeight += keywordObj.weight
            }
          }
        }

        if (totalWeight > (bestMatch.weight ?? 0)) {
          bestMatch = {
            category: questionCategory.category,
            model: questionCategory.model ?? undefined,
            weight: totalWeight,
            keywords: []
          }
        }
      }
    } catch (error) {
      this.logger.error('Error classifying question:', error)
    }

    return bestMatch
  }
}
