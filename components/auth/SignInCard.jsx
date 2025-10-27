"use client";

import { useState } from "react";
import { Mail, Eye, EyeOff, Asterisk } from "lucide-react";

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
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg">
              <Asterisk className="h-6 w-6" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white">
              Zafferano IT
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-normal text-white mb-2 text-center transition-all duration-300">
          Bentornato
        </h1>
        <p className="text-white/60 text-center mb-8">
          Accedi al tuo account
        </p>

        <form onSubmit={onSignIn} className="space-y-4">
          {/* Email field */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 transition-colors duration-200" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 focus:outline-none pl-12 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
              placeholder="Inserisci la tua email"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-14 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-0 focus:outline-none pr-12 pl-4 text-base transition-all duration-200 hover:bg-black/30 focus:bg-black/30"
              placeholder="Inserisci la tua password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-white/20 bg-black/20 text-white focus:ring-white/20 focus:ring-2"
                disabled={isLoading}
              />
              <span className="text-white/60 text-sm">Ricordami</span>
            </label>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-14 mt-8 text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Accesso in corso...
              </div>
            ) : (
              "Accedi"
            )}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-8">
          Accedendo, accetti i nostri Termini di Servizio
        </p>
      </div>
    </div>
  );
}
