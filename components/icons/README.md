# Custom Icon Library

Complete local icon library replacing all Lucide React icons.

## Overview

All icons are now custom React components built from your SVG files located in `/public/svg/`. This gives you full control over the icon design and ensures consistency with your brand.

## Available Icons

### Navigation Icons (from your SVG library)
- `HomeIcon` - Home navigation
- `ChatHistoryIcon` - Chat history with clock
- `SearchIcon` - Search/magnifying glass
- `NotificationIcon` - Bell notification
- `HelpIcon` - Help/question circle
- `SettingsIcon` - Settings gear

### UI Action Icons (custom built)
- `SendIcon` - Send message arrow
- `MicIcon` - Microphone for voice input
- `PlusIcon` - Add/plus symbol
- `ArrowRightIcon` - Right arrow
- `ChevronDownIcon` - Dropdown chevron
- `GlobeIcon` - Globe/world icon
- `MenuIcon` - Hamburger menu
- `CloseIcon` - Close/X icon

### Branding
- `LogoMark` - App logo (custom wave pattern)

## Usage

```tsx
import { HomeIcon, SearchIcon, SendIcon } from '@/components/icons';

// Basic usage
<HomeIcon />

// With custom size
<HomeIcon size={32} />

// With custom color
<HomeIcon color="#B67A3C" />

// With className for styling
<HomeIcon className="text-accent-main hover:text-accent-dark" />
```

## Icon Props

All icons accept the same props from `IconProps` interface:

```typescript
interface IconProps {
  className?: string;  // CSS classes
  size?: number;       // Width and height (default: 24)
  color?: string;      // Stroke color (default: 'currentColor')
}
```

## Source Files

Original SVG files are stored in:
```
/public/svg/
├── icon-home-03.svg
├── icon-chat-history.svg
├── icon-search.svg
├── icon-notification.svg
├── icon-help-circle.svg
└── icon-setting.svg
```

## Adding New Icons

1. **Place SVG in `/public/svg/`**
   ```bash
   cp your-icon.svg public/svg/
   ```

2. **Create React component in `/components/icons/`**
   ```tsx
   // components/icons/YourIcon.tsx
   import { IconProps } from '@/lib/svg-icon-loader';

   export function YourIcon({ className = '', size = 24, color = 'currentColor' }: IconProps) {
     return (
       <svg
         width={size}
         height={size}
         viewBox="0 0 24 24"
         fill="none"
         className={className}
       >
         <path d="..." stroke={color} strokeWidth="1.5" />
       </svg>
     );
   }
   ```

3. **Export from `/components/icons/index.ts`**
   ```tsx
   export { YourIcon } from './YourIcon';
   ```

4. **Use anywhere**
   ```tsx
   import { YourIcon } from '@/components/icons';
   <YourIcon size={20} />
   ```

## Design Consistency

All icons follow these standards:
- **ViewBox**: `0 0 24 24` (24x24 grid)
- **Stroke Width**: `1.5` (consistent line weight)
- **Stroke**: Uses `currentColor` by default (inherits text color)
- **Fill**: `none` (outline style)
- **Line Caps**: `round` (smooth corners)
- **Line Joins**: `round` (smooth intersections)

## Benefits of Local Icon Library

✅ **Full Control** - Own your icon design
✅ **Brand Consistency** - Match your exact design system
✅ **No Dependencies** - Removed lucide-react dependency
✅ **Optimized** - Only icons you use are bundled
✅ **Customizable** - Easy to modify SVG paths
✅ **Type Safe** - Full TypeScript support

## Migration from Lucide

All Lucide icons have been replaced:

| Before (Lucide) | After (Custom) |
|----------------|----------------|
| `Home` | `HomeIcon` |
| `MessageSquare` | `ChatHistoryIcon` |
| `Search` | `SearchIcon` |
| `Bell` | `NotificationIcon` |
| `HelpCircle` | `HelpIcon` |
| `Settings` | `SettingsIcon` |
| `Send` | `SendIcon` |
| `Mic` | `MicIcon` |
| `Plus` | `PlusIcon` |
| `ArrowRight` | `ArrowRightIcon` |
| `ChevronDown` | `ChevronDownIcon` |
| `Globe` | `GlobeIcon` |
| `Menu` | `MenuIcon` |
| `X` | `CloseIcon` |

## Component Updates

The following components now use custom icons:
- `Sidebar.tsx` - Navigation icons
- `SidebarItem.tsx` - Icon rendering
- `PromptInput.tsx` - Send, Mic, Plus icons
- `PromptSuggestion.tsx` - Arrow icon
- `ModelSelector.tsx` - Globe, Chevron icons
- `ResponsiveSidebar.tsx` - Menu, Close icons
- `IconButton.tsx` - Generic icon button

## Files Updated

```
✅ /components/icons/ - 15 icon components created
✅ /components/chat/Sidebar.tsx
✅ /components/chat/SidebarItem.tsx
✅ /components/chat/PromptInput.tsx
✅ /components/chat/PromptSuggestion.tsx
✅ /components/chat/ModelSelector.tsx
✅ /components/chat/ResponsiveSidebar.tsx
✅ /components/ui/IconButton.tsx
```

## Icon Library Stats

- **Total Icons**: 15 (9 navigation + 6 UI)
- **From Your SVGs**: 6 icons
- **Custom Built**: 8 icons
- **Logo**: 1 branding icon
- **Total Size**: ~3KB (all icons combined)

---

**Your conversational UI now uses 100% custom icons from your local library!** 🎨
