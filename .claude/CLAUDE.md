# Chat Interface - AI Assistant Production App

## Project Overview

A production-ready, slick chat interface built with Next.js 15, React 19, and modern UI patterns. This is a sophisticated ChatGPT-like application with advanced features including conversation management, templates, folders, and a collapsible sidebar.

## Current Status

**Stage:** Transitioning from high-fidelity prototype to production application

**What's Complete:**
- ✅ Full UI/UX implementation with 23 components (~2,200 LOC)
- ✅ Responsive design (mobile overlay sidebar + desktop collapsible)
- ✅ Dark/light theme system with persistence
- ✅ Conversation management (pinning, folders, search)
- ✅ Template system for reusable prompts
- ✅ Message editing and resending
- ✅ Auto-expanding composer with keyboard shortcuts
- ✅ Framer Motion animations throughout
- ✅ LocalStorage persistence for UI preferences

**What Needs Implementation:**
- 🔴 Real AI backend integration (currently mock responses)
- 🔴 Persistent conversation storage (backend or LocalStorage)
- 🔴 API integration for message streaming
- 🔴 File upload functionality
- 🔴 Voice input implementation
- 🔴 Error handling and retry logic
- 🔴 Rate limiting and usage tracking
- 🔴 Authentication system

## Architecture

### Core Components

1. **AIAssistantUI.jsx** (Main orchestrator)
   - State management for all conversations, folders, templates
   - Theme management with system preference detection
   - Keyboard shortcuts (⌘N, /, Escape)
   - Mock AI response logic (NEEDS REPLACEMENT)

2. **Sidebar.jsx** (Navigation & Organization)
   - Collapsible sidebar (320px → 64px icon mode)
   - Search with modal
   - Pinned chats section
   - Recent conversations (last 10)
   - Folder management with nested conversations
   - Template library
   - Settings popover

3. **ChatPane.jsx** (Message Display)
   - Message rendering with role-based styling
   - Edit mode for user messages
   - Resend functionality
   - "Thinking" state with pause button
   - Composer integration with template insertion

4. **Composer.jsx** (Input)
   - Auto-expanding textarea (1-12 lines, then scroll)
   - Keyboard shortcuts (Enter to send, Shift+Enter for newline)
   - Template insertion via ref
   - Action buttons (attachments, voice, send)

5. **Supporting Components**
   - Message.jsx - Role-based message bubbles
   - ConversationRow.jsx - Sidebar conversation items
   - FolderRow.jsx - Expandable folder items
   - TemplateRow.jsx - Template management
   - SearchModal.jsx - Full-screen search interface
   - CreateFolderModal.jsx - Folder creation dialog
   - CreateTemplateModal.jsx - Template editor
   - ThemeToggle.jsx - Dark/light mode switcher

### Data Structure

```javascript
// Conversation Object
{
  id: string,
  title: string,
  updatedAt: ISO8601 string,
  messageCount: number,
  preview: string (first 80 chars of last message),
  pinned: boolean,
  folder: string (folder name or null),
  messages: [
    {
      id: string,
      role: "user" | "assistant",
      content: string,
      createdAt: ISO8601 string,
      editedAt?: ISO8601 string
    }
  ]
}

// Template Object
{
  id: string,
  name: string,
  content: string,
  updatedAt: ISO8601 string
}

// Folder Object
{
  id: string,
  name: string
}
```

## Tech Stack

- **Framework:** Next.js 15.2.4 (App Router)
- **React:** 19 (latest)
- **Styling:** Tailwind CSS v4 with OKLCH colors
- **UI Primitives:** Radix UI (accessibility-first)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Fonts:** Geist & Geist Mono (Vercel fonts)
- **Analytics:** Vercel Analytics

## Development Guidelines

### Code Style
- Use JSX for UI components, TypeScript where type safety is critical
- Functional components with hooks (no class components)
- Keep components under 400 lines when possible
- Use forwardRef for components that need imperative handles

### State Management
- Currently: All state in AIAssistantUI component
- Future: Consider Context API or Zustand when adding auth/user management

### Naming Conventions
- Components: PascalCase (e.g., `AIAssistantUI.jsx`)
- Functions: camelCase (e.g., `createNewChat`)
- CSS classes: Tailwind utility classes
- Files: Match component name exactly

### Keyboard Shortcuts
- `⌘N` / `Ctrl+N` - New chat
- `/` - Focus search (when not in input)
- `Escape` - Close sidebar/modals
- `Enter` - Send message
- `Shift+Enter` - New line in composer

## Critical Next Steps for Production

### 1. Backend Integration Priority
```
HIGH PRIORITY:
- [ ] Integrate OpenAI/Anthropic/Claude API for real AI responses
- [ ] Implement streaming responses (Server-Sent Events or WebSockets)
- [ ] Add conversation persistence (Supabase/Firebase/PostgreSQL)
- [ ] Create API routes in Next.js (/api/chat, /api/conversations)

MEDIUM PRIORITY:
- [ ] File upload and attachment handling
- [ ] Voice input using Web Speech API or Whisper
- [ ] Error boundaries and retry logic
- [ ] Rate limiting and token usage tracking

LOW PRIORITY:
- [ ] User authentication (NextAuth.js)
- [ ] Multi-user support with per-user conversations
- [ ] Export conversations (JSON, Markdown, PDF)
- [ ] Conversation sharing with public links
```

### 2. Data Persistence Options

**Option A: Full Backend (Recommended for production)**
- Next.js API routes + Supabase/PostgreSQL
- Real-time sync across devices
- Multi-user support ready
- Better security and rate limiting

**Option B: localStorage (Quick MVP)**
- Client-side only, no backend needed
- Fast to implement
- Limited to single device
- No authentication

**Option C: Hybrid**
- localStorage for offline-first
- Optional backend sync
- Progressive enhancement

