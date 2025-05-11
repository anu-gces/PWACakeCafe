import { doSignInWithGoogle } from "@/firebase/auth";
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import CakeCakeLogo from "../assets/Logob.png";
import { Button } from "./ui/button";

import { ModeToggle } from "./ui/themeToggle";

function LoginForm() {
  const navigate = useNavigate({ from: "/" });

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginWithGoogle = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const { isProfileComplete } = await doSignInWithGoogle();
        if (!isProfileComplete) {
          navigate({ to: "/profileComplete" });
        } else {
          navigate({
            to: "/home/editMenu",
            search: { category: "appetizers" },
          });
        }
      } catch (error) {
        console.error("Error signing in with Google: ", error);
        setErrorMessage("Error signing in with Google: " + (error as Error).message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="gap-6 grid mx-auto w-[350px]">
      <div className="gap-2 grid text-center">
        <h1 className="font-bold text-3xl">Login</h1>
        <p className="text-muted-foreground text-balance">Cick the Button below to login to your account.</p>
      </div>
      <div className="gap-4 grid">
        <Button className="w-full" onClick={loginWithGoogle}>
          Login with Google
        </Button>
        {errorMessage && (
          <div className="mt-4 p-2 border border-primary rounded text-primary text-center">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}

export function LandingPage() {
  const variants = {
    hidden: { x: "75vw", transition: { duration: 0.5 } },
    visible: { x: 0, transition: { duration: 0.5 } },
    exit: { x: "75vw", transition: { duration: 0.5 } },
  };

  const variants2 = {
    hidden: { y: "-100vh", transition: { duration: 0.5 } },
    visible: { y: 0, transition: { duration: 0.5 } },
    exit: { y: "-100vh", transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="flex lg:flex-row flex-col p-4 w-screen h-screen overflow-clip">
        <div className="top-0 right-0 z-10 absolute p-12">
          <ModeToggle />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            className="flex justify-center items-end lg:items-center pb-4 w-full lg:w-1/2 h-1/2 lg:h-full"
            variants={variants2}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <img src={CakeCakeLogo} alt="Image" className="w-50 object-contain" />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            className="flex justify-center items-start lg:items-center pt-4 border-t-1 lg:border-t-0 lg:border-l-1 w-full lg:w-1/2 h-1/2 lg:h-full"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={"login-form"}
          >
            <LoginForm />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
