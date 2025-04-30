import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ModeToggle } from "./ui/themeToggle";
import cafe_logo from "../assets/Logo.png";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/firebase/auth";
import { useAuth } from "./contexts/authProvider";

function LoginForm({ setActiveForm }: { setActiveForm: (activeForm: "login" | "signup") => void }) {
  const navigate = useNavigate({ from: "/" });
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginWithEmail = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        console.log("currentUser", currentUser);

        if (currentUser != null) {
          navigate({ to: "/home/welcome" });
        }
      } catch (error) {
        console.error("Error signing in with email: ", error);
        setErrorMessage((error as Error).message);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const loginWithGoogle = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        const { isProfileComplete } = await doSignInWithGoogle();
        if (!isProfileComplete) {
          navigate({ to: "/profileComplete" });
        } else {
          navigate({ to: "/home/editMenu", search: { category: "appetizers" } });
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
        {/* <div className="gap-2 grid">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="gap-2 grid">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="inline-block ml-auto dark:text-white text-sm underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          onClick={(e) => loginWithEmail(e)}
          type="submit"
          className="w-full"
        >
          Login
        </Button>
        <Button
          onClick={() => navigate({ to: "/profileComplete" })}
          type="submit"
          className="w-full"
        >
          button for testing
        </Button> */}
        <Button className="w-full" onClick={loginWithGoogle}>
          Login with Google
        </Button>
        {errorMessage && (
          <div className="mt-4 p-2 border border-primary rounded text-primary text-center">{errorMessage}</div>
        )}
      </div>
      {/* <div className="mt-4 text-sm text-center">
        Don't have an account?{" "}
        <a
          href="#"
          className="underline"
          onClick={() => setActiveForm("signup")}
        >
          Sign up
        </a>
      </div> */}
    </div>
  );
}

function SignupForm({ setActiveForm }: { setActiveForm: (form: "login" | "signup") => void }) {
  return (
    <div className="gap-6 grid mx-auto w-[350px]">
      <div className="gap-2 grid text-center">
        <h1 className="font-bold text-3xl">Sign Up</h1>
        <p className="text-muted-foreground text-balance">Enter your details below to create a new account</p>
      </div>
      <div className="gap-4 grid">
        <div className="gap-2 grid">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="gap-2 grid">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="gap-2 grid">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </div>
      <div className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <a href="#" onClick={() => setActiveForm("login")} className="underline">
          Login
        </a>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [activeForm, setActiveForm] = useState<"login" | "signup">("login");

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
      <div className="lg:grid lg:grid-cols-2 p-12 w-screen h-screen lg:min-h-[600px] xl:min-h-[800px] overflow-hidden">
        <div className="top-0 right-0 z-10 absolute p-12">
          <ModeToggle />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            className="flex justify-center items-center lg:order-2 py-12 w-full h-full"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={activeForm}
          >
            {activeForm === "login" ? (
              <LoginForm setActiveForm={setActiveForm} />
            ) : (
              <SignupForm setActiveForm={setActiveForm} />
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.div
            className="hidden lg:flex lg:justify-center lg:items-center lg:order-1 bg-transparent lg:border-r lg:w-full lg:h-full"
            variants={variants2}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <img src={cafe_logo} alt="Image" className="w-50 object-contain" />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
