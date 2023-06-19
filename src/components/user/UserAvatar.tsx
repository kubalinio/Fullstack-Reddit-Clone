import { User } from 'next-auth'
import { FC } from 'react'
import { Avatar, AvatarFallback } from '../ui/Avatar'
import Image from 'next/image'
import { Icons } from '../Icons'
import { AvatarProps } from '@radix-ui/react-avatar'

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, 'name' | 'image'>
}

export const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image fill src={user.image} alt="profile picture" referrerPolicy="no-referrer" />
        </div>
      ) : (
        <AvatarFallback>
          <span>{user?.name}</span>
          <Icons.user />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
