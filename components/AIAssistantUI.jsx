"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, LayoutGrid, MoreHorizontal } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatPane from "./ChatPane";
import GhostIconButton from "./GhostIconButton";
import ThemeToggle from "./ThemeToggle";

export default function AIAssistantUI() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [theme, setTheme] = useState(() => {
    const saved =
      typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved) return saved;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    )
      return "dark";
    return "light";
  });

  useEffect(() => {
    try {
      if (theme === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", theme);
      document.documentElement.style.colorScheme = theme;
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    try {
      const media =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (!media) return;
      const listener = (e) => {
        const saved = localStorage.getItem("theme");
        if (!saved) setTheme(e.matches ? "dark" : "light");
      };
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } catch {}
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem("sidebar-collapsed");
      return raw
        ? JSON.parse(raw)
        : { pinned: true, recent: false };
    } catch {
      return { pinned: true, recent: false };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
    } catch {}
  }, [collapsed]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sidebar-collapsed-state");
      if (saved) {
        setSidebarCollapsed(JSON.parse(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "sidebar-collapsed-state",
        JSON.stringify(sidebarCollapsed),
      );
    } catch {}
  }, [sidebarCollapsed]);

  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingConvId, setThinkingConvId] = useState(null);
  const composerRef = useRef(null);

  // Fetch conversations from API using React Query
  const {
    data: conversationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to fetch conversations");
      const data = await res.json();
      return data.conversations;
    },
    enabled: !!session,
  });

  const conversations = conversationsData || [];

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async (title = "Nuova Chat") => {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create conversation");
      const data = await res.json();
      return data.conversation;
    },
    onSuccess: (newConversation) => {
      queryClient.setQueryData(["conversations"], (old = []) => [
        newConversation,
        ...old,
      ]);
      setSelectedId(newConversation.id);
      setSidebarOpen(false);
    },
  });

  // Update conversation mutation
  const updateConversationMutation = useMutation({
    mutationFn: async ({ id, updates }) => {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update conversation");
      const data = await res.json();
      return data.conversation;
    },
    onSuccess: (updatedConversation) => {
      queryClient.setQueryData(["conversations"], (old = []) =>
        old.map((conv) =>
          conv.id === updatedConversation.id ? { ...conv, ...updatedConversation } : conv
        )
      );
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete conversation");
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["conversations"], (old = []) =>
        old.filter((conv) => conv.id !== deletedId)
      );
      if (selectedId === deletedId) {
        setSelectedId(null);
      }
    },
  });

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }) => {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to update message");
      const data = await res.json();
      return data.message;
    },
    onSuccess: (updatedMessage) => {
      // Update the conversation in the cache
      queryClient.setQueryData(["conversations"], (old = []) =>
        old.map((conv) => {
          if (conv.id === updatedMessage.conversationId) {
            return {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              ),
            };
          }
          return conv;
        })
      );
    },
  });

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNewChat();
      }
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          searchRef.current?.focus();
        }
      }
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      createNewChat();
    }
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations;
    const q = query.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const pinned = filtered
    .filter((c) => c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10);

  function togglePin(id) {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      updateConversationMutation.mutate({
        id,
        updates: { pinned: !conversation.pinned },
      });
    }
  }

  function deleteConversation(id) {
    deleteConversationMutation.mutate(id);
  }

  function createNewChat() {
    createConversationMutation.mutate("Nuova Chat");
  }

  function clearAllChats() {
    if (
      confirm(
        "Sei sicuro di voler eliminare tutte le conversazioni? Questa azione non può essere annullata."
      )
    ) {
      conversations.forEach((conv) => {
        deleteConversationMutation.mutate(conv.id);
      });
      setSelectedId(null);
    }
  }

  async function sendMessage(convId, content) {
    if (!content.trim()) return;

    const conversation = conversations.find((c) => c.id === convId);
    if (!conversation) return;

    // Optimistically add user message to UI
    const optimisticUserMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    queryClient.setQueryData(["conversations"], (old = []) =>
      old.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: [...(c.messages || []), optimisticUserMsg],
          updatedAt: new Date().toISOString(),
          preview: content.slice(0, 80),
        };
      })
    );

    setIsThinking(true);
    setThinkingConvId(convId);

    const isFirstMessage = !conversation.messages || conversation.messages.length === 0;

    try {
      // Call API to send message
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversationId: convId,
          openaiConversationId: conversation.openaiConversationId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "API request failed");
      }

      // Refresh conversations to get updated messages from server
      await queryClient.invalidateQueries(["conversations"]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic update on error
      queryClient.setQueryData(["conversations"], (old = []) =>
        old.map((c) => {
          if (c.id !== convId) return c;
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== optimisticUserMsg.id),
          };
        })
      );
    } finally {
      setIsThinking(false);
      setThinkingConvId(null);
    }

    // Generate title automatically after first message (runs in background)
    if (isFirstMessage) {
      console.log("First message detected - generating title in background...");
      fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversationId: convId }),
      })
        .then((response) => response.json())
        .then((titleData) => {
          if (titleData.success && titleData.title) {
            console.log("Generated title:", titleData.title);
            // Refresh conversations to get updated title
            queryClient.invalidateQueries(["conversations"]);
          }
        })
        .catch((titleError) => {
          console.error("Failed to generate title:", titleError);
        });
    }
  }

  function editMessage(convId, messageId, newContent) {
    updateMessageMutation.mutate({ messageId, content: newContent });
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId);
    const msg = conv?.messages?.find((m) => m.id === messageId);
    if (!msg) return;
    sendMessage(convId, msg.content);
  }

  function pauseThinking() {
    setIsThinking(false);
    setThinkingConvId(null);
  }

  const selected = conversations.find((c) => c.id === selectedId) || null;

  return (
    <div className="h-screen w-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="ml-1 flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="inline-flex h-4 w-4 items-center justify-center">
            ✱
          </span>{" "}
          Zafferano IT
        </div>
        <div className="ml-auto flex items-center gap-2">
          <GhostIconButton label="Schedule">
            <Calendar className="h-4 w-4" />
          </GhostIconButton>
          <GhostIconButton label="Apps">
            <LayoutGrid className="h-4 w-4" />
          </GhostIconButton>
          <GhostIconButton label="More">
            <MoreHorizontal className="h-4 w-4" />
          </GhostIconButton>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <div className="mx-auto flex h-[calc(100vh-0px)] max-w-[1400px]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          setTheme={setTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          conversations={conversations}
          pinned={pinned}
          recent={recent}
          folders={[]}
          folderCounts={{}}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
          togglePin={togglePin}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          createFolder={() => {}}
          createNewChat={createNewChat}
          templates={[]}
          setTemplates={() => {}}
          onUseTemplate={() => {}}
          onClearAll={clearAllChats}
        />

        <main className="relative flex min-w-0 flex-1 flex-col">
          <Header
            createNewChat={createNewChat}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarOpen={setSidebarOpen}
          />
          <ChatPane
            ref={composerRef}
            conversation={selected}
            onSend={(content) => selected && sendMessage(selected.id, content)}
            onEditMessage={(messageId, newContent) =>
              selected && editMessage(selected.id, messageId, newContent)
            }
            onResendMessage={(messageId) =>
              selected && resendMessage(selected.id, messageId)
            }
            isThinking={isThinking && thinkingConvId === selected?.id}
            onPauseThinking={pauseThinking}
          />
        </main>
      </div>
    </div>
  );
}
