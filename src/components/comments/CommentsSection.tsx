import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostComment } from './PostComment'
import { CreateComment } from './CreateComment'

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

      <CreateComment postId={postId} />

      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce((acc, vote) => {
              if (vote.type === 'UP') return acc + 1
              if (vote.type === 'DOWN') return acc - 1
              return acc
            }, 0)

            const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id)

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    postId={postId}
                    votesAmt={topLevelCommentVotesAmt}
                    currentVote={topLevelCommentVote}
                  />
                </div>

                {/* render replie @WhatDo the most voted reply */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc - 1
                      return acc
                    }, 0)

                    const replyVote = reply.votes.find((vote) => vote.userId === session?.user.id)

                    return (
                      <div key={reply.id} className="ml-2 border-l-2 border-zinc-200 py-2 pl-4">
                        <PostComment comment={reply} currentVote={replyVote} votesAmt={replyVotesAmt} postId={postId} />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
  )
}
