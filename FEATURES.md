# Feature Documentation

## Message Grouping & Spacing

### Overview
User messages and assistant responses are visually grouped together with tighter spacing, separated by breaker lines only after complete responses.

### Spacing Logic

**User → Assistant Pair (Cohesive Unit):**
- User message: `pt-6 pb-3` (reduced bottom padding)
- Assistant response: `pt-3 pb-6` (reduced top padding)
- Total gap: 24px (0.75rem) between question and answer

**After Assistant Response:**
- Breaker line appears
- Full `py-6` padding resumes for next user message
- Creates clear separation between Q&A pairs

### Visual Hierarchy

```
[User Question]          ← pt-6
  ↓ (12px gap)
[Assistant Response]     ← pt-3
[Adaptive Cards]
[Toolbar + Timestamp]    ← pb-6
━━━━━━━━━━━━━━━━━━━     ← breaker line
[User Question]          ← pt-6 (normal spacing)
  ↓ (12px gap)
[Assistant Response]
```

**Benefits:**
- User questions and answers feel connected
- Clear visual grouping of conversation pairs
- Breaker lines separate complete exchanges
- Reduced visual noise

---

## Smooth State Transitions

### Overview
The UI smoothly transitions between landing and conversation states using simple fade animations.

### Behavior

**Landing → Conversation:**
- Entire view fades out (0.5s)
- Conversation view fades in (0.5s)
- No complex layout animations or flying elements

**Conversation → Landing:**
- Conversation fades out (0.5s)
- Landing page dissolves in (0.5s)
- Clean, minimal transition

### Implementation

Uses Framer Motion's `AnimatePresence` with `mode="wait"`:
- Each state has a unique key (`landing` / `conversation`)
- Simple opacity transitions (0 → 1 → 0)
- No y-axis movement or complex choreography
- Consistent 0.5s duration with custom easing

---

## Auto-Scroll Conversation View

### Overview
The conversation view automatically scrolls smoothly to the bottom when new content is added, ensuring users always see the latest message as it appears.

### Implementation

**Hook: `useAutoScroll`**
- Located: `hooks/useAutoScroll.ts`
- Purpose: Provides ref-based auto-scroll functionality
- Behavior: Smooth scroll animation when dependencies change

**Usage:**
```tsx
const scrollRef = useAutoScroll({
  enabled: true,
  behavior: 'smooth',
  dependencies: [messages],
});

<div ref={scrollRef} className="overflow-y-auto scroll-smooth">
  {/* content */}
</div>
```

### Features

1. **Smooth Animation**
   - Uses native `scroll-behavior: smooth`
   - Controlled timing with `requestAnimationFrame`
   - 100ms delay ensures DOM has fully rendered

2. **Custom Scrollbar**
   - Thin, minimal scrollbar (8px width)
   - Colors match design system (`--border`)
   - Hover state for better visibility
   - Works on both Webkit and Firefox

3. **Performance**
   - Only triggers when in conversation state
   - Dependencies prevent unnecessary re-renders
   - Uses native browser scroll APIs

### CSS Classes

- `.scroll-smooth` - Enables smooth scrolling behavior
- `.conversation-scroll` - Custom scrollbar styling

### Behavior

1. User sends a message → Message added to state
2. Dependencies change trigger useEffect
3. requestAnimationFrame ensures DOM update
4. Smooth scroll to bottom over ~500ms
5. User sees new content appearing from bottom

### Future Enhancements

- [ ] Option to pause auto-scroll when user scrolls up
- [ ] "New messages" indicator when scrolled up
- [ ] Scroll-to-top button for long conversations
- [ ] Preserve scroll position on page reload
- [ ] Smart scroll (only auto-scroll for user's own messages)

---

## Text-Only Responses & Mixed Conversations

### Overview
The system handles both text-only narrative responses (stories, explanations) AND small data returns with adaptive cards in the same conversation.

### Response Types

**1. Text-Only Responses**
- Triggered by narrative requests: "tell me a story", "explain", "describe"
- No adaptive cards shown
- Just text content with toolbar

**2. Small Data Returns**
- Triggered by data requests: "show appointments", "list medications"
- Displays adaptive card skeletons
- Text intro + cards + toolbar

**3. Story Continuations**
- User says "tell me more", "continue", "go on"
- Adds more narrative content
- Maintains story context

### Story Library

Six unique story openings covering diverse themes:
- The clockmaker's secret doors
- The mysterious library
- Whale songs with messages
- The truth-telling garden
- The subway to nowhere
- The memory café

Each story has a specific continuation, plus generic continuations for extended narratives.

### Keywords Detection

**Text-Only Triggers:**
- "tell me", "story", "explain", "describe"
- "what is", "how does", "why"

**Continuation Triggers:**
- "tell me more", "continue", "go on", "more"
- "what happens", "and then", "keep going"

**Small Data Triggers:**
- Detected by `adaptiveCardSelector.ts` keywords
- "appointments", "list", "show", "schedule", etc.

### Example Conversations

**Story Conversation:**
```
User: "Tell me a story"
Assistant: [Story opening text]

User: "Tell me more"
Assistant: [Story continuation]

User: "Show my appointments"
Assistant: [Text + adaptive cards]
```

**Mixed Conversation:**
```
User: "List my medications"
Assistant: [Text + adaptive cards]

User: "Tell me a story"
Assistant: [Story text only]

User: "Continue"
Assistant: [More story text]
```

### Implementation

**File:** `lib/storyGenerator.ts`
- Story library with openings and continuations
- Random selection avoiding duplicates
- State management for current story

**File:** `lib/mockResponses.ts`
- Detects request type (text vs. data)
- Routes to appropriate response generator
- Returns with or without adaptive cards

---

## Message Toolbar

### Overview
Each assistant message includes an action toolbar with controls. Timing can be inferred from the user message timestamp above.

### Layout

**Left-Aligned Row:**
- Five action buttons with 4px gaps between each

**Structure:**
```
[Copy] [Edit] [Repeat] [👍] [👎]
└─────── action buttons ─────────┘
```

### Features

**Action Buttons:**
- **Copy** - Copy message content
- **Edit** - Edit the message
- **Repeat** - Regenerate response
- **Thumbs Up** - Positive feedback
- **Thumbs Down** - Negative feedback

**No Timestamp:**
- Response timing inferred from user message timestamp
- Reduces visual clutter
- User message timestamp is the reference point for the conversation pair

### Styling

- Icons use `primary-main` color (currentColor inheritance)
- 16px icon size for compact appearance
- Hover state with background color (`hover` token)
- Smooth transitions (200ms)
- Toolbar sits below cards with 12px spacing

### Implementation

**Component:** `MessageToolbar.tsx`
- Self-contained toolbar with all actions
- Takes timestamp and callback props
- Handles relative time updates automatically

**Icons:** `CopyIcon`, `EditIcon`, `RepeatIcon`, `ThumbsUpIcon`, `ThumbsDownIcon`
- SVG components in `/components/icons`
- Use `currentColor` for flexible theming

---

## Adaptive Card System

See [ADAPTIVE_CARDS.md](./ADAPTIVE_CARDS.md) for full documentation.

### Quick Summary

Randomized skeleton card layouts for small data returns:
- 10 card types (list, grid, calendar, profile, etc.)
- Smart query detection
- Context-aware layout selection
- Staggered entrance animations
