import { auth } from '@clerk/nextjs/server'
import { prisma } from './db'

export const getUserByClerkId = async () => {
  const { userId } = await auth()
  console.log('Clerk userId from auth():', userId)

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  })

  return user
}
