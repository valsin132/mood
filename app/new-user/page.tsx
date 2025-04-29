// import { prisma } from '@/utils/db'
// import { currentUser } from '@clerk/nextjs/server'
// import { redirect } from 'next/navigation'

// const createNewUser = async () => {
//   const user = await currentUser()
//   console.log(user)

//   const match = await prisma.user.findUnique({
//     where: {
//       clerkId: user.id as string,
//     },
//   })

//   if (!match) {
//     await prisma.user.create({
//       data: {
//         clerkId: user.id,
//         email: user?.emailAddresses[0].emailAddress,
//       },
//     })
//   }

//   redirect('/journal')
// }

// const NewUser = async () => {
//   await createNewUser()
//   return <div>...loading</div>
// }

// export default NewUser

import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const createNewUser = async () => {
  const user = await currentUser()
  console.log(user)

  if (!user) return

  const { id: clerkId, emailAddresses } = user
  const email = emailAddresses[0]?.emailAddress

  if (!email) return

  // 🔎 Check if user exists by clerkId or email
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId },
        { email },
      ],
    },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        clerkId,
        email,
      },
    })
  }

  redirect('/journal')
}

const NewUser = async () => {
  await createNewUser()
  return <div>...loading</div>
}

export default NewUser
