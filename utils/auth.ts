import { auth } from '@clerk/nextjs/server'
import { prisma } from './db'

export const getUserByClerkId = async () => {
  const { userId } = await auth()

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  })

  return user
}
