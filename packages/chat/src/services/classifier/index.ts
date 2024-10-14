import nlp from 'compromise'
import { QUESTION_CATEGORIES } from '../../models/question-categories'
import { QuestionCategory } from '../../types/cv'
import { Logger } from 'pino'

export class ClassifierService {
  constructor(private readonly logger: Logger) { }

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

      this.logger.debug({ filteredUserInput }, 'Important words extracted from user input')

      for (const questionCategory of Object.values(QUESTION_CATEGORIES)) {
        const totalWeight = questionCategory.keywords.reduce((acc, categoryKeyword) => {
          if (filteredUserInput.includes(categoryKeyword.word)) {
            this.logger.debug({ categoryKeyword }, 'Matching keyword for category');
            return acc + categoryKeyword.weight;
          }
          return acc;
        }, 0);

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
      this.logger.error({ error }, 'Error classifying question')
    }

    return bestMatch
  }
}
