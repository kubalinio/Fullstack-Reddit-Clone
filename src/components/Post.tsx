import { formatTimeToNow } from '@/lib/utils'
import { Post as PostTS, User, Vote } from '@prisma/client'
import { Dot, MessageSquare } from 'lucide-react'
import { FC, useRef } from 'react'
import { EditorOutput } from './EditorOutput'
import { PostVoteClient } from './post-vote/PostVoteClient'

type PartialVote = Pick<Vote, 'type'>

interface PostProps {
  subredditName: string
  post: PostTS & {
    author: User
    votes: Vote[]
  }
  commentAmt: number
  votesAmt: number
  currentVote?: PartialVote
}

export const Post: FC<PostProps> = ({ subredditName, post, commentAmt, votesAmt, currentVote }) => {
  const pRef = useRef<HTMLDivElement>(null)

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex justify-between px-6 py-4">
        {/* @TODO: PostVotes */}
        <PostVoteClient initialVotesAmt={votesAmt} postId={post.id} initialVote={currentVote?.type} />

        <div className="w-0 flex-1">
          <div className="mt-1 flex max-h-40 items-center text-xs text-gray-500">
            {subredditName ? (
              <>
                {/* @WHATDO HARD RELOAD */}
                <a href={`/r/${subredditName}`} className="text-sm text-zinc-900 underline underline-offset-2">
                  r/{subredditName}
                </a>

                <span className="px-1">
                  <Dot />
                </span>
              </>
            ) : null}
            <span className="mr-2">Posted by u/{post.author.username}</span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">{post.title}</h1>
          </a>

          <div className="relative max-h-40 w-full overflow-clip text-sm" ref={pRef}>
            <EditorOutput content={post.content} />

            {pRef.current?.clientHeight === 160 ? (
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 p-4 text-sm sm:px-6">
        <a href={`/r/${subredditName}`} className="flex w-fit items-center gap-2">
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </a>
      </div>
    </div>
  )
}
