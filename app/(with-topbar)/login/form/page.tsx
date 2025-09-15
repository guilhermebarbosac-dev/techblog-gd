'use client'

//IMPORTS DE HOOKS, COMPONENTS, LIBS E OUTROS
import InputForms from '@/app/components/inputsGlobal/InputForms'
import ButtonPrimary from '@/app/components/buttonsGlobal/ButtonPrimary'
import TEXTS from '@/app/constants/texts'
import { FadeInSection } from '@/components/ui/animated-components'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export default function FormLogin() {
    const router = useRouter()

    //HOOK BUSCA USUÁRIO EM CONTEXTO DA APLICAÇÃO
    const { login, loading } = useAuth()

    //VARIÁVEIS DE ESTADO PARA ARMAZENAR OS VALORES DOS INPUTS
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')

    //VALIDAÇÃO DE CARREGAMENTO DE LOGIN
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className='w-7 h-7 animate-spin'/>
            </div>
        );
    }

    //FUNÇÃO ASSÍNCRONA PARA FAZER O LOGIN
    const handleLogin = async () => { 
        try { 
            if(!validateForm()) return
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailInput,
                    password: passwordInput
                })
            })
            if(response.ok) { 
                const data = await response.json()
                toast.success('Login realizado com sucesso')
                login({
                    id: data.userId,
                    name: data.user?.name,
                    email: data.user?.email,
                    avatar: data.user?.avatar
                })
                router.push('/home')
            }

            if(response.status === 401){
                toast.error('Senha inválida')
            }

            if(response.status === 404) {
                toast.error('Usuário não encontrado')
            }
        } catch (error) { 
            console.log(error)
            toast.error('Erro ao fazer login')
        }
    }

    //FUNÇÃO PARA VALIDAR O FORMULÁRIO
    const validateForm = () => { 
        if(emailInput.trim() === '' ){
            toast.error('Email é obrigatório')
            return false
        }
        if(passwordInput.trim() === ''){
            toast.error('Senha é obrigatória')
            return false
        }
        return true
    }

  return (
    <div className='flex flex-col items-center justify-center'>
        
        <FadeInSection>
            <div 
                className="flex flex-col items-center justify-center sm:w-[38.125rem] h-[44.5625rem] sm:w-max-[60rem] py-5"
            >
                <div className="flex flex-col gap-4 items-center w-[22.5rem] sm:w-full justify-center sm:pt-5 sm:pb-3 sm:px-4">
                    <h1 className="w-full h-10 font-semibold text-primary text-center text-[2rem] leading-10 tracking-normal">
                        {TEXTS.pageLogin.formLogin.title}
                    </h1>
                    <InputForms
                        titleInput={TEXTS.pageLogin.formLogin.form.labelEmail}
                        valueInput= {emailInput}
                        onChangeInput={(e) => setEmailInput(e.target.value)}
                        placeholderInput={TEXTS.pageLogin.formLogin.form.placeholderEmail}
                        isTitle={true}
                    />
                    <InputForms
                        titleInput={TEXTS.pageLogin.formLogin.form.labelPassword}
                        valueInput= {passwordInput}
                        onChangeInput={(e) => setPasswordInput(e.target.value)}
                        placeholderInput={TEXTS.pageLogin.formLogin.form.placeholderPassword}
                        valueType="password"
                        isTitle={true}
                    />
                    <ButtonPrimary
                        className="w-full sm:w-full font-semibold text-[0.875rem] leading-3.5 tracking-normal"
                        type="submit"
                        onClick={() => {handleLogin()}}
                    >
                        {TEXTS.pageLogin.formLogin.button.title}
                    </ButtonPrimary>
                </div>
            </div>
        </FadeInSection>
    </div>
  )
}