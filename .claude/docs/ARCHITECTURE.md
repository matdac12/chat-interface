# Architecture Documentation

## System Overview

This is a client-side React application built with Next.js 15 that provides a sophisticated chat interface for AI assistants. The architecture follows a component-based design with centralized state management and clear separation of concerns.

## Component Hierarchy

```
AIAssistantUI (Root Component)
│
├── State Management
│   ├── Theme state (light/dark with localStorage + system preference)
│   ├── Sidebar state (open/closed, collapsed sections)
│   ├── Conversations state (all chat data)
│   ├── Templates state (reusable prompts)
│   ├── Folders state (organization)
│   └── UI state (selected conversation, thinking state, search query)
│
├── Sidebar Component
│   ├── Logo & Branding
│   ├── Search Input (with modal trigger)
│   ├── New Chat Button
│   │
│   ├── Pinned Chats Section
│   │   └── ConversationRow components (filtered by pinned=true)
│   │
│   ├── Recent Section
│   │   └── ConversationRow components (last 10, pinned=false)
│   │
│   ├── Folders Section
│   │   ├── Create Folder Button
│   │   └── FolderRow components
│   │       └── ConversationRow components (nested, filtered by folder)
│   │
│   ├── Templates Section
│   │   ├── Create Template Button
│   │   └── TemplateRow components
│   │
│   └── Footer
│       ├── Settings Popover
│       ├── Theme Toggle
│       └── User Profile
│
└── Main Content
    ├── Header
    │   ├── Menu Button (mobile)
    │   └── New Chat Button
    │
    └── ChatPane
        ├── Conversation Header
        │   ├── Title
        │   ├── Metadata (last updated, message count)
        │   └── Tags
        │
        ├── Message List
        │   ├── Message components (user role)
        │   ├── Message components (assistant role)
        │   └── ThinkingMessage (conditional)
        │
        └── Composer
            ├── Auto-expanding Textarea
            ├── Action Buttons
            │   ├── Attachments (Plus icon)
            │   ├── Voice Input (Mic icon)
            │   └── Send Button
            └── Keyboard Hint
```

## Data Flow

### 1. Message Sending Flow

```
User Types Message → Composer Component
         ↓
    onSend callback
         ↓
AIAssistantUI.sendMessage(convId, content)
         ↓
    [1] Add user message to conversation
    [2] Update conversation metadata (updatedAt, messageCount, preview)
    [3] Set isThinking = true
         ↓
    Mock AI Response (setTimeout 2s)
    OR
    [FUTURE] Real API Call
         ↓
    [4] Add assistant message to conversation
    [5] Set isThinking = false
         ↓
    ChatPane re-renders with new messages
```

### 2. Conversation Selection Flow

```
User clicks ConversationRow in Sidebar
         ↓
    onSelect(conversationId) callback
         ↓
AIAssistantUI.setSelectedId(conversationId)
         ↓
    State Update
         ↓
ChatPane receives new conversation prop
         ↓
    Re-renders with conversation.messages
```

### 3. Theme Management Flow

```
User clicks ThemeToggle
         ↓
    setTheme("dark" | "light")
         ↓
    useEffect triggered
         ↓
    [1] Add/remove "dark" class on <html>
    [2] Set data-theme attribute
    [3] Set color-scheme CSS property
    [4] Save to localStorage
         ↓
    CSS variables update
         ↓
    UI re-renders with new theme
```

### 4. Template Insertion Flow

```
User clicks "Use Template" in TemplateRow
         ↓
    onUseTemplate(template) callback
         ↓
AIAssistantUI.handleUseTemplate(template)
         ↓
    composerRef.current.insertTemplate(template.content)
         ↓
Composer.insertTemplate via useImperativeHandle
         ↓
    [1] Append template to current value
    [2] Focus textarea
    [3] Move cursor to end
         ↓
    User can edit and send
```

## State Management

