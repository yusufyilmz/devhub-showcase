// /app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const { userMessage } = await req.json()

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: userMessage }],
    max_tokens: 150
  })

  const botReply = completion.data.choices[0].message?.content

  return NextResponse.json({ botReply })
}
