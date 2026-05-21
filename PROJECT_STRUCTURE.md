# Project Structure

## Complete File Tree

```
conversational-ui/
│
├── 📁 app/                          # Next.js 14 App Router
│   ├── page.tsx                     # Main landing page (home)
│   ├── layout.tsx                   # Root layout with fonts
│   ├── globals.css                  # Global styles & design tokens
│   ├── favicon.ico                  # Site favicon
│   └── 📁 showcase/
│       └── page.tsx                 # Component showcase demo page
│
├── 📁 components/                   # React components
│   ├── 📁 ui/                       # Reusable UI primitives
│   │   ├── Button.tsx               # Button with variants (primary, secondary, ghost)
│   │   ├── Card.tsx                 # Card container with hover effects
│   │   ├── IconButton.tsx           # Circular icon button
│   │   ├── TextArea.tsx             # Multi-line text input
│   │   ├── Divider.tsx              # Horizontal/vertical divider
│   │   ├── Surface.tsx              # Container with background
│   │   └── index.ts                 # Barrel export
│   │
│   ├── 📁 chat/                     # Conversational UI components
│   │   ├── Sidebar.tsx              # Fixed navigation sidebar
│   │   ├── SidebarItem.tsx          # Individual sidebar nav item
│   │   ├── ResponsiveSidebar.tsx    # Mobile-adaptive sidebar wrapper
│   │   ├── ConversationLayout.tsx   # Main content layout container
│   │   ├── ConversationHero.tsx     # Welcome message & logo
│   │   ├── PromptInput.tsx          # Main input with controls
│   │   ├── PromptSuggestion.tsx     # Single suggestion card
│   │   ├── PromptSuggestions.tsx    # List of suggestions
│   │   ├── ModelSelector.tsx        # AI model dropdown
│   │   └── index.ts                 # Barrel export
│   │
│   └── 📁 icons/                    # Custom SVG icons
│       ├── LogoMark.tsx             # App logo icon component
│       └── index.ts                 # Barrel export
│
├── 📁 lib/                          # Utilities and helpers
│   ├── tokens.ts                    # Design token parser & utilities
│   └── svg-icon-loader.ts           # Icon system helper
│
├── 📁 hooks/                        # Custom React hooks
│   ├── useMediaQuery.ts             # Responsive breakpoint detection
│   └── index.ts                     # Barrel export
│
├── 📁 tokens/                       # Design system source
│   └── tokens.json                  # Complete design tokens (colors, spacing, etc.)
│
├── 📁 public/                       # Static assets
│   ├── 📁 svg/                      # SVG source files
│   │   └── README.md                # Icon system guide
│   ├── next.svg                     # Next.js logo
│   ├── vercel.svg                   # Vercel logo
│   ├── globe.svg                    # Globe icon
│   ├── file.svg                     # File icon
│   └── window.svg                   # Window icon
│
├── 📁 styles/                       # Additional styles (empty, reserved)
│
├── 📄 README.md                     # Project overview
├── 📄 QUICKSTART.md                 # 5-minute getting started guide
├── 📄 IMPLEMENTATION_GUIDE.md       # Complete technical documentation
├── 📄 PROJECT_STRUCTURE.md          # This file
│
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 next.config.ts                # Next.js configuration
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 eslint.config.mjs             # ESLint configuration
└── 📄 .gitignore                    # Git ignore rules
```

---

## Key Directories Explained

### `/app` - Next.js Pages

**Purpose:** All routes and pages using Next.js 14 App Router

**Key Files:**
- `page.tsx` - Main conversational UI landing page
- `layout.tsx` - Root layout wrapper (fonts, metadata)
- `globals.css` - Global styles with CSS variables from tokens
- `showcase/page.tsx` - Component library demo page

**To add a new page:**
```bash
# Create new route
mkdir app/settings
touch app/settings/page.tsx
# Visit: http://localhost:3000/settings
```

---

### `/components/ui` - UI Primitives

**Purpose:** Reusable, composable UI building blocks

**Components:**
- `Button` - Primary, secondary, ghost variants
- `Card` - Container with optional hover effects
- `IconButton` - Icon-only circular button
- `TextArea` - Multi-line text input with validation
- `Surface` - Background container with borders
- `Divider` - Visual separation element

**Usage:**
```tsx
import { Button, Card } from '@/components/ui';
```

---

### `/components/chat` - Domain Components

**Purpose:** Conversational interface specific components

**Layout Components:**
- `Sidebar` - Fixed left navigation
- `ResponsiveSidebar` - Mobile-adaptive wrapper
- `ConversationLayout` - Main content container
- `ConversationHero` - Welcome section

**Input Components:**
- `PromptInput` - Main textarea with controls
- `ModelSelector` - AI model dropdown

**Suggestion Components:**
- `PromptSuggestions` - List container
- `PromptSuggestion` - Individual card

**Usage:**
```tsx
import { Sidebar, PromptInput } from '@/components/chat';
```

---

### `/components/icons` - Custom Icons

**Purpose:** Custom SVG icon components

**Current Icons:**
- `LogoMark` - App branding logo

**To add new icon:**
1. Create `MyIcon.tsx` in this folder
2. Export from `index.ts`
3. Use: `import { MyIcon } from '@/components/icons'`