### Current Approach: Local State in AIAssistantUI

All application state lives in the root `AIAssistantUI` component and is passed down via props.

**Advantages:**
- Simple and straightforward
- No external dependencies
- Easy to debug (all state in one place)
- Sufficient for current app size

**Disadvantages:**
- Props drilling (passing callbacks 3-4 levels deep)
- Re-renders entire tree on state changes
- Difficult to scale beyond current size

### State Structure

```javascript
// Theme
theme: "light" | "dark"

// Sidebar
sidebarOpen: boolean (mobile only)
sidebarCollapsed: boolean (desktop icon mode)
collapsed: {
  pinned: boolean,
  recent: boolean,
  folders: boolean,
  templates: boolean
}

// Conversations
conversations: Array<{
  id: string,
  title: string,
  updatedAt: string (ISO 8601),
  messageCount: number,
  preview: string,
  pinned: boolean,
  folder: string | null,
  messages: Array<{
    id: string,
    role: "user" | "assistant",
    content: string,
    createdAt: string,
    editedAt?: string
  }>
}>

// Templates
templates: Array<{
  id: string,
  name: string,
  content: string,
  updatedAt: string
}>

// Folders
folders: Array<{
  id: string,
  name: string
}>

// UI State
selectedId: string | null (current conversation)
query: string (search query)
isThinking: boolean
thinkingConvId: string | null
```

### Future State Management Options

**Option 1: Context API**
```javascript
// contexts/AppContext.js
export const ConversationsContext = createContext()
export const ThemeContext = createContext()
export const UIContext = createContext()

// Pros: Built-in, no dependencies, good for theming
// Cons: Can cause unnecessary re-renders, verbose
```

**Option 2: Zustand** (Recommended for scaling)
```javascript
// stores/useAppStore.js
import create from 'zustand'

export const useAppStore = create((set) => ({
  conversations: [],
  selectedId: null,
  addConversation: (conv) => set((state) => ({
    conversations: [conv, ...state.conversations]
  })),
  // ... more actions
}))

// Pros: Simple API, no providers, granular subscriptions
// Cons: External dependency
```

**Option 3: Redux Toolkit**
```javascript
// Too heavy for this app, not recommended
// Pros: DevTools, time travel debugging
// Cons: Boilerplate, overkill for current needs
```

## Persistence Strategy

### Current: Partial Persistence
- ✅ Theme → localStorage (`theme`)
- ✅ Sidebar collapsed state → localStorage (`sidebar-collapsed`)
- ✅ Sidebar icon mode → localStorage (`sidebar-collapsed-state`)
- ❌ Conversations → **NOT PERSISTED** (lost on refresh)
- ❌ Templates → **NOT PERSISTED**
- ❌ Folders → **NOT PERSISTED**

### Future Options

**Option A: Full LocalStorage**
```javascript
// On every state change
useEffect(() => {
  localStorage.setItem('conversations', JSON.stringify(conversations))
}, [conversations])

// On mount
useEffect(() => {
  const saved = localStorage.getItem('conversations')
  if (saved) setConversations(JSON.parse(saved))
}, [])

// Pros: Simple, no backend, works offline
// Cons: 5-10MB limit, single device, no sync
```

**Option B: IndexedDB** (Recommended for large data)
```javascript
// Use libraries like Dexie.js or idb
import Dexie from 'dexie'

const db = new Dexie('ChatApp')
db.version(1).stores({
  conversations: 'id, updatedAt, folder',
  messages: 'id, conversationId, createdAt',
  templates: 'id, name'
})

// Pros: Large storage (50MB+), structured queries
// Cons: Async API, more complex, single device
```

**Option C: Backend Database** (Recommended for production)
```javascript
// Next.js API Routes + Supabase/PostgreSQL
// /api/conversations/[id].js
export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'GET') {
    const conversation = await db.conversations.findById(id)
    res.json(conversation)
  }
}

// Pros: Multi-device sync, backup, multi-user ready
// Cons: Backend complexity, hosting costs, auth needed
```

