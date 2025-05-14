import { ChatOpenAI, OpenAI } from '@langchain/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { Document } from 'langchain/document'
import { loadQARefineChain } from 'langchain/chains'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import z from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('The mood of the person who wrote the journal entry.'),
    subject: z.string().describe('The subject of the journal entry.'),
    negative: z
      .boolean()
      .describe(
        'Is the journal entry negative? (i.e. does it contain negative emotions?).'
      ),
    summary: z.string().describe('Quick summary of the entire entry.'),
    color: z
      .string()
      .describe(
        'A hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness.'
      ),
  })
)

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({
    entry: content,
  })

  return input
}

//silliness level- temperature: 0, to be factual and real things, 1 more creative
export const analyze = async (content) => {
  const input = await getPrompt(content)
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
  })
  const result = await model.invoke(input)

  if (typeof result.content === 'string') {
    return parser.parse(result.content)
  } else {
    throw new Error('Expected string content but received structured message')
  }
}

const qa = async (question, entries) => {
  const docs = entries.map((entry) => {
    return new Document({
      pageContent: entry.content,
      metadata: { id: entry.id, createdAt: entry.createdAt },
    })
  })

  const model = new OpenAI({ temperature: 0, modelName: 'gpt-4o-mini' })
  const chain = loadQARefineChain(model)
  const embeddings = new OpenAIEmbeddings()
  const store = MemoryVectorStore.fromDocuments(docs, embeddings)
}
