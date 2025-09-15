import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input';
import { InputFormsProps } from '@/lib/types';

export default function InputForms({ 
    className,  
    titleInput, 
    valueInput,
    classNameTitle,
    placeholderInput, 
    valueType,
    onChangeInput,
    isTitle = false
}: InputFormsProps) {
  return (
    <div className='flex flex-col w-full p-0 gap-2 mb-4'>
        { isTitle && 
            <span 
                className={cn("text-primary text-[16px] font-semibold leading-6 tracking-normal", classNameTitle )}
            >
                { titleInput }
            </span>
        }
        <Input 
            className={cn(
                "bg-button-primary rounded-[0.75rem] w-full sm:w-[36.5625rem] h-14 p-4 placeholder:text-placeholder-input placeholder:font-normal placeholder:text-[1rem] placeholder:leading-6 placeholder:tracking-normal focus:border-primary focus:placeholder-transparent", 
                className
            )} 
            value={ valueInput}
            type={valueType}
            placeholder={ placeholderInput }
            onChange={onChangeInput}
         />
    </div>
  )
}
