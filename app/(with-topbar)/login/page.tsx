'use client';
//IMPORTS DE HOOKS, LIBS, COMPONENTS
import React from 'react'
import TEXTS from '../../constants/texts'
import { useRouter } from 'next/navigation';
import ButtonPrimary from '@/app/components/buttonsGlobal/ButtonPrimary';
import { FadeInSection } from '@/components/ui/animated-components';

export default function LoginStart() {
    
  const router = useRouter();

  return (
    <>
        <main className="flex flex-col items-center justify-center text-center">
            <FadeInSection>
                <div className="flex items-center justify-center h-[100vh] w-[15.75rem] my-5 sm:w-[60rem] sm:max-w-[60rem] sm:h-[44.5625rem]">
                    <div className="flex flex-col gap-4 pt-5 pb-2 px-4 items-center justify-center sm:w-[48.375rem] sm:h-[13rem]">
                        <h1 className="sm:w-[46.375rem] w-full sm:h-20 font-semibold text-primary text-5xl sm:text-[5rem] leading-[100%] tracking-normal items-center"> 
                            { TEXTS.pageLogin.main.title } 
                        </h1>
                        <h3 className="sm:w-[46.375rem] w-full h-7 font-normal text-primary text-[1rem] sm:text-[1.75rem] leading-[100%] tracking-normal items-center"> 
                            {TEXTS.pageLogin.main.subtitle } 
                        </h3>
                        <ButtonPrimary 
                            className="w-fit sm:w-[7.625rem] sm:h-10 px-4"
                            onClick={() => {router.push('/login/form')}}
                            type='button'
                        >
                            { TEXTS.pageLogin.main.button.title }
                        </ButtonPrimary>
                    </div>
                </div>    
            </FadeInSection>
        </main>
    </>
  )
}