### 3. AI Integration Patterns

**Current Mock Implementation:**
```javascript
// AIAssistantUI.jsx:167-188
setTimeout(() => {
  const ack = `Got it — I'll help with that.`
  // ... add mock assistant message
}, 2000)
```

**Recommended Replacement:**
```javascript
async function sendMessage(convId, content) {
  // Add user message immediately
  addUserMessage(convId, content)
  
  // Set thinking state
  setIsThinking(true)
  setThinkingConvId(convId)
  
  try {
    // Stream AI response
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: convId,
        message: content,
        history: getConversationHistory(convId)
      })
    })
    
    // Handle streaming response
    const reader = response.body.getReader()
    let assistantMessage = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      // Decode and append chunk
      const chunk = new TextDecoder().decode(value)
      assistantMessage += chunk
      updateAssistantMessage(convId, assistantMessage)
    }
  } catch (error) {
    handleError(error)
  } finally {
    setIsThinking(false)
    setThinkingConvId(null)
  }
}
```

## File Structure

```
/
├── .claude/
│   ├── CLAUDE.md (this file)
│   ├── commands/ (slash commands)
│   └── docs/ (additional documentation)
├── app/
│   ├── layout.tsx (root layout with fonts)
│   ├── page.tsx (renders AIAssistantUI)
│   └── globals.css (Tailwind + theme variables)
├── components/
│   ├── AIAssistantUI.jsx (main app)
│   ├── Sidebar.jsx (navigation)
│   ├── ChatPane.jsx (messages)
│   ├── Composer.jsx (input)
│   ├── Message.jsx (message bubble)
│   ├── ConversationRow.jsx
│   ├── FolderRow.jsx
│   ├── TemplateRow.jsx
│   ├── SearchModal.jsx
│   ├── CreateFolderModal.jsx
│   ├── CreateTemplateModal.jsx
│   ├── ComposerActionsPopover.jsx
│   ├── SettingsPopover.jsx
│   ├── ThemeToggle.jsx
│   ├── Header.jsx
│   ├── SidebarSection.jsx
│   ├── GhostIconButton.jsx
│   ├── theme-provider.tsx
│   ├── utils.js (helpers)
│   ├── mockData.js (REMOVE IN PRODUCTION)
│   └── ui/ (Radix components - 59 files)
├── hooks/ (custom React hooks)
├── lib/ (utilities)
├── public/ (static assets)
└── styles/ (additional CSS)
```

## Environment Variables (To Add)

```bash
# .env.local
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Database (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Auth (if using NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
```

## Performance Considerations

- Sidebar uses Framer Motion - already optimized with AnimatePresence
- Message list needs virtualization for 1000+ messages (react-window or react-virtuoso)
- Search could benefit from debouncing (currently instant)
- Consider memoization for expensive renders (React.memo, useMemo)

## Accessibility Features

- Keyboard navigation throughout
- Semantic HTML structure
- ARIA labels on icon buttons
- Focus management in modals
- Screen reader announcements for dynamic content
- Color contrast meets WCAG AA standards

## Testing Strategy (To Implement)

- [ ] Unit tests for utilities (utils.js)
- [ ] Component tests with React Testing Library
- [ ] E2E tests with Playwright for critical flows
- [ ] API route tests
- [ ] Accessibility tests with axe-core

## Deployment Checklist

- [ ] Remove mockData.js and all mock logic
- [ ] Add real API integration
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Add error tracking (Sentry)
- [ ] Set up CI/CD pipeline
- [ ] Performance optimization (bundle size, lighthouse scores)
- [ ] Security audit (API keys, rate limiting, XSS protection)
- [ ] SEO optimization (metadata, OG tags)
- [ ] Analytics setup
- [ ] Legal pages (Privacy Policy, Terms of Service)

## Design System

- **Primary Font:** Geist Sans (body)
- **Mono Font:** Geist Mono (code)
- **Border Radius:** 0.625rem (10px base)
- **Colors:** OKLCH color space for consistent perception
- **Spacing:** Tailwind default scale (4px base)
- **Breakpoints:** Tailwind defaults (sm: 640px, md: 768px, lg: 1024px)
- **Max Width:** 1400px (main container)
- **Sidebar Width:** 320px (expanded), 64px (collapsed)

## Known Issues & Improvements

1. **No actual AI** - Priority #1 to fix
2. **No persistence** - Conversations lost on refresh
3. **Unused components** - 59 Radix components in ui/ folder (tree-shake)
4. **Props drilling** - Consider Context API for theme, user, settings
5. **No loading states** - Add skeleton screens for initial load
6. **No error handling** - Add try/catch and error boundaries
7. **Search is basic** - Consider fuzzy search or filter by date/folder
8. **No conversation limits** - Could hit memory issues with many convos

## Contributing Guidelines

When working on this project:

1. **Always read the current conversation state** before making changes
2. **Test dark mode** - Every UI change should work in both themes
3. **Check mobile** - Responsive design is critical
4. **Maintain keyboard shortcuts** - Don't break existing shortcuts
5. **Update this CLAUDE.md** - Keep documentation in sync with code
6. **Follow the data structure** - Don't add fields without updating types
7. **Consider accessibility** - Every interactive element needs ARIA labels

## Questions to Answer

- Which AI provider should we use? (OpenAI, Anthropic, local model?)
- Do we need authentication or is it single-user?
- Should conversations be stored locally or in a database?
- Do we want real-time collaboration features?
- What's the target deployment platform? (Vercel, AWS, self-hosted?)
- What's the budget for API costs?
- Do we need conversation export/import?

---

**Last Updated:** 2025-10-24
**Status:** Pre-production (UI complete, backend needed)
**Next Milestone:** Integrate real AI API and persistence layer
