"use client";

import { useState } from "react";
import { Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export function SignInCard({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  onSignIn,
  isLoading,
  error,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-10 shadow-2xl">
        {/* Header */}
        <div className="flex justify-center mb-6">
          <Image
            src="/LOGO-ZAFFERANO.png"
            alt="Zafferano"
            width={64}
            height={64}
          />
        </div>

        <h1 className="text-xl font-light text-white text-center mb-8">
          Assistente IT
        </h1>

        <form onSubmit={onSignIn} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg h-12 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-0 focus:outline-none pl-11 text-sm transition-colors duration-200"
                placeholder="nome@azienda.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-neutral-400 text-xs font-medium uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg h-12 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-0 focus:outline-none px-4 pr-11 text-sm transition-colors duration-200"
                placeholder="Inserisci la password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-neutral-400 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-950 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Remember me */}
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-neutral-700 bg-neutral-900 text-white focus:ring-neutral-600 focus:ring-1"
                disabled={isLoading}
              />
              <span className="text-neutral-500 text-sm">Ricordami</span>
            </label>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full bg-white hover:bg-neutral-200 text-black font-medium rounded-lg h-12 mt-4 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                Accesso in corso...
              </div>
            ) : (
              "Accedi"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
