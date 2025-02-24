import { prisma } from '@/utils/db'
import { auth, currentUser } from '@clerk/nextjs/dist/types/server'

const createNewUser = async () => {
  const user = await currentUser()
  const match = await prisma.user.findUnique({
    where: {
      clerkId: user.id as string,
    },
  })

  if (!match) {
    const user = await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.email,
      },
    })
  }
}

const NewUser = () => {
  return <div>hi</div>
}

export default NewUser