## AI Integration Architecture

### Current: Mock Implementation

```javascript
// AIAssistantUI.jsx:167
function sendMessage(convId, content) {
  // Add user message
  setConversations(prev => /* ... */)
  
  // Fake thinking
  setIsThinking(true)
  
  // Fake response after 2s
  setTimeout(() => {
    const response = "Got it — I'll help with that."
    setConversations(prev => /* add response */)
    setIsThinking(false)
  }, 2000)
}
```

### Future: Real AI Integration

#### Approach 1: Server-Sent Events (SSE)

```javascript
// /app/api/chat/route.js (Next.js 13+)
export async function POST(req) {
  const { message, conversationId } = await req.json()
  
  // Create readable stream
  const stream = new ReadableStream({
    async start(controller) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
        stream: true,
      })
      
      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || ''
        controller.enqueue(new TextEncoder().encode(content))
      }
      
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

// Client-side (AIAssistantUI.jsx)
async function sendMessage(convId, content) {
  addUserMessage(convId, content)
  setIsThinking(true)
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content, conversationId: convId })
  })
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let assistantMessage = ''
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    
    assistantMessage += decoder.decode(value)
    updateAssistantMessage(convId, assistantMessage)
  }
  
  setIsThinking(false)
}
```

**Pros:** Native browser support, simple server, good UX  
**Cons:** One-way only, no binary data, connection management

#### Approach 2: WebSockets

```javascript
// Use socket.io or native WebSocket
const socket = io('/api/chat')

socket.emit('message', {
  conversationId: convId,
  content: message
})

socket.on('chunk', (chunk) => {
  appendToMessage(convId, chunk)
})

socket.on('complete', () => {
  setIsThinking(false)
})
```

**Pros:** Bi-directional, real-time, binary support  
**Cons:** More complex server, harder to scale, connection state

#### Approach 3: Long Polling (Fallback)

```javascript
// Simplest but least efficient
async function pollForResponse(convId, messageId) {
  while (true) {
    const res = await fetch(`/api/messages/${messageId}/poll`)
    const { complete, content } = await res.json()
    
    updateMessage(convId, messageId, content)
    
    if (complete) break
    await new Promise(r => setTimeout(r, 500))
  }
}
```

**Pros:** Works everywhere, simple  
**Cons:** High latency, inefficient, poor UX

## Performance Considerations

### Current Optimizations
- ✅ Framer Motion uses GPU acceleration
- ✅ Search filters in useMemo
- ✅ Textarea auto-resize uses direct DOM manipulation
- ✅ Tailwind purges unused CSS

### Future Optimizations

**1. Message List Virtualization**
```javascript
// Problem: Rendering 1000+ messages is slow
// Solution: Use react-window or react-virtuoso

import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={messages.length}
  itemSize={100}
>
  {({ index, style }) => (
    <div style={style}>
      <Message message={messages[index]} />
    </div>
  )}
</FixedSizeList>
```

**2. Code Splitting**
```javascript
// Lazy load modals
const SearchModal = lazy(() => import('./SearchModal'))
const CreateFolderModal = lazy(() => import('./CreateFolderModal'))

// Only load when opened
{showSearchModal && (
  <Suspense fallback={<div>Loading...</div>}>
    <SearchModal />
  </Suspense>
)}
```

**3. Memoization**
```javascript
// Prevent unnecessary re-renders
const ConversationRow = React.memo(({ data, active, onSelect }) => {
  // ... component
}, (prev, next) => {
  // Custom comparison
  return prev.data.id === next.data.id &&
         prev.active === next.active
})

// Memoize expensive computations
const sortedConversations = useMemo(() => {
  return conversations.sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  )
}, [conversations])
```

