"use client";

//IMPORTS DE UTILS, HOOKS, COMPONENTS
import Topbar from "@/components/ui/topbar";
import TEXTS from "../constants/texts";
import ButtonPrimary from "../components/buttonsGlobal/ButtonPrimary";
import ButtonSecondary from "../components/buttonsGlobal/ButtonSecondary";
import { usePathname, useRouter } from "next/navigation";
import { LayoutProps } from "@/lib/types"
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";



export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  //VARIÁVEIS DE ESTADO PARA ARMAZENAMENTO DE DADOS DO USUÁRIO
  const { user: currentUser, loading, logout } = useAuth()

  //FUNÇÃO PARA DESLOGAR O USUÁRIO
  const handleLogout = async () => {
    try {
      const success = await logout();
      
      if(success) {
        toast.success("Logout realizado com sucesso");
        router.push("/login/form");
        router.refresh()
      } else {
        toast.error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer logout");
    }
  };

  //VERIFICA A ROTA ATUAL E RENDERIZA O BOTÃO ADEQUADO
  let buttonToRender = null;
  if (pathname === "/login") {
    buttonToRender = (
      <ButtonPrimary onClick={() => router.push("/login/form")}>
        {TEXTS.pageLogin.header.button.title}
      </ButtonPrimary>
    );
  } else if (pathname !== "/login/form") {
    buttonToRender = (
      <ButtonSecondary
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
      </ButtonSecondary>
    );
  }

  //LOADER DE CARREGAMENTO DO CURRENT USER
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Topbar className="flex fixed z-90 bg-white shadow-md gap-4 items-center justify-between">
        <div className="flex items-center sm:w-[4.625rem] sm:h-[1.4375rem]">
          <h4 className="font-bold text-primary size-[18px] tracking-normal leading-[23px]">
            <a href="/login">
              {TEXTS.pageLogin.header.title}
            </a>
          </h4>
        </div>
        {currentUser && (
          <div className="flex items-center ml-auto gap-4"> 
            <p className="text-sm text-primary">
              Olá, <span className="text-primary font-bold">{currentUser?.name}</span>
            </p>
          </div>
        )}
        {buttonToRender && <div>{buttonToRender}</div>}
      </Topbar>
      {children}
    </>
  );
}