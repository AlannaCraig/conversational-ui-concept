/**
 * Mock Response System
 *
 * Returns mock responses with variations for follow-up requests.
 * Ensures no consecutive duplicate responses.
 * Includes adaptive card layouts for small data returns.
 * Supports text-only responses for narrative requests.
 */

import { MockResponse } from '@/types/conversation';
import {
  getMultipleRandomLayouts,
  getRecommendedCardCount,
} from './adaptiveCardSelector';
import { getStoryOpening, getStoryContinuation } from './storyGenerator';
import { getStartingNode, getGameNode } from './gameData';

const responseVariations = [
  "Behold, your results have arrived.",
  "I've gathered everything neatly for you.",
  "Here is what I found, freshly assembled.",
  "Your requested items have been carefully retrieved.",
  "I've wandered the data paths and returned with answers.",
  "The search is complete. Here are your results.",
  "I've compiled your findings with great care.",
  "Your information has been elegantly arranged.",
  "All set. Here is what you asked for.",
  "I've returned with your requested insights.",
  "The results have surfaced from the depths.",
  "I've assembled everything into clarity.",
  "Your query has been resolved gracefully.",
  "Here is the information you summoned.",
  "I've fetched the details without incident.",
  "Your results are now before you.",
  "Everything has been brought together for you.",
  "I've completed the retrieval of your request.",
  "The answer has been prepared and delivered.",
  "Your requested data is now in view.",
  "I've gathered the pieces into a coherent whole.",
  "Here is the outcome of your request.",
  "I've returned with structured findings.",
  "Your results have been carefully curated.",
  "The information is now ready for your review.",
  "I've completed the search successfully.",
  "Here is the outcome, assembled just for you.",
  "Your request has been fulfilled in full.",
  "I've brought everything back in order.",
  "The data has aligned. Here are your results.",
];

let lastResponseIndex = -1;

/**
 * Get a random response intro without duplicates
 */
function getRandomResponseIntro(): string {
  let randomIndex;

  do {
    randomIndex = Math.floor(Math.random() * responseVariations.length);
  } while (randomIndex === lastResponseIndex && responseVariations.length > 1);

  lastResponseIndex = randomIndex;
  return responseVariations[randomIndex];
}

/**
 * Determine if the message is requesting to play a game
 */
function isGameRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const gameKeywords = [
    'play a game',
    'play game',
    "let's play",
    'start a game',
    'start game',
    'game time',
  ];

  return gameKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is requesting a text-only response (story, explanation, etc.)
 */
function isTextOnlyRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Story-specific keywords (must NOT contain data-related words)
  const storyKeywords = ['story', 'tale', 'narrative'];
  const hasStoryKeyword = storyKeywords.some(keyword => lowerMessage.includes(keyword));

  if (hasStoryKeyword) return true;

  // Generic text requests (but exclude if they mention data/show/list)
  const dataExclusions = ['show', 'list', 'data', 'display', 'view', 'get', 'find'];
  const hasDataExclusion = dataExclusions.some(keyword => lowerMessage.includes(keyword));

  if (hasDataExclusion) return false;

  // Safe text-only keywords (won't conflict with data requests)
  const textOnlyKeywords = [
    'explain',
    'describe',
    'what is',
    'how does',
    'why',
  ];

  return textOnlyKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is a story continuation request
 */
function isStoryContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Story continuation phrases (explicit)
  const storyContinuationPhrases = [
    'tell me more',
    'continue the story',
    'keep going',
    'what happens next',
    'what happens',
    'and then',
    'go on',
    'what next',
    'then what',
  ];

  // Check for explicit story continuation
  if (storyContinuationPhrases.some(phrase => lowerMessage.includes(phrase))) {
    // But NOT if it mentions data/show/list
    const dataKeywords = ['data', 'show', 'list', 'display'];
    return !dataKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Simple "more" or "continue" only counts if NO data keywords present
  if (lowerMessage === 'more' || lowerMessage === 'continue') {
    return true;
  }

  return false;
}

/**
 * Determine if the message is a data continuation request
 */
function isDataContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  // Must contain either "more" or "another" AND data-related keywords
  const hasMore = lowerMessage.includes('more') || lowerMessage.includes('another');
  const hasDataKeyword = lowerMessage.includes('data') ||
                         lowerMessage.includes('small data') ||
                         lowerMessage.includes('show') ||
                         lowerMessage.includes('list') ||
                         lowerMessage.includes('results');

  return hasMore && hasDataKeyword;
}

/**
 * Determine if the message is a large data request
 */
function isLargeDataRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const largeDataKeywords = [
    'large data',
    'big data',
    'full view',
    'detailed view',
    'expanded view',
  ];

  return largeDataKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is a large data continuation request
 */
function isLargeDataContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const largeDataContinuationPhrases = [
    'more large data',
    'more big data',
    'show me more large',
    'another large',
    'different large data',
  ];

  return largeDataContinuationPhrases.some(phrase => lowerMessage.includes(phrase));
}

export function getMockResponse(userMessage: string, gameNodeId?: string): MockResponse {
  // Priority 0: Check if this is a game request or game option selection
  if (isGameRequest(userMessage)) {
    const startNode = getStartingNode();
    return {
      content: startNode.text,
      delay: 1000,
      gameOptions: startNode.options,
      gameNodeId: startNode.id,
    };
  }

  // If we have a game node ID, user is selecting a game option
  if (gameNodeId) {
    // The userMessage should contain the option text they selected
    // We'll handle this in the main app logic
    return {
      content: '',
      delay: 0,
    };
  }

  // Priority 1: Check for large data continuation
  if (isLargeDataContinuationRequest(userMessage)) {
    return {
      content: getRandomResponseIntro(),
      delay: 1200,
      largeData: true,
    };
  }

  // Priority 2: Check for large data request
  if (isLargeDataRequest(userMessage)) {
    return {
      content: getRandomResponseIntro(),
      delay: 1500,
      largeData: true,
    };
  }

  // Priority 2: Check for story continuation ("tell me more")
  if (isStoryContinuationRequest(userMessage)) {
    return {
      content: getStoryContinuation(),
      delay: 1200,
      // No adaptive cards for story continuation
    };
  }

  // Priority 2: Check for data continuation ("show me more data")
  if (isDataContinuationRequest(userMessage)) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * responseVariations.length);
    } while (newIndex === lastResponseIndex && responseVariations.length > 1);

    lastResponseIndex = newIndex;
    const content = responseVariations[newIndex];

    // Generate more adaptive cards
    const cardCount = getRecommendedCardCount(userMessage);
    const adaptiveCards = getMultipleRandomLayouts(userMessage, cardCount);

    return {
      content,
      delay: 1000,
      adaptiveCards,
    };
  }

  // Priority 3: Check if this is a new story request
  if (isTextOnlyRequest(userMessage)) {
    return {
      content: getStoryOpening(),
      delay: 1200,
      // No adaptive cards for text-only responses
    };
  }

  // Default: Small data request - return with adaptive cards
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * responseVariations.length);
  } while (newIndex === lastResponseIndex && responseVariations.length > 1);

  lastResponseIndex = newIndex;
  const content = responseVariations[newIndex];

  // Generate adaptive cards based on the query
  const cardCount = getRecommendedCardCount(userMessage);
  const adaptiveCards = getMultipleRandomLayouts(userMessage, cardCount);

  return {
    content,
    delay: 1000,
    adaptiveCards,
  };
}
