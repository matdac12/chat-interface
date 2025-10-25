"use client";

import { useSession } from "next-auth/react";
import AIAssistantUI from "../components/AIAssistantUI";
import AuthPage from "../components/AuthPage";

export default function Page() {
  const { data: session, status } = useSession();

  const handleAuthSuccess = () => {
    // Session will automatically update via NextAuth
    window.location.reload();
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return null;
  }

  // Show auth page if not authenticated
  if (status === "unauthenticated" || !session) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main app if authenticated
  return <AIAssistantUI />;
}
