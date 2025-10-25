"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { SignInCard } from "./auth/SignInCard";

export default function AuthPage({ onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use NextAuth signIn
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Failed authentication
        setError("Email o password non corretti");
        setIsLoading(false);
      } else if (result?.ok) {
        // Success - notify parent component
        if (onAuthSuccess) {
          onAuthSuccess();
        }
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Si è verificato un errore durante il login");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <SignInCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        rememberMe={rememberMe}
        setRememberMe={setRememberMe}
        onSignIn={handleSignIn}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