---

### `/lib` - Utilities

**Purpose:** Helper functions and utilities

**Files:**
- `tokens.ts` - Design token parser
  - Converts JSON tokens to CSS variables
  - Provides TypeScript access to tokens
  - Generates Tailwind theme

- `svg-icon-loader.ts` - Icon system utilities
  - Type definitions for icon props
  - Loading patterns documentation

---

### `/hooks` - React Hooks

**Purpose:** Reusable React custom hooks

**Available Hooks:**
- `useMediaQuery(query)` - Generic media query hook
- `useIsMobile()` - Mobile detection (< 768px)
- `useIsTablet()` - Tablet detection (768-1024px)
- `useIsDesktop()` - Desktop detection (> 1024px)

**Usage:**
```tsx
import { useIsMobile } from '@/hooks';

const isMobile = useIsMobile();
```

---

### `/tokens` - Design System

**Purpose:** Single source of truth for all design values

**Files:**
- `tokens.json` - Complete design token specification
  - Colors (background, text, accent, etc.)
  - Typography (font sizes, weights, families)
  - Spacing scale
  - Border radius values
  - Box shadows
  - Animation durations
  - Z-index layers

**Token Flow:**
```
tokens.json → lib/tokens.ts → app/globals.css → Components
```

---

### `/public` - Static Assets

**Purpose:** Static files served directly by Next.js

**Folders:**
- `/svg` - SVG source files
  - Place raw SVG files here
  - Convert to React components in `/components/icons`

**Default Assets:**
- `next.svg`, `vercel.svg` - Framework logos
- `globe.svg`, `file.svg`, `window.svg` - UI icons

---

## File Naming Conventions

### Components
- **PascalCase**: `Button.tsx`, `PromptInput.tsx`
- **One component per file** (with exceptions for tightly coupled helpers)
- **Barrel exports**: `index.ts` files for clean imports

### Utilities
- **camelCase**: `tokens.ts`, `svg-icon-loader.ts`
- **Descriptive names**: Focus on purpose not implementation

### Hooks
- **Prefix with `use`**: `useMediaQuery.ts`
- **camelCase**: `useIsMobile.ts`

### Assets
- **kebab-case**: `logo-mark.svg`
- **Descriptive**: Name reflects content/purpose

---

## Import Paths

Using TypeScript path aliases:

```tsx
// Components
import { Button } from '@/components/ui';
import { Sidebar } from '@/components/chat';
import { LogoMark } from '@/components/icons';

// Utilities
import { tokens } from '@/lib/tokens';

// Hooks
import { useIsMobile } from '@/hooks';
```

**Alias Configuration:**
- `@/` = project root
- Defined in `tsconfig.json`

---

## Adding New Files

### New UI Component

```bash
# Create file
touch components/ui/NewComponent.tsx

# Add export to barrel
# Edit components/ui/index.ts
export { NewComponent } from './NewComponent';
```

### New Page

```bash
# Create route folder
mkdir app/new-page

# Create page component
touch app/new-page/page.tsx

# Visit: http://localhost:3000/new-page
```

### New Hook

```bash
# Create hook file
touch hooks/useNewHook.ts

# Export from barrel
# Edit hooks/index.ts
export { useNewHook } from './useNewHook';
```

---

## Build Output

**Development:**
- `.next/` - Next.js build cache (gitignored)

**Production:**
- `.next/` - Optimized production build

**Clean builds:**
```bash
rm -rf .next
npm run dev
```

---

## Configuration Files

### `package.json`
- Dependencies: React, Next.js, Tailwind, Framer Motion, Lucide
- Scripts: `dev`, `build`, `start`, `lint`

### `tsconfig.json`
- TypeScript compiler settings
- Path aliases (`@/`)

### `next.config.ts`
- Next.js framework configuration
- TypeScript based config

### `postcss.config.mjs`
- Tailwind CSS processing
- ESM module format

### `eslint.config.mjs`
- Code linting rules
- Next.js recommended config

---

## Generated Files (Do Not Edit)

- `.next/` - Build output
- `node_modules/` - Installed packages
- `next-env.d.ts` - Next.js TypeScript types
- `package-lock.json` - Dependency lock file

---

## Documentation Files

- `README.md` - Project overview
- `QUICKSTART.md` - Getting started (5 min)
- `IMPLEMENTATION_GUIDE.md` - Complete tech docs
- `PROJECT_STRUCTURE.md` - This file

**Read in order:**
1. README.md (overview)
2. QUICKSTART.md (get running)
3. IMPLEMENTATION_GUIDE.md (build features)
4. PROJECT_STRUCTURE.md (understand organization)

---

## Total Statistics

- **Pages:** 2 (home, showcase)
- **UI Components:** 6 (Button, Card, IconButton, TextArea, Surface, Divider)
- **Chat Components:** 8 (Sidebar, Layout, Hero, Input, Suggestions, etc.)
- **Custom Icons:** 1 (LogoMark)
- **Hooks:** 4 (media query variants)
- **Design Tokens:** 100+ values in JSON
- **Total Components:** 15+

---

Built with a focus on:
- ✅ Maintainability
- ✅ Scalability  
- ✅ Type safety
- ✅ Accessibility
- ✅ Performance
- ✅ Developer experience
