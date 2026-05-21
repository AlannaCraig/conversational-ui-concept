/**
 * Story Generator
 *
 * Generates random stories and story continuations for text-only responses.
 */

const stories = [
  {
    opening: "Once upon a time, in a small village nestled between rolling hills, there lived a curious clockmaker named Elara. She spent her days crafting intricate timepieces, each one more elaborate than the last. But Elara harbored a secret: every clock she made contained a tiny door, invisible to most, that led somewhere unexpected.",
    continuation: "One autumn evening, as golden light filtered through her workshop windows, Elara discovered something remarkable. The smallest clock she'd ever made—no bigger than a walnut—had begun to tick backwards. As she leaned in to examine it, the tiny door swung open, and a voice whispered from within: 'Time moves differently in the spaces between seconds.'"
  },
  {
    opening: "The library at the end of Maple Street had been closed for thirty years, its windows dark and its doors sealed. Everyone in town had their theories about why—some said it was haunted, others claimed it held forbidden knowledge. The truth, as seventeen-year-old Maya was about to discover, was far more interesting.",
    continuation: "Maya had found an old key in her grandmother's attic, labeled simply 'M.S.' Maple Street. Standing before the library's oak doors on a misty Tuesday morning, she slipped the key into the lock. It turned with surprising ease. Inside, the air shimmered like heat rising from pavement, and every book on every shelf glowed with a soft, pulsing light."
  },
  {
    opening: "Dr. Yuki Tanaka had spent fifteen years studying whale songs, but nothing had prepared her for what the hydrophones picked up that morning. It wasn't music, exactly—more like a conversation. And it seemed to be addressing her by name.",
    continuation: "The pattern was unmistakable: her name, in morse code, repeated three times, followed by what could only be described as a question mark. Yuki checked and rechecked the equipment. No malfunction. No interference. Just the impossible fact that a pod of humpback whales, seventeen miles off the coast, was trying to get her attention."
  },
  {
    opening: "The garden appeared overnight. One day, the corner lot on Fifth and Birch was empty—just dirt and dandelions. The next morning, it bloomed with flowers no botanist could identify, arranged in patterns that seemed to shift when you weren't looking directly at them.",
    continuation: "Mrs. Chen from the corner store was the first to notice the flowers' unusual property: they only bloomed in the presence of truth. When someone walked past while telling a lie, the petals would close. When someone spoke from the heart, they opened wide. Within a week, the garden had become the most avoided spot in the neighborhood."
  },
  {
    opening: "Every Tuesday at 3:47 PM, the subway train to nowhere arrived at Platform 13. Most commuters never noticed it—the platform itself seemed to fade from awareness. But Jamie had learned to see the spaces others missed, and today, they decided to board.",
    continuation: "The train car was empty except for a single passenger: an elderly conductor in a uniform that seemed woven from twilight and mist. 'Tickets, please,' she said with a knowing smile. 'Though I suspect you're the type who travels on curiosity alone.' The doors closed with a whisper, and the lights of the familiar city began to stretch and blur."
  },
  {
    opening: "The café served coffee that tasted like memories. Not metaphorically—literally. Each cup carried the essence of a specific moment in time: a first kiss, a sunset in Barcelona, the quiet pride of finishing a marathon. The barista never told you which memory you'd get.",
    continuation: "When Marcus ordered his usual morning latte, the barista—a woman with silver hair and knowing eyes—paused. 'Interesting,' she murmured. 'Your cup wants to show you something from next week.' Marcus laughed nervously. 'That's not possible.' She slid the cup across the counter. 'Drink it anyway. Sometimes the future needs to be tasted to be believed.'"
  }
];

const continuations = [
  "The atmosphere grew heavier, charged with possibility. Details that had seemed ordinary moments before now revealed themselves as clues to something larger, something that had been waiting patiently to be discovered.",

  "Time seemed to slow, each heartbeat marking the space between the known world and whatever lay beyond. There was no going back now—only forward, into the story that had been writing itself all along.",

  "In that moment, the boundary between the everyday and the extraordinary dissolved like sugar in water. What had been impossible just moments ago now felt not only possible, but inevitable.",

  "The pieces began to fall into place, forming a picture that was at once surprising and perfectly logical. Of course this was how the world really worked. How had anyone ever thought otherwise?",

  "A choice presented itself, clear as crystal: turn back to the comfortable fiction of normal life, or step through into the truth that had been hiding in plain sight all along.",
];

let lastStoryIndex = -1;
let currentStory: typeof stories[0] | null = null;

/**
 * Get a story opening
 */
export function getStoryOpening(): string {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * stories.length);
  } while (newIndex === lastStoryIndex && stories.length > 1);

  lastStoryIndex = newIndex;
  currentStory = stories[newIndex];

  return currentStory.opening;
}

/**
 * Get a story continuation
 */
export function getStoryContinuation(): string {
  // If we have a current story with its specific continuation, use that
  if (currentStory && Math.random() > 0.3) {
    const cont = currentStory.continuation;
    currentStory = null; // Clear after using the specific continuation
    return cont;
  }

  // Otherwise use a generic continuation
  const randomIndex = Math.floor(Math.random() * continuations.length);
  return continuations[randomIndex];
}

/**
 * Reset the story state (for new conversations)
 */
export function resetStory(): void {
  currentStory = null;
  lastStoryIndex = -1;
}
