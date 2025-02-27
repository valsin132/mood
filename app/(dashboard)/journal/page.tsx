import { getUserByClerkId } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEntries = async () => {
  const users = await prisma.user.findMany()
  console.log(users)
  const user = await getUserByClerkId()

  if (!user) {
    console.error('User not found.')
    return [] // Return an empty array or handle as needed
  }

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return entries
}

const JournalPage = async () => {
  const entries = await getEntries()
  console.log('entries', entries)
  return <div>journal</div>
}

export default JournalPage
