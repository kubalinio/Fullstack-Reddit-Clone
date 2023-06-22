import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'

interface CommentsSectionProps {
  postId: string
}

export const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: undefined,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full" />

      {/* @TODO Create comment */}

      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            // eslint-disable-next-line no-unused-vars
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc - 1
              return acc
            }, 0)

            // eslint-disable-next-line no-unused-vars
            const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id)

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2"></div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
