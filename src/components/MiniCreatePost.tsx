'use client'

import { Session } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'
import { UserAvatar } from './user/UserAvatar'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ImageIcon, Link2 } from 'lucide-react'

interface MiniCreatePostProps {
  session: Session | null
}

export const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <li className="list-none overflow-hidden rounded-md bg-white shadow">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || session?.user.email || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>

        <Input readOnly onClick={() => router.push(pathname + '/submit')} placeholder="Create post" />

        <Button variant={'ghost'} onClick={() => router.push(pathname + '/submit')}>
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button variant={'ghost'} onClick={() => router.push(pathname + '/submit')}>
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  )
}
