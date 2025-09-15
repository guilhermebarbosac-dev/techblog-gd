import * as React from 'react'

import { cn } from "@/lib/utils"

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}

function Topbar({
    className,
    children,
    ...props
}: TopbarProps) {
  return (
    <div className={cn('w-full h-[4.06rem] border-[1px] border-buttom topbar-border px-4 sm:px-10 py-3 justify-between', className)} {...props}>
        {children}
    </div>
  )
}
export default Topbar