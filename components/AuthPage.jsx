"use client";

import { useState } from "react";
import { SignInCard } from "./auth/SignInCard";
import { validateCredentials, createSession } from "@/lib/auth";

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

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validate credentials
    if (validateCredentials(email, password)) {
      // Create session
      createSession(email, rememberMe);

      // Success - notify parent component
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } else {
      // Failed authentication
      setError("Email o password non corretti");
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
