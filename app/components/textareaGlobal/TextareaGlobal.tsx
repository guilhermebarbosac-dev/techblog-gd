import { Textarea } from '@/components/ui/textarea'
import { TextareaGlobalProps } from '@/lib/types'
import React from 'react'



export default function TextareaGlobal({
  titleTextArea,
  placeholderTextArea,
  valueTextArea,
  onChangeTextarea,
  isTitle
}: TextareaGlobalProps) {
  return (
    <div>
      {isTitle && titleTextArea &&
        <p className='text-primary text-[16px] font-semibold leading-6 tracking-normal'>
          {titleTextArea}
        </p>
      }
      <Textarea
        className="h-[144px] min-h-[144px] rounded-[12px] p-4 bg-button-primary placeholder:text-muted"
        placeholder={placeholderTextArea}
        value={valueTextArea}
        onChange={onChangeTextarea}
      />
    </div>
  )
}
