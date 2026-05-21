# Prompt Input - Figma Design Implementation

## Changes Made

Updated the `PromptInput` component to match the exact Figma specifications.

---

## Figma Specifications Applied

### Layout
```css
display: flex;
width: 800px;
height: 120px;
flex-direction: column;
align-items: flex-start;
```

### Style
```css
border-radius: 12px;
border: 1px solid var(--Other-border, #D5CFBD);
background: var(--Other-bg-soft, #F7F3EA);
box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.05);
```

---

## Implementation Details

### 1. Container Structure
**Changed from:**
```tsx
<div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-border-light">
```

**Changed to:**
```tsx
<div
  className="flex flex-col items-start overflow-hidden"
  style={{
    width: '100%',
    minHeight: '120px',
    borderRadius: '12px',
    border: '1px solid #D5CFBD',
    background: '#F7F3EA',
    boxShadow: '0 8px 14px 0 rgba(0, 0, 0, 0.05)'
  }}
>
```

### 2. Updated Token
**File:** `app/globals.css`

**Changed:**
```css
--background-soft: #F5F2E8;
```

**To:**
```css
--background-soft: #F7F3EA;
```

This matches the Figma `--Other-bg-soft` color specification.

---

## Specific Changes

### Border Radius
- **Before:** `rounded-xl` (16px)
- **After:** `12px` (exact Figma spec)

### Background Color
- **Before:** `#F5F2E8` (slightly different tone)
- **After:** `#F7F3EA` (exact Figma spec - lighter, warmer tone)

### Border
- **Before:** `border border-border` (using CSS variable)
- **After:** `1px solid #D5CFBD` (exact Figma spec)
- Color remains the same (`#D5CFBD`)

### Shadow
- **Before:** `shadow-sm` (Tailwind default: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`)
- **After:** `0 8px 14px 0 rgba(0, 0, 0, 0.05)` (more prominent Figma shadow)

### Height
- **Before:** Auto-height based on content
- **After:** `minHeight: 120px` (Figma spec)

### Display
- **Before:** Block with overflow hidden
- **After:** `flex flex-col items-start` (exact Figma layout)

### Width
- **Width:** `100%` (fills the 800px content shell)
- This automatically becomes 800px within the content container

---

## Visual Changes

### Shadow Depth
The new shadow is **more prominent**:
- **Old:** Subtle 1px offset, barely visible
- **New:** 8px vertical offset, more noticeable depth
- Creates a floating effect that matches modern design patterns

### Background Tone
The new background is **lighter and warmer**:
- **Old:** `#F5F2E8` (cooler, grayer beige)
- **New:** `#F7F3EA` (warmer, lighter beige)
- Better contrast with the main background (`#FBFAF4`)

### Border Radius
Slightly **less rounded**:
- **Old:** 16px (more rounded)
- **New:** 12px (more subtle, professional)

---

## CSS Comparison

### Before
```css
.input-container {
  background: #F5F2E8;
  border: 1px solid #D5CFBD;
  border-radius: 16px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  /* Height: auto */
}
```

### After (Figma Spec)
```css
.input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  width: 100%; /* 800px in content shell */
  min-height: 120px;
  
  background: #F7F3EA;
  border: 1px solid #D5CFBD;
  border-radius: 12px;
  box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.05);
}
```

---

## Layout Structure

```
<motion.div w-full>
  └─ <div flex flex-col items-start> [Figma container]
      │ width: 100% (800px in shell)
      │ minHeight: 120px
      │ borderRadius: 12px
      │ background: #F7F3EA
      │ boxShadow: 0 8px 14px 0 rgba(0, 0, 0, 0.05)
      │
      ├─ <div relative flex-1 w-full> [Text area container]
      │   └─ <textarea> [Input field]
      │       │ minHeight: 72px
      │       │ maxHeight: 200px
      │       └─ [Send & Mic icons - absolute positioned]
      │
      └─ <div border-t> [Bottom controls]
          ├─ [Add attachment button]
          └─ [Model selector]
```

---

## Why Inline Styles?

Used inline `style` prop instead of Tailwind classes for:

1. **Exact Pixel Values**
   - `minHeight: 120px` - No Tailwind equivalent
   - `borderRadius: 12px` - More precise than `rounded-xl`

2. **Custom Shadow**
   - `0 8px 14px 0 rgba(0, 0, 0, 0.05)` - Specific Figma shadow
   - Tailwind shadows don't match this exactly

3. **Figma Fidelity**
   - Ensures pixel-perfect match to design
   - Avoids approximations from Tailwind utilities

---

## Files Modified

1. **`components/chat/PromptInput.tsx`**
   - Updated container div with Figma specifications
   - Changed to flex layout with `flex-col items-start`
   - Applied exact border-radius, shadow, and background
   - Added `minHeight: 120px`

2. **`app/globals.css`**
   - Updated `--background-soft` token
   - Changed from `#F5F2E8` to `#F7F3EA`

---

## Testing Checklist

✅ **Visual Match**
- Container has 12px border radius
- Background color is `#F7F3EA` (warmer beige)
- Shadow is more prominent (8px offset)
- Minimum height is 120px

✅ **Layout**
- Width fills 800px content shell
- Flex column layout with items aligned to start
- Text area has proper spacing

✅ **Functionality**
- Input still auto-resizes with content
- Send and voice buttons work
- Attachment and model selector functional
- Keyboard shortcuts work (Enter, Shift+Enter)

---

## Result

The prompt input now **exactly matches the Figma design** with:
- ✅ Correct 12px border radius
- ✅ Exact `#F7F3EA` background color
- ✅ Prominent shadow (0 8px 14px)
- ✅ 120px minimum height
- ✅ Proper flex column layout
- ✅ Full 800px width in content shell

**View at http://localhost:3000** to see the updated design! 🎨
