'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/Command'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Prisma, Subreddit } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import debounce from 'lodash.debounce'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'

interface SearchBarProps {}

export const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const router = useRouter()
  const commandRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  const request = debounce(() => {
    refetch()
  }, 500)

  const debounceRequest = useCallback(() => {
    request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <Command ref={commandRef} className="relative z-50 max-w-lg overflow-visible rounded-lg border">
      <CommandInput
        isLoading={isFetching}
        value={input}
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        className="border-none outline-none ring-0 focus:border-none focus:outline-none"
        placeholder="Search communities..."
      />
      {input.length > 0 ? (
        <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  key={subreddit.id}
                  value={subreddit.name}
                  onSelect={(e) => {
                    router.push(`/r/${e}`)
                    router.refresh()
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  )
}
