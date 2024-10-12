import nlp from 'compromise'
import { QUESTION_CATEGORIES } from '../../models/question-categories'
import { CVCategory, QuestionCategory } from '../../types/cv'

export class ClassifierService {
  constructor() {}

  extractNounsAndAdjectives = (text: string) => {
    const doc = nlp(text)

    return doc
      .not('#Pronoun #Verb #Determiner #Preposition #Conjunction #Adverb')
      .text()
  }

  classify = (userInput: string): QuestionCategory => {
    let bestMatch: QuestionCategory = QUESTION_CATEGORIES[CVCategory.Unknown]

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
              console.log(
                'Matching keyword:',
                keywordObj.word,
                'Weight:',
                keywordObj.weight,
                'Category:',
                questionCategory.category
              )
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
      console.error('Error classifying question:', error)
    }

    console.log(
      'Best match Category:',
      bestMatch.category,
      'Weight:',
      bestMatch.weight
    )

    return bestMatch
  }
}

// // Define common question categories and corresponding keywords/phrases
// const commonQuestions = [
//   {
//     category: "Skills",
//     keywords: ["skills", "expertise", "technologies", "stack", "experience", "tools"]
//   },
//   {
//     category: "Experience",
//     keywords: ["experience", "work", "career", "background", "job", "role"]
//   },
//   {
//     category: "Projects",
//     keywords: ["project", "develop", "built", "applications", "tools", "systems"]
//   },
//   {
//     category: "Education",
//     keywords: ["education", "degree", "study", "university", "graduated", "course"]
//   },
//   {
//     category: "Contact Information",
//     keywords: ["contact", "email", "phone", "reach", "social", "linkedin"]
//   },
//   {
//     category: "Unknown",
//     keywords: []
//   }
// ]

// // Function to extract nouns and adjectives

// // Example usage
// const userQuestion = "Can you tell me about your work experience?"
// const category = classifyQuestion(userQuestion)

// console.log(`The user's question is classified as: ${category}`)
