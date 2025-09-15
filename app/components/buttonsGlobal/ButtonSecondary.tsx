import { Button } from '@/components/ui/button'
import { ButtonSecondaryProps } from '@/lib/types'
import React from 'react'

export default function ButtonSecondary({
  children,
  onClick,
  type
}: ButtonSecondaryProps) {
  return (
    <>
      <Button
        className='bg-button-primary text-color-button-secondary w-10 h-10 hover:bg-button-primary/70 active:scale-95 cursor-pointer transition-all duration-200'
        onClick={onClick}
        type={type}
      >
        {children}
      </Button>
    </>
  )
}