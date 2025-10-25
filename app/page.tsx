"use client";

import { useState, useEffect } from "react";
import AIAssistantUI from "../components/AIAssistantUI";
import AuthPage from "../components/AuthPage";
import { isAuthenticated } from "@/lib/auth";

export default function Page() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = () => {
    setAuthenticated(true);
  };

  // Show loading state briefly to avoid flash
  if (loading) {
    return null;
  }

  // Show auth page if not authenticated
  if (!authenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Show main app if authenticated
  return <AIAssistantUI />;
}
