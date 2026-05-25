/**
 * What the Duck: The Duck Adventure Game
 *
 * Node-based text adventure game data structure
 */

export interface GameOption {
  id: string;
  text: string;
  nextNode: string;
}

export interface GameNode {
  id: string;
  text: string;
  options: GameOption[];
  isEnding?: boolean;
}

export const duckGame: Record<string, GameNode> = {
  NODE_1_INTRO: {
    id: 'NODE_1_INTRO',
    text: "You open your eyes and realise that you are Quackers McGee, a devious white duck with a huge appetite. You're floating in the middle of the misty pond in Widdershins-on-the-Wold, a strange, quirky village where everyone seems to have an agenda. Your belly rumbles, and despite the oddity of the place, your hunger is real. You quack, but nothing appears. What now?",
    options: [
      {
        id: 'opt1',
        text: 'Check the larder again and see if something has mysteriously appeared.',
        nextNode: 'NODE_1_RESPONSE'
      },
      {
        id: 'opt2',
        text: 'Scratch around in the dirt near the reeds and see if you can find some oats.',
        nextNode: 'NODE_1_RESPONSE'
      },
      {
        id: 'opt3',
        text: 'Sniff around for breadcrumbs and hope someone dropped something tasty.',
        nextNode: 'NODE_1_RESPONSE'
      }
    ]
  },

  NODE_1_RESPONSE: {
    id: 'NODE_1_RESPONSE',
    text: "No luck. Your belly rumbles and there's still nothing around.",
    options: [
      {
        id: 'opt1',
        text: 'Grab your toolkit and head towards the village square.',
        nextNode: 'NODE_2_MERRIWEATHER'
      }
    ]
  },

  NODE_2_MERRIWEATHER: {
    id: 'NODE_2_MERRIWEATHER',
    text: "As you set off along the path, you spot Mrs. Merriweather, an 89-year-old widow who frequently carries throat lozenges in her pocket. While these aren't exactly a duck's favourite, a little peck on the gooey blackcurrant centre might stave off your hunger for a while. What do you do?",
    options: [
      {
        id: 'opt1',
        text: 'Quack and look adorable, hoping she takes pity on you and gives you something tasty to eat.',
        nextNode: 'NODE_2_OPTION_1_RESPONSE'
      },
      {
        id: 'opt2',
        text: 'Set up a snare along her walking route and hope something tasty falls out when she gets flipped upside down.',
        nextNode: 'NODE_2_OPTION_2_RESPONSE'
      },
      {
        id: 'opt3',
        text: 'Try your hand at pickpocketing and see if you can lift the lozenges without her noticing.',
        nextNode: 'NODE_2_OPTION_3_RESPONSE'
      }
    ]
  },

  NODE_2_OPTION_1_RESPONSE: {
    id: 'NODE_2_OPTION_1_RESPONSE',
    text: "Mrs. Merriweather hates ducks. She aims a kick in your direction and startles you badly. You run off into the bushes to hide and wait for the coast to clear. Once she finally waddles off down the path, you cautiously continue towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_3_BAKERY'
      }
    ]
  },

  NODE_2_OPTION_2_RESPONSE: {
    id: 'NODE_2_OPTION_2_RESPONSE',
    text: "Mrs. Merriweather walks right into your trap. The snare tightens around her ankles and flips her upside down. Several throat lozenges tumble out, along with a buttery croissant hidden in an inside jacket pocket. You quickly peck at both before dismantling your trap and continuing towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_3_BAKERY'
      }
    ]
  },

  NODE_2_OPTION_3_RESPONSE: {
    id: 'NODE_2_OPTION_3_RESPONSE',
    text: "As you sneak up behind Mrs. Merriweather, which is surprisingly easy considering she has all the observational powers of a kumquat, you slip your wing gently into her coat pocket. To your delight, today she isn't carrying throat lozenges at all. She's carrying a croissant. You happily munch away before continuing towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_3_BAKERY'
      }
    ]
  },

  NODE_3_BAKERY: {
    id: 'NODE_3_BAKERY',
    text: "As you head toward the village square, a delicious aroma of freshly baked bread fills the air. It is one of the finest smells a duck could ever dream of. Up ahead on the right, the village bakery sends warm steam drifting out through an open window. What do you do?",
    options: [
      {
        id: 'opt1',
        text: 'Try to stay stealthy like a secret agent and attempt to sneak in and snatch a loaf without anyone noticing.',
        nextNode: 'NODE_3_OPTION_1_RESPONSE'
      },
      {
        id: 'opt2',
        text: 'Convince a band of squirrels to form a mariachi band and charge in through the window playing the finest Mexican music. In the commotion, you plan to try and swipe a cinnamon bun.',
        nextNode: 'NODE_3_OPTION_2_RESPONSE'
      },
      {
        id: 'opt3',
        text: 'Knock on the bakery door, put on your best duckling eyes, and see if they take pity on you.',
        nextNode: 'NODE_3_OPTION_3_RESPONSE'
      }
    ]
  },

  NODE_3_OPTION_1_RESPONSE: {
    id: 'NODE_3_OPTION_1_RESPONSE',
    text: "As you peer into the bakery window, you see not one, not two, but ten bakery staff all busy working. They are dangerously close to the bread, but you still think you can pull this off. You sidle in through the window, keeping your eyes on the prize, head spinning almost 360 degrees in paranoid secrecy. Unfortunately, you completely fail to notice a bucket sitting directly beneath you. You tumble into it with an almighty crash and have to retreat immediately, gaining absolutely no bread whatsoever. With your head hung low in shame, you continue towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_4_SEAMUS'
      }
    ]
  },

  NODE_3_OPTION_2_RESPONSE: {
    id: 'NODE_3_OPTION_2_RESPONSE',
    text: 'You convince a band of squirrels to form a mariachi band and charge in through the bakery window playing the finest Mexican music imaginable. You strike a deal beforehand that anything you steal will be split "50/50", although you already know squirrels cannot count and fully intend to give them a single crumb and call it half.\n\nThe squirrels burst into the bakery and begin playing the best mariachi music you have ever heard in your life. The bakery staff are completely transfixed by their tiny sombreros. During the chaos, you successfully swipe not one, but two cinnamon buns.\n\nAs agreed, you give the squirrels a "50/50" split, hand them a tiny crumb, and with a snigger and a smile on your face, continue towards the village square.',
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_4_SEAMUS'
      }
    ]
  },

  NODE_3_OPTION_3_RESPONSE: {
    id: 'NODE_3_OPTION_3_RESPONSE',
    text: "You gently knock on the bakery door with your beak, but the noise inside is far too loud and nobody hears you. You stand patiently for several minutes trying your absolute best duckling eyes, but eventually give up and shuffle away, scuffing your feet as you continue towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_4_SEAMUS'
      }
    ]
  },

  NODE_4_SEAMUS: {
    id: 'NODE_4_SEAMUS',
    text: "As you continue along the path to the village square, you notice a body slumped in the road. After an initial panic, you realise it is just Seamus, the local village drunk. Even though it is barely approaching 8am, his near-lifeless body lies sprawled across the road, apparently still recovering from last night's drinking session.\n\nYou know Seamus is usually a good source of food. Chips, donner kebabs, pie crusts. With caution, you approach him and notice he is fast asleep. What do you do?",
    options: [
      {
        id: 'opt1',
        text: 'Nudge him gently with your beak to see if he wakes up and maybe offers to share his chips with you.',
        nextNode: 'NODE_4_OPTION_1_RESPONSE'
      },
      {
        id: 'opt2',
        text: 'Sneak around his near-lifeless body and see if you can find anything scattered through the dust or dirt.',
        nextNode: 'NODE_4_OPTION_2_RESPONSE'
      },
      {
        id: 'opt3',
        text: 'Rummage through his pockets to see what you can find.',
        nextNode: 'NODE_4_OPTION_3_RESPONSE'
      }
    ]
  },

  NODE_4_OPTION_1_RESPONSE: {
    id: 'NODE_4_OPTION_1_RESPONSE',
    text: "You gently nudge Seamus with your beak, but after repeated attempts he refuses to wake up. You quickly grow bored of the entire experience and continue towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_5_FINAL_HEIST'
      }
    ]
  },

  NODE_4_OPTION_2_RESPONSE: {
    id: 'NODE_4_OPTION_2_RESPONSE',
    text: "As you tiptoe around Seamus's near-lifeless body, he suddenly lets out an alarming gargling noise and twitches his arm unexpectedly. Terrified, you panic and sprint directly towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_5_FINAL_HEIST'
      }
    ]
  },

  NODE_4_OPTION_3_RESPONSE: {
    id: 'NODE_4_OPTION_3_RESPONSE',
    text: "As you rummage through Seamus's pockets, you discover some chewing gum, several old receipts, a crumpled £20 note, some buttons, and an impressive quantity of loose lint. Unfortunately, absolutely none of it is edible. Disappointed, you give up and continue towards the village square.",
    options: [
      {
        id: 'opt1',
        text: 'Continue to the village square.',
        nextNode: 'NODE_5_FINAL_HEIST'
      }
    ]
  },

  NODE_5_FINAL_HEIST: {
    id: 'NODE_5_FINAL_HEIST',
    text: "As you finally approach the village square, you realise today is the annual village market festival. This is the one day of the year where the greatest assortment of delicious treats in all of Widdershins-on-the-Wold is gathered together in one glorious place.\n\nPerfect for a devious little duck with a hungry tummy.\n\nYou decide that today you will attempt the greatest heist of your entire duck life. What do you do?",
    options: [
      {
        id: 'opt1',
        text: 'Find the fireworks set to launch later in the evening and adjust the timer so they go off in exactly two minutes. That should create the perfect distraction.',
        nextNode: 'NODE_5_OPTION_1_RESPONSE'
      },
      {
        id: 'opt2',
        text: 'Find the phone number for the village mayor and text him a bomb threat. You know he will panic and evacuate the entire square.',
        nextNode: 'NODE_5_OPTION_2_RESPONSE'
      },
      {
        id: 'opt3',
        text: 'Open the gates of a nearby field and gently encourage the local bull toward the village square. You notice plenty of people wearing bright red t-shirts and know chaos is inevitable.',
        nextNode: 'NODE_5_OPTION_3_RESPONSE'
      }
    ]
  },

  NODE_5_OPTION_1_RESPONSE: {
    id: 'NODE_5_OPTION_1_RESPONSE',
    text: "You adjust the fireworks timer and quickly position yourself near the largest bakery stand in the square. Exactly as planned, the fireworks suddenly explode into life far earlier than expected. Every villager immediately stares upward in amazement while the crowd drifts toward one end of the square.\n\nThis is your moment.\n\nYou charge towards the largest bakery display you can find and eat an astonishing amount of food. Cinnamon buns. Sausage rolls. Half a Victoria sponge. By the end of it, you can barely stand upright.\n\nWith a stomach full of regret and joy, you slowly waddle back toward the pond with the biggest smile a duck can physically produce.\n\n\nThank you for playing What The Duck: The Duck Adventure Game. We hope you had a jolly good time with it.",
    options: [
      {
        id: 'opt1',
        text: 'Play again',
        nextNode: 'NODE_1_INTRO'
      }
    ],
    isEnding: true
  },

  NODE_5_OPTION_2_RESPONSE: {
    id: 'NODE_5_OPTION_2_RESPONSE',
    text: 'You text the village mayor with a bomb threat.\n\nExactly as planned, the mayor descends instantly into complete panic. He runs around the square waving his arms wildly while shouting, "There\'s a bomb! There\'s a bomb!"\n\nWithin minutes, the entire market is evacuated.\n\nYou now have the whole square entirely to yourself.\n\nYou feast upon absolutely everything you can reach. Cakes. Bread. Sausage rolls. Pickles. Somehow even an entire pork pie.\n\nYou eat so much that you end up falling asleep in the middle of the market square before eventually waking up and waddling home completely satisfied.\n\n\nThank you for playing What The Duck: The Duck Adventure Game. We hope you had a jolly good time with it.',
    options: [
      {
        id: 'opt1',
        text: 'Play again',
        nextNode: 'NODE_1_INTRO'
      }
    ],
    isEnding: true
  },

  NODE_5_OPTION_3_RESPONSE: {
    id: 'NODE_5_OPTION_3_RESPONSE',
    text: "You quietly unlatch the nearby field gate and gently encourage the enormous bull toward the village square. Almost immediately, the bull spots a crowd of villagers wearing bright red t-shirts and charges directly toward them at full speed.\n\nPanic erupts instantly.\n\nLuckily nobody is hurt, but the square clears in record time.\n\nIn the aftermath, you and the bull peacefully share several pastries together in the middle of the abandoned market while the distant sound of screaming villagers echoes through the streets.\n\nCompletely satisfied with your work, you happily waddle back home toward the pond.\n\n\nThank you for playing What The Duck: The Duck Adventure Game. We hope you had a jolly good time with it.",
    options: [
      {
        id: 'opt1',
        text: 'Play again',
        nextNode: 'NODE_1_INTRO'
      }
    ],
    isEnding: true
  }
};

export function getGameNode(nodeId: string): GameNode | null {
  return duckGame[nodeId] || null;
}

export function getStartingNode(): GameNode {
  return duckGame.NODE_1_INTRO;
}