**4. Debouncing Search**
```javascript
import { useDebounce } from 'use-debounce'

const [query, setQuery] = useState('')
const [debouncedQuery] = useDebounce(query, 300)

// Use debouncedQuery for filtering
const filtered = useMemo(() => {
  return conversations.filter(c => 
    c.title.toLowerCase().includes(debouncedQuery.toLowerCase())
  )
}, [conversations, debouncedQuery])
```

## Security Considerations

### Current Status
- ⚠️ No authentication
- ⚠️ No rate limiting
- ⚠️ API keys would be exposed (if added to client)
- ⚠️ No XSS protection in message rendering
- ⚠️ No input sanitization

### Production Requirements

**1. API Key Security**
```javascript
// ❌ NEVER do this
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY // Exposed to client!
})

// ✅ Always use server-side API routes
// /app/api/chat/route.js
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Server-side only
})
```

**2. XSS Protection**
```javascript
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: message.content }} />

// ✅ Safe (React auto-escapes)
<div>{message.content}</div>

// ✅ For markdown, use sanitizer
import DOMPurify from 'isomorphic-dompurify'
import ReactMarkdown from 'react-markdown'

<ReactMarkdown
  components={{
    // Customize rendering
  }}
>
  {DOMPurify.sanitize(message.content)}
</ReactMarkdown>
```

**3. Rate Limiting**
```javascript
// Use next-rate-limit or upstash
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

export async function POST(req) {
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
  const { success } = await ratelimit.limit(identifier)
  
  if (!success) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  // ... handle request
}
```

**4. Input Validation**
```javascript
import { z } from 'zod'

const messageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(10000),
})

export async function POST(req) {
  const body = await req.json()
  const parsed = messageSchema.safeParse(body)
  
  if (!parsed.success) {
    return new Response('Invalid input', { status: 400 })
  }
  
  // ... use parsed.data
}
```

## Testing Strategy

### Unit Tests (Jest + React Testing Library)
```javascript
// __tests__/components/Message.test.jsx
describe('Message', () => {
  it('renders user message with correct styling', () => {
    render(<Message role="user">Hello</Message>)
    expect(screen.getByText('Hello')).toHaveClass('bg-zinc-900')
  })
})
```

### Integration Tests
```javascript
// __tests__/features/chat.test.jsx
describe('Chat Flow', () => {
  it('allows sending and receiving messages', async () => {
    render(<AIAssistantUI />)
    
    const input = screen.getByPlaceholderText('How can I help you today?')
    await userEvent.type(input, 'Hello{Enter}')
    
    expect(await screen.findByText('Hello')).toBeInTheDocument()
    expect(await screen.findByText(/Got it/)).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)
```javascript
// e2e/chat.spec.ts
test('full chat workflow', async ({ page }) => {
  await page.goto('/')
  
  // Create new chat
  await page.click('text=Start New Chat')
  
  // Send message
  await page.fill('textarea', 'Write a haiku')
  await page.press('textarea', 'Enter')
  
  // Wait for response
  await page.waitForSelector('text=/haiku/')
  
  // Pin conversation
  await page.click('[aria-label="Pin conversation"]')
  
  // Verify in pinned section
  const pinned = page.locator('text=PINNED CHATS').locator('..')
  await expect(pinned.locator('text=Write a haiku')).toBeVisible()
})
```

## Accessibility

### Current Features
- ✅ Semantic HTML (`<nav>`, `<main>`, `<button>`)
- ✅ ARIA labels on icon buttons
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Focus management in modals
- ✅ Color contrast (WCAG AA compliant)

### Future Improvements
- [ ] Screen reader announcements for new messages
- [ ] Skip navigation link
- [ ] Aria-live regions for thinking state
- [ ] High contrast mode
- [ ] Reduced motion preference

```javascript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

<motion.div
  animate={{ opacity: prefersReducedMotion ? 1 : [0, 1] }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
```

---

**Last Updated:** 2025-10-24  
**Status:** Documentation Complete  
**Next:** Begin API integration
