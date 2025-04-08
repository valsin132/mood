import { ChatOpenAI } from '@langchain/openai'

export const analyze = async (prompt) => {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
  })
  const result = await model.invoke(prompt)
  console.log(result)
}
