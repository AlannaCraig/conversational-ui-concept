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
 * Determine if the message is requesting a text-only response (story, explanation, etc.)
 */
function isTextOnlyRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const textOnlyKeywords = [
    'tell me',
    'story',
    'explain',
    'describe',
    'what is',
    'how does',
    'why',
    'tell me more',
    'continue',
    'go on',
    'more',
    'keep going',
    'what happens',
    'and then',
  ];

  return textOnlyKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Determine if the message is a continuation request
 */
function isContinuationRequest(message: string): boolean {
  const lowerMessage = message.toLowerCase();

  const continuationKeywords = [
    'tell me more',
    'more',
    'continue',
    'go on',
    'keep going',
    'what happens',
    'and then',
    'what next',
    'then what',
  ];

  return continuationKeywords.some(keyword => lowerMessage.includes(keyword));
}

export function getMockResponse(userMessage: string): MockResponse {
  // Check if this is a text-only request (story, explanation, etc.)
  if (isTextOnlyRequest(userMessage)) {
    let content: string;

    // If it's a continuation request, provide story continuation
    if (isContinuationRequest(userMessage)) {
      content = getStoryContinuation();
    } else {
      // Otherwise, start a new story
      content = getStoryOpening();
    }

    return {
      content,
      delay: 1200,
      // No adaptive cards for text-only responses
    };
  }

  // Small data request - return with adaptive cards
  // Get a random index that's different from the last one
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
