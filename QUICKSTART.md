# Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Verify Installation

```bash
cd C:\Users\liam.haire\conversational-ui
npm run dev
```

Your app should be running at:
- **Main app**: http://localhost:3000
- **Component showcase**: http://localhost:3000/showcase

### Step 2: Explore the Project

**File Structure:**
```
conversational-ui/
├── app/                    # Next.js pages
│   ├── page.tsx           # Main landing page
│   └── showcase/          # Component demo page
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── chat/              # Conversation components
│   └── icons/             # Custom SVG icons
├── tokens/
│   └── tokens.json        # Design system source of truth
├── lib/
│   └── tokens.ts          # Token utilities
└── hooks/                 # Custom React hooks
```

### Step 3: Make Your First Customization

#### Change the Color Scheme

Edit `tokens/tokens.json`:

```json
{
  "colors": {
    "accent": {
      "main": "#6B4347",  // Try changing this to "#3B82F6" for blue
      "dark": "#472B2E",
      "light": "#E7D8D8"
    }
  }
}
```

Save and watch it update automatically!

#### Update the Welcome Message

Edit `app/page.tsx`:

```tsx
<ConversationHero
  userName="Your Name"
  greeting="Welcome to Your AI Assistant!"
  subtext="Let's get started with something amazing."
/>
```

#### Add Your Own Prompt Suggestions

Edit `app/page.tsx`:

```tsx
const DEFAULT_SUGGESTIONS = [
  { id: '1', text: 'Tell me about your features' },
  { id: '2', text: 'Show me what you can do' },
  { id: '3', text: 'Help me get started' }
];
```

### Step 4: View All Components

Visit http://localhost:3000/showcase to see:
- All UI components with variants
- Design token colors
- Typography scales
- Interactive examples

### Step 5: Build for Production

```bash
npm run build
npm start
```

Your production-ready app will be running at http://localhost:3000

---

## 📚 Next Steps

### Add AI Integration

Update `app/page.tsx`:

```tsx
const handleSubmit = async (msg: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    
    const data = await response.json();
    console.log('AI Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Customize Sidebar Navigation

Edit `components/chat/Sidebar.tsx`:

```tsx
import { YourIcon } from 'lucide-react';

// Add your navigation item:
<SidebarItem icon={YourIcon} label="Your Section" />
```

### Add More Pages

Create `app/settings/page.tsx`:

```tsx
export default function Settings() {
  return (
    <div>Your settings page</div>
  );
}
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts and your app will be live!

---

## 🎨 Design System

### Using Design Tokens

**In Tailwind:**
```tsx
<div className="bg-background text-text-primary border-border">
  Styled with tokens
</div>
```

**In CSS:**
```css
.custom-class {
  background: var(--accent-main);
  color: var(--text-primary);
}
```

**In JavaScript:**
```tsx
import { tokens } from '@/lib/tokens';
const color = tokens.colors.accent.main;
```

### Component Examples

**Button:**
```tsx
<Button variant="primary" size="md">
  Click Me
</Button>
```

**Card:**
```tsx
<Card hover className="p-6">
  Card content
</Card>
```

**Prompt Input:**
```tsx
<PromptInput 
  onSubmit={(msg) => console.log(msg)}
  placeholder="Type here..."
/>
```

---

## 🛠 Common Tasks

### Add a New Icon

1. Create `components/icons/MyIcon.tsx`:

```tsx
import { IconProps } from '@/lib/svg-icon-loader';

export function MyIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="..." fill="currentColor" />
    </svg>
  );
}
```

2. Export from `components/icons/index.ts`:

```tsx
export { MyIcon } from './MyIcon';
```

3. Use anywhere:

```tsx
import { MyIcon } from '@/components/icons';
<MyIcon size={32} />
```

### Change Typography

Edit `tokens/tokens.json`:

```json
{
  "typography": {
    "fontSize": {
      "base": "1.125rem",  // Increase base font size
      "xl": "1.5rem"
    }
  }
}
```

### Adjust Spacing

Edit `tokens/tokens.json`:

```json
{
  "spacing": {
    "md": "1.5rem",  // Increase medium spacing
    "lg": "2rem"
  }
}
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Styles not updating
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear cache: `rm -rf .next`

### TypeScript errors
```bash
npm run type-check
```

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 📖 Resources

- **Full Implementation Guide**: See `IMPLEMENTATION_GUIDE.md`
- **Component Showcase**: http://localhost:3000/showcase
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion

---

## 💡 Pro Tips

1. **Use the showcase page** (`/showcase`) for component reference while building
2. **Start with tokens** - modify `tokens.json` before writing custom CSS
3. **Keep components small** - easier to maintain and reuse
4. **Test responsiveness** - resize browser or use DevTools device mode
5. **Check accessibility** - use keyboard navigation to test

---

## ✅ Checklist

- [ ] App running at localhost:3000
- [ ] Viewed component showcase
- [ ] Changed a design token
- [ ] Updated welcome message
- [ ] Customized prompt suggestions
- [ ] Explored file structure
- [ ] Read IMPLEMENTATION_GUIDE.md

---

**Ready to build something amazing!** 🎉

For questions or issues, check `IMPLEMENTATION_GUIDE.md` or the component source code.
