"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import Image from "next/image";
import { FadeInSection } from "@/components/ui/animated-components";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const router = useRouter();

  const [windowWidth, setWindowWidth] = useState(1200);
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
  }, []);

  const shouldShowButton = isHovered || isClicked || isButtonHovered;

  const handleLogoClick = () => {
    setIsClicked(!isClicked);
  };

  const handleNavigateToTechblog = () => {
    router.push("/login");
  };

  const floatingElements = [
    { id: 1, initialX: 200, initialY: 100 },
    { id: 2, initialX: 500, initialY: 300 },
    { id: 3, initialX: 800, initialY: 150 },
    { id: 4, initialX: 300, initialY: 600 },
    { id: 5, initialX: 700, initialY: 400 },
    { id: 6, initialX: 1000, initialY: 200 },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-90">
        <MeshGradient
          colors={[
            "#94c833",
            "#73964f",
            "#141c0d",
            "#060606",
            "#1e1e1e",
          ]}
          
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute w-2 h-2 bg-button-primary/20 rounded-full"
            initial={{
              x: element.initialX,
              y: element.initialY,
            }}
            animate={{
              x: Math.random() * windowWidth,
              y: Math.random() * windowHeight,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      <FadeInSection className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="relative">
          <motion.div
            className="relative cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleLogoClick}
          >
            <motion.div
              animate={{
                y: shouldShowButton ? -25 : 0,
                
              }}
              transition={{
                y: { 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 0.8,
                  ease: "easeInOut"
                },
              }}
              className="relative"
            >
              <div className="relative p-6">
                <Image
                  src="/graodireto.png"
                  alt="Grão Direto Logo"
                  width={280}
                  height={280}
                  className="w-90 h-90 object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-0 h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {shouldShowButton && (
              <motion.div
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 25, scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                  mass: 0.8,
                  opacity: { duration: 0.4, ease: "easeInOut" },
                  scale: { duration: 0.4, ease: "easeInOut" }
                }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <motion.button
                  onClick={handleNavigateToTechblog}
                  className="group cursor-pointer relative px-10 py-4 bg-[#141c0d] backdrop-blur-xl text-white font-semibold text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-[#94c833]/30  overflow-hidden"
                  whileHover={{ 
                    scale: 1.02, 
                    y: -1,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { type: "spring", stiffness: 600, damping: 30 }
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-button-primary/10 to-transparent" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isButtonHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />

                  <span className="relative z-10 flex items-center gap-3 tracking-wide">
                    <svg 
                      className="w-5 h-5 text-button-primary" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M13 7l5 5m0 0l-5 5m5-5H6" 
                      />
                    </svg>
                    Acessar TechBlog
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white text-sm"
          >
            <span className="block text-center mb-2">Passe o mouse sobre a logo</span>
            <div className="w-6 h-6 mx-auto border-2 border-button-primary/30 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-button-primary rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </FadeInSection>
    </div>
  );
}