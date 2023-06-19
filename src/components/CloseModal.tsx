'use client'

import { X } from 'lucide-react'
import { Button } from './ui/Button'
import { useRouter } from 'next/navigation'

export const CloseModal = () => {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.back()}
      variant={'subtle'}
      aria-label="close modal"
      className="h-6 w-6 rounded-md p-0"
    >
      <X className="h-4 w-4" />
    </Button>
  )
}
