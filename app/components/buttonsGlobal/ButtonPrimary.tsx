'use client';

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ButtonPrimaryProps } from '@/lib/types';

export default function ButtonPrimary({
    children,
    className,
    onClick,
    type = "button"
}: ButtonPrimaryProps) {
    return (
        <>
            <Button
                className={cn(
                    "sm:w-[4.75rem] w-full h-10 px-4 rounded-[0.75rem] bg-button-secondary cursor-pointer text-secondary border-0 hover:bg-button-secondary/80 focus:ring-0 active:scale-95 transition-transform duration-100",
                    className
                )}
                onClick={onClick}
                type={type}
            >
                {children}
            </Button>
        </>
    )
}