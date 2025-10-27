"use client";

import { Clock, Asterisk, X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ProfileCard({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { data: session } = useSession();
  const fullName = session?.user?.name || "User";
  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Profile Card */}
      <div className="fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 transform">
        <div className="w-[400px] rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          {/* Dark section */}
          <div className="bg-zinc-900 p-6 rounded-t-[32px] relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-2 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>

            {/* Header with status and time */}
            <div className="flex items-center justify-between mb-8 pr-12">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-zinc-400 text-sm font-medium">
                  {dateStr}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{timeStr}</span>
              </div>
            </div>

            {/* Profile section */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                {initials}
              </div>
              <div>
                <h1 className="text-white text-2xl font-semibold">
                  {fullName}
                </h1>
                <p className="text-zinc-400 text-base">{session?.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Red bottom section with branding */}
          <div className="bg-red-500 rounded-b-[32px] p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Asterisk className="w-5 h-5 text-white" />
              <span className="text-white text-base font-medium">
                Zafferano IT
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
