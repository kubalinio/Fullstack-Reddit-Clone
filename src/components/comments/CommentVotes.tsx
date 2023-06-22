'use client'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { FC, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface CommentVotesProps {
  commentId: string
  initialVotesAmt: number
  initialVote?: Pick<CommentVote, 'type'>
}

export const CommentVotes: FC<CommentVotesProps> = ({ commentId, initialVotesAmt, initialVote }) => {
  const { loginToast } = useCustomToast()
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
  const [currentVote, setCurrentVote] = useState(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      }

      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev - 1)

      // reset current vote
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again.',
        variant: 'destructive',
      })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className="flex gap-1">
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size={'sm'}
        variant={'ghost'}
        aria-label="upvote"
        className={cn({
          'text-emerald-500': currentVote?.type === 'DOWN',
        })}
      >
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote?.type === 'UP',
          })}
        />
      </Button>
      {/* Score */}
      <p className="py-2 text-center text-sm font-medium text-zinc-900">{votesAmt}</p>
      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size={'sm'}
        variant={'ghost'}
        aria-label="downvote"
        className={cn({
          'text-emerald-500': currentVote?.type === 'DOWN',
        })}
      >
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'fill-emerald-500 text-emerald-500': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}
