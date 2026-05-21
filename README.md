# Conversational UI - Production Design System Starter

A production-quality conversational UI landing page built with Next.js 14, TypeScript, Tailwind CSS, and a complete design token system.

## Features

- **Design Token System**: JSON-driven CSS variables for consistent theming
- **SVG Icon Library**: Reusable icon component pattern
- **Component Library**: Enterprise-grade UI primitives
- **Conversational Interface**: Chat-style input and prompt suggestions
- **Responsive Design**: Mobile-first layout with adaptive sidebar
- **Type-Safe**: Full TypeScript coverage
- **Accessible**: WCAG-compliant components
- **Minimal Aesthetic**: Understated, elegant enterprise SaaS design

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Quick Start

```bash
cd conversational-ui
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

Visit [http://localhost:3000/showcase](http://localhost:3000/showcase) to see all components.

📖 **New to the project?** Start with [QUICKSTART.md](./QUICKSTART.md)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
/app                    # Next.js App Router pages
/components
  /ui                   # Reusable UI primitives (Button, Card, Input, etc.)
  /chat                 # Conversation-specific components
  /icons                # Custom SVG icon components
/lib                    # Utilities and helpers
  tokens.ts             # Token parser and generator
  svg-icon-loader.ts    # Icon system utilities
/tokens
  tokens.json           # Design tokens (single source of truth)
/styles                 # Additional style utilities
/hooks                  # Custom React hooks
/public
  /svg                  # SVG source files
```

## Design Token System

All design values are defined in `/tokens/tokens.json` and automatically converted to:
- CSS variables (in `globals.css`)
- Tailwind theme extensions
- TypeScript exports

### Using Tokens

**In CSS/Tailwind:**
```tsx
<div className="bg-background border border-border text-text-primary">
  Content
</div>
```

**In CSS Variables:**
```css
.custom-class {
  background: var(--background);
  color: var(--text-primary);
}
```

**In TypeScript:**
```tsx
import { tokens } from '@/lib/tokens';
const bgColor = tokens.colors.background;
```

### Modifying Tokens

Edit `/tokens/tokens.json` - changes automatically propagate throughout the application.

## Icon System

### Adding Icons

1. Place SVG file in `/public/svg`
2. Create component in `/components/icons/MyIcon.tsx`:

```tsx
import { IconProps } from '@/lib/svg-icon-loader';

export function MyIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="..." fill="currentColor" />
    </svg>
  );
}
```

3. Export from `/components/icons/index.ts`:

```tsx
export { MyIcon } from './MyIcon';
```

4. Use anywhere:

```tsx
import { MyIcon } from '@/components/icons';
<MyIcon size={32} className="text-accent-main" />
```

## Component Library

### Available Components

- **UI Primitives**: `Button`, `Card`, `IconButton`, `TextArea`, `Divider`, `Surface`
- **Chat Components**: `PromptInput`, `PromptSuggestion`, `ConversationHero`, `Sidebar`, `ModelSelector`

### Creating New Components

Follow the established patterns:
- Accept design token-based props
- Support className for custom styling
- Include TypeScript types
- Make accessible (ARIA labels, keyboard nav)
- Add hover/focus states

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React + Custom SVGs
- **Fonts**: Geist Sans + Geist Mono

## Design Philosophy

This project embodies a **minimal, enterprise aesthetic**:
- Generous whitespace
- Soft neutral palette
- Subtle borders and shadows
- Understated hover states
- Clinical productivity focus
- No flashy animations
- Restrained color usage

Perfect for B2B SaaS, productivity tools, enterprise dashboards, and professional applications.

## Development Status

✅ **Phase 1**: Project setup, token system, Tailwind config
✅ **Phase 2**: Layout shell and sidebar  
✅ **Phase 3**: UI primitives (Button, Card, IconButton, TextArea, Surface, Divider)
✅ **Phase 4**: Prompt input system with model selector
✅ **Phase 5**: Prompt suggestions with animations
✅ **Phase 6**: Responsive design and mobile support

## Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Complete technical documentation
- **[Component Showcase](http://localhost:3000/showcase)** - Live component examples (run dev server first)

## License

MIT
