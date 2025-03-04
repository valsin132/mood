import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export const PATCH = async (request: Request, { params }) => {
  const { content } = await request.json()
  const user = await getUserByClerkId()
  const updatedEntry = await prisma.journalEntry.update({
    // find what we want to update
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    // data what we want to update
    data: {
      content,
    },
  })

  return NextResponse.json({ data: updatedEntry })
}
