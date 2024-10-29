import nlp from 'compromise'
import { QUESTION_CATEGORIES } from '../../models/question-categories'
import { ChatCategory } from '../../types/cv'
import { Logger } from 'pino'

export class ClassifierService {
  constructor(private readonly logger: Logger) {}

  isMeaningfulInput(userInput: string): boolean {
    if (!userInput || userInput.trim().length < 5) {
      return false
    }

    const doc = nlp(userInput)

    const sentences = doc.sentences()
    if (sentences.length === 0) {
      return false
    }

    const hasNouns = doc.nouns().out('array').length > 0
    const hasVerbs = doc.verbs().out('array').length > 0

    return hasNouns || hasVerbs
  }

  extractNounsAndAdjectives = (text: string) => {
    const doc = nlp(text)

    return doc
      .not('#Pronoun #Verb #Determiner #Preposition #Conjunction #Adverb')
      .text()
  }

  classify = (userInput: string): ChatCategory => {
    let bestMatch: ChatCategory & {
      weight: number
    } = {
      ...QUESTION_CATEGORIES.unknown,
      weight: 0
    }

    try {
      const filteredUserInput = this.extractNounsAndAdjectives(
        userInput.toLowerCase()
      )

      this.logger.debug(
        { filteredUserInput },
        'Important words extracted from user input'
      )

      for (const questionCategory of Object.values(QUESTION_CATEGORIES)) {
        const totalWeight = questionCategory.keywords.reduce(
          (acc, categoryKeyword) => {
            if (filteredUserInput.includes(categoryKeyword.word)) {
              this.logger.debug(
                { categoryKeyword },
                'Matching keyword for category'
              )
              return acc + categoryKeyword.weight
            }
            return acc
          },
          0
        )

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
