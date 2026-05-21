# Prompt Guide

Quick reference for triggering different response types in the conversational UI.

## Story Mode (Text-Only)

### Start a Story
```
"Tell me a story"
"Tell me a tale"
"Share a narrative"
```
**Returns:** Text-only story opening, no adaptive cards

### Continue Story
```
"Tell me more"
"Continue the story"
"What happens next"
"Keep going"
"Go on"
"And then?"
```
**Returns:** Story continuation text, no adaptive cards

**Note:** These phrases MUST NOT include data keywords like "show", "list", "data"

---

## Data Mode (With Adaptive Cards)

### Request Data
```
"Show my appointments"
"List my medications"
"Display schedule"
"View calendar"
"Get patient records"
```
**Returns:** Text response + adaptive card skeletons

### Request More Data
```
"Show me more data"
"Show more"
"List more"
"More results"
"Give me more"
```
**Returns:** Text response + more adaptive card skeletons

---

## Mixed Conversations

You can switch between modes freely:

```
User: "Tell me a story"
→ Story text only

User: "Tell me more"
→ More story text

User: "Show my appointments"
→ Text + adaptive cards

User: "Show me more data"
→ Text + more cards

User: "Continue the story"
→ More story text
```

---

## Detection Rules

### Story Continuation Wins When:
- Contains "tell me more" WITHOUT "data/show/list"
- Contains "continue the story"
- Contains "what happens next"
- Simple "more" or "continue" with no data keywords

### Data Continuation Wins When:
- Contains "show me more" or "show more"
- Contains "more data" or "list more"
- Contains data-related continuation phrases

### New Story Starts When:
- Contains "story", "tale", "narrative"
- Contains explanation keywords WITHOUT data keywords

### Default (Data Request):
- Any phrase with "show", "list", "display", "view"
- Specific data keywords (appointments, medications, etc.)

---

## Testing Examples

**✅ Story:**
- "Tell me a story" → Story starts
- "Tell me more" → Story continues
- "What happens?" → Story continues

**✅ Data:**
- "Show appointments" → Cards appear
- "Show me more data" → More cards appear
- "List more" → More cards appear

**❌ Ambiguous (Won't work as expected):**
- "Tell me more appointments" → Will show data (has "appointments")
- "Show more story" → Will show data (has "show")

**🔄 Context Switch:**
- Story mode → "Show data" → Data mode
- Data mode → "Tell me more" → Story mode (if no data keywords)
