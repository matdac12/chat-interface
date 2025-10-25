# AI Chat Interface

A production-ready, feature-rich chat interface for AI assistants. Built with Next.js 15, React 19, and modern UI patterns inspired by ChatGPT and Claude.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ Features

### Conversation Management
- 📌 **Pin important conversations** for quick access
- 📁 **Organize chats into folders** with custom names
- 🔍 **Search across all conversations** with instant results
- ⏰ **Recent conversations** - Last 10 chats always accessible
- ✏️ **Edit & resend messages** - Iterate on prompts easily

### Advanced UI/UX
- 🎨 **Dark/Light theme** with system preference detection
- 📱 **Fully responsive** - Mobile overlay sidebar, desktop collapsible
- ⌨️ **Keyboard shortcuts** - `⌘N` new chat, `/` search, `Esc` close
- 🎭 **Smooth animations** with Framer Motion
- 🔄 **Auto-expanding composer** - Grows from 1-12 lines, then scrolls
- 💭 **Thinking state** with pause functionality

### Template System
- 📝 **Reusable prompt templates** - Create and manage frequently-used prompts
- 🚀 **Quick insertion** - One-click template insertion into composer
- ✏️ **Edit templates** - Update content and metadata

### Design Excellence
- 🎯 **Modern, clean interface** with subtle shadows and borders
- 🌈 **OKLCH color space** for perceptually uniform colors
- ♿ **Accessibility-first** with Radix UI primitives
- 🔤 **Geist font family** (Vercel's modern typeface)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chatinterface.git
cd chatinterface

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📋 Current Status

**🟡 Development Stage:** Transitioning from prototype to production

### What's Working
✅ Complete UI implementation with 23 components  
✅ Responsive design (mobile + desktop)  
✅ Theme system with persistence  
✅ Conversation organization (folders, pinning, search)  
✅ Template management  
✅ Message editing and resending  
✅ LocalStorage persistence for UI preferences  

### What Needs Implementation
🔴 Real AI backend integration (currently mock responses)  
🔴 Persistent conversation storage  
🔴 API integration for streaming responses  
🔴 File upload functionality  
🔴 Voice input  
🔴 Authentication system  

## 🏗️ Architecture

### Core Components

```
AIAssistantUI (Main App)
├── Sidebar (Navigation & Organization)
│   ├── Search
│   ├── Pinned Chats
│   ├── Recent Conversations
│   ├── Folders (with nested conversations)
│   └── Templates
└── Main Content
    ├── Header (with new chat button)
    └── ChatPane (Messages + Composer)
        ├── Message (role-based bubbles)
        └── Composer (auto-expanding input)
```

### Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI (headless, accessible)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Type Safety:** TypeScript
- **Analytics:** Vercel Analytics

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘N` / `Ctrl+N` | Create new chat |
| `/` | Focus search |
| `Esc` | Close sidebar/modals |
| `Enter` | Send message |
| `Shift+Enter` | New line in composer |

## 🎨 Design System

### Colors
- Uses OKLCH color space for consistent perception
- Automatic dark/light mode with smooth transitions
- System preference detection

### Typography
- **Body:** Geist Sans (Vercel's font)
- **Code:** Geist Mono

### Spacing & Layout
- **Max Width:** 1400px
- **Sidebar:** 320px (expanded), 64px (collapsed)
- **Border Radius:** 10px base
- **Spacing:** 4px base unit (Tailwind scale)

## 📁 Project Structure

```
/
├── .claude/               # Claude Code configuration
│   ├── CLAUDE.md         # Comprehensive project documentation
│   └── commands/         # Custom slash commands
├── app/
│   ├── layout.tsx        # Root layout with fonts & analytics
│   ├── page.tsx          # Main page (renders AIAssistantUI)
│   └── globals.css       # Global styles & theme variables
├── components/
│   ├── AIAssistantUI.jsx       # Main orchestrator
│   ├── Sidebar.jsx             # Navigation & organization
│   ├── ChatPane.jsx            # Message display
│   ├── Composer.jsx            # Message input
│   ├── Message.jsx             # Message bubble
│   ├── ConversationRow.jsx     # Sidebar conversation item
│   ├── FolderRow.jsx           # Folder with nested conversations
│   ├── TemplateRow.jsx         # Template management
│   ├── SearchModal.jsx         # Full-screen search
│   ├── CreateFolderModal.jsx   # Folder creation
│   ├── CreateTemplateModal.jsx # Template editor
│   └── ui/                     # Radix UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# AI Provider (choose one)
OPENAI_API_KEY=sk-...
# OR
ANTHROPIC_API_KEY=sk-ant-...

# Database (optional, for persistence)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...
```

## 🚧 Roadmap to Production

### Phase 1: Core Functionality (Next)
- [ ] Integrate OpenAI/Anthropic API
- [ ] Implement streaming responses
- [ ] Add conversation persistence (localStorage or database)
- [ ] Error handling and retry logic

### Phase 2: Enhanced Features
- [ ] File upload and attachments
- [ ] Voice input (Web Speech API)
- [ ] Conversation export (JSON, Markdown)
- [ ] Rate limiting and usage tracking

### Phase 3: Multi-User Support
- [ ] Authentication (NextAuth.js)
- [ ] Per-user conversations
- [ ] Conversation sharing
- [ ] Real-time sync across devices

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Test your changes in both light and dark mode
4. Ensure mobile responsiveness
5. Update documentation if needed
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📝 Development Guidelines

- **Code Style:** Functional components with hooks
- **File Naming:** PascalCase for components (e.g., `ChatPane.jsx`)
- **Testing:** Test dark mode and mobile responsiveness
- **Accessibility:** Maintain ARIA labels and keyboard navigation
- **Documentation:** Update `.claude/CLAUDE.md` for major changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by ChatGPT and Claude interfaces
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Fonts by [Vercel](https://vercel.com/font)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check `.claude/CLAUDE.md` for comprehensive documentation
- Review existing conversations in the codebase

---

**Built with ❤️ using Next.js and React**

*Last updated: October 2025*
