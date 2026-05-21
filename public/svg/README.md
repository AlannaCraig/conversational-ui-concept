# SVG Icons Directory

Place your SVG icon files here.

## How to Add Icons

1. **Add SVG file**: Place your optimized SVG file in this directory
   - Example: `logo.svg`, `icon-home.svg`

2. **Create React component**: Create a new component in `/components/icons`

```tsx
// components/icons/MyIcon.tsx
import { IconProps } from '@/lib/svg-icon-loader';

export function MyIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Paste your SVG path data here */}
      <path d="..." fill="currentColor" />
    </svg>
  );
}
```

3. **Export from index**: Add to `/components/icons/index.ts`

```tsx
export { MyIcon } from './MyIcon';
```

4. **Use anywhere**: Import and use the icon

```tsx
import { MyIcon } from '@/components/icons';

<MyIcon className="text-accent-main" size={32} />
```

## Best Practices

- **Optimize SVGs**: Use SVGR or SVGO to optimize before adding
- **Use currentColor**: Makes icons inherit text color for easy theming
- **Define viewBox**: Maintains aspect ratio at any size
- **Keep it simple**: One icon = one file = one component
