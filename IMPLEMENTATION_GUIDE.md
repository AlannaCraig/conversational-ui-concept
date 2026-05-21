# Implementation Guide

## Overview

This conversational UI landing page is built as a production-ready design system starter with:

- **JSON-driven design tokens** for consistent theming
- **Reusable component library** following enterprise patterns
- **Responsive layout** adapting to mobile, tablet, and desktop
- **Minimal aesthetic** suitable for B2B SaaS and productivity tools

---

## Architecture

### Design Token System

All visual design values are defined in `/tokens/tokens.json`:

```
tokens.json → lib/tokens.ts → globals.css → Tailwind theme → Components
```

**Benefits:**
- Single source of truth
- Easy theme switching
- Consistent spacing/colors
- Type-safe access in TS

**To modify:**
1. Edit `/tokens/tokens.json`
2. Changes automatically propagate everywhere

### Component Structure

```
/components
  /ui          → Reusable primitives (Button, Card, TextArea, etc.)
  /chat        → Domain-specific components (Sidebar, PromptInput, etc.)
  /icons       → Custom SVG icon components
```

**Design Principles:**
- Token-based styling only
- Composable and flexible
- TypeScript for type safety
- Accessible by default
- Subtle animations via Framer Motion

### Icon System

**Custom Icons:**
1. Create component in `/components/icons/MyIcon.tsx`
2. Use `IconProps` interface
3. Export from `/components/icons/index.ts`

**Lucide Icons:**
- Pre-installed for common UI icons
- Import directly: `import { Home } from 'lucide-react'`

---

## Component API Reference

### Button

```tsx
<Button variant="primary | secondary | ghost" size="sm | md | lg">
  Click me
</Button>
```

### Card

```tsx
<Card hover={boolean}>Content</Card>
```

### IconButton

```tsx
<IconButton icon={LucideIcon} label="Accessible name" size="sm | md | lg" />
```

### PromptInput

```tsx
<PromptInput
  onSubmit={(message) => console.log(message)}
  placeholder="Ask me anything..."
/>
```

**Features:**
- Auto-resizing textarea
- Enter to submit, Shift+Enter for new line
- Attachment button
- Voice input button
- Model selector dropdown

### PromptSuggestions

```tsx
<PromptSuggestions
  suggestions={[
    { id: '1', text: 'Suggestion text' }
  ]}
  onSelectSuggestion={(text) => handleClick(text)}
/>
```

### Sidebar

```tsx
<Sidebar />
```

**Features:**
- Fixed position on desktop
- Icon-based navigation with tooltips
- Logo at top
- User avatar at bottom
- Active state styling

### ResponsiveSidebar

```tsx
<ResponsiveSidebar />
```

Automatically switches between:
- Fixed sidebar (desktop)
- Collapsible drawer with hamburger menu (mobile/tablet)

---

## Customization

### Changing Colors

Edit `/tokens/tokens.json`:

```json
{
  "colors": {
    "background": "#FBFAF4",
    "accent": {
      "main": "#B67A3C"
    }
  }
}
```

### Adding Navigation Items

Edit `/components/chat/Sidebar.tsx`:

```tsx
<SidebarItem icon={NewIcon} label="New Section" />
```

### Changing Prompt Suggestions

Edit `/app/page.tsx`:

```tsx
const DEFAULT_SUGGESTIONS = [
  { id: '1', text: 'Your custom prompt' }
];
```

### Modifying Layout Spacing

Edit `/components/chat/ConversationLayout.tsx`:

```tsx
<div className="w-full max-w-2xl"> // Change max-width here
```

---

## Responsive Breakpoints

Using Tailwind CSS defaults:

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

Custom hooks available:

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks';

const isMobile = useIsMobile();
```

---

## Extending the System

### Adding New UI Component

1. Create file in `/components/ui/MyComponent.tsx`:

```tsx
import { tokens } from '@/lib/tokens';

export function MyComponent() {
  return (
    <div className="bg-background border border-border">
      Component content
    </div>
  );
}
```

2. Export from `/components/ui/index.ts`:

```tsx
export { MyComponent } from './MyComponent';
```

3. Use anywhere:

```tsx
import { MyComponent } from '@/components/ui';
```

### Adding New Chat Feature

Follow the same pattern in `/components/chat/`.

### Adding Custom Animations

Use Framer Motion:

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

---

## Integration Points

### AI Backend Integration

Update `handleSubmit` in `/app/page.tsx`:

```tsx
const handleSubmit = async (msg: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: msg })
  });
  
  const data = await response.json();
  // Handle response
};
```

### Authentication

Add auth provider in `/app/layout.tsx`:

```tsx
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### State Management

Consider adding:
- **Zustand** for global state (recommended for simplicity)
- **React Context** for theme/auth
- **TanStack Query** for server state

---

## Performance Optimization

### Code Splitting

Use dynamic imports for heavy components:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'));
```

### Image Optimization

Use Next.js Image component:

```tsx
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### Bundle Size

- Tree-shaking enabled by default
- Lucide icons are tree-shakeable
- Keep dependencies minimal

---

## Accessibility

All components include:

- ✅ Proper ARIA labels
- ✅ Keyboard navigation
- ✅ Focus states
- ✅ Color contrast compliance
- ✅ Screen reader support

Test with:
- Keyboard navigation (Tab, Enter, Escape)
- Screen readers (NVDA, VoiceOver)
- Lighthouse audits

---

## Deployment

### Build

```bash
npm run build
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Vercel Deployment

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Troubleshooting

### Styles not applying

1. Check if Tailwind is running: `npm run dev`
2. Verify CSS variables are defined in `globals.css`
3. Clear `.next` cache: `rm -rf .next`

### TypeScript errors

```bash
npm run type-check
```

### Build errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## Best Practices

### DO:
✅ Use design tokens for all styling
✅ Keep components small and focused
✅ Add TypeScript types to props
✅ Test keyboard navigation
✅ Use semantic HTML
✅ Follow naming conventions

### DON'T:
❌ Hardcode colors/spacing values
❌ Create overly complex components
❌ Skip accessibility attributes
❌ Ignore TypeScript errors
❌ Use inline styles
❌ Duplicate component logic

---

## Support

For issues or questions:
1. Check this guide
2. Review component source code
3. Check Next.js documentation
4. Review Tailwind CSS documentation

---

## Next Steps

1. **Add conversation history** - Store and display chat messages
2. **Implement streaming responses** - Real-time AI response rendering
3. **Add markdown support** - Rich text formatting in responses
4. **Create settings panel** - User preferences and configuration
5. **Add file upload** - Document/image attachment handling
6. **Implement dark mode** - Theme switching capability
7. **Add user authentication** - Login/logout functionality
8. **Create admin dashboard** - Usage analytics and monitoring

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Framer Motion.
