export interface NewsArticle {
    id: string;
    category: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    author: string;
    color: string;
    featured: boolean;
}

export const allNews: NewsArticle[] = [
    {
        id: 'phase-7-announced', category: 'MOVIES', featured: true,
        title: 'Marvel Studios Announces Phase 7 Slate at D23',
        excerpt: 'The future of the MCU looks brighter than ever with 8 new films revealed at D23 Expo.',
        content: 'Kevin Feige took the stage at D23 Expo to reveal the complete Phase 7 lineup, sending fans into a frenzy. The slate includes new entries for established heroes and exciting introductions for characters never before seen in the MCU. The announcement confirmed long-rumored projects and introduced several surprise titles that left the audience speechless.',
        date: 'Feb 25, 2026', readTime: '5 min read', author: 'Marvel Editorial', color: '#E8002D',
    },
    {
        id: 'xmen-disney-plus', category: 'STREAMING', featured: true,
        title: 'X-Men Series Gets Official Green Light for Disney+',
        excerpt: 'The mutants are finally coming to the MCU in an epic new series.',
        content: 'After years of anticipation, Marvel Studios has officially greenlit an X-Men live-action series for Disney+. The show will introduce the mutant concept into the MCU timeline, with a pilot directed by a visionary filmmaker. Casting announcements are expected in the coming months, with production set to begin in late 2026.',
        date: 'Feb 22, 2026', readTime: '4 min read', author: 'Marvel Editorial', color: '#F0C040',
    },
    {
        id: 'ultimate-relaunch', category: 'COMICS', featured: false,
        title: 'Ultimate Universe Relaunches with All-New Lineup',
        excerpt: 'Marvel Comics is building a fresh universe with modern takes on classic heroes.',
        content: 'The Ultimate Universe is back with a bold new vision. Jonathan Hickman is overseeing the relaunch, which reimagines iconic characters for a modern audience. Ultimate Spider-Man, Ultimate X-Men, and Ultimate Black Panther have all been confirmed as launch titles.',
        date: 'Feb 18, 2026', readTime: '3 min read', author: 'Comics Team', color: '#1A5B9C',
    },
    {
        id: 'wolverine-game', category: 'GAMES', featured: false,
        title: "Marvel's Wolverine Gameplay Trailer Drops",
        excerpt: 'Insomniac Games reveals brutal combat and stunning open-world exploration.',
        content: 'Insomniac Games showcased an extended gameplay trailer for Marvel\'s Wolverine, revealing a mature, story-driven open-world experience set in Madripoor. The trailer highlighted Wolverine\'s devastating claw combat, regeneration mechanics, and a darker tone compared to the studio\'s Spider-Man titles.',
        date: 'Feb 15, 2026', readTime: '3 min read', author: 'Games Desk', color: '#14B8A6',
    },
    {
        id: 'sdcc-2026', category: 'EVENTS', featured: false,
        title: 'San Diego Comic-Con 2026: Marvel Dominates Hall H',
        excerpt: 'Exclusive panels, surprise cast reveals, and thunderous applause.',
        content: 'Marvel Studios delivered one of the most electrifying Hall H presentations in SDCC history. Multiple surprise cast members appeared on stage, exclusive footage was shown, and the crowd erupted with standing ovations. The event set social media ablaze with trending topics dominating all platforms.',
        date: 'Feb 10, 2026', readTime: '6 min read', author: 'Events Team', color: '#8B5CF6',
    },
    {
        id: 'hot-toys-endgame', category: 'MERCH', featured: false,
        title: 'Hot Toys Unveils New Endgame Anniversary Collection',
        excerpt: 'Premium 1/6 scale figures celebrating the most epic crossover event.',
        content: 'Hot Toys has announced a stunning new wave of 1/6 scale collectible figures for the Endgame anniversary. The lineup includes definitive versions of the original six Avengers in their final battle outfits, each featuring an unprecedented level of detail and accessories.',
        date: 'Feb 5, 2026', readTime: '2 min read', author: 'Merch Reporter', color: '#E8002D',
    },
    {
        id: 'secret-wars-update', category: 'MOVIES', featured: false,
        title: 'Avengers: Secret Wars Production Update',
        excerpt: 'The most ambitious crossover in MCU history starts filming this summer.',
        content: 'Marvel Studios has confirmed that Avengers: Secret Wars will begin principal photography this summer in London. The film is described as the culmination of the Multiverse Saga and will feature the largest ensemble cast in MCU history. The Russo Brothers are returning to direct.',
        date: 'Jan 28, 2026', readTime: '4 min read', author: 'Marvel Editorial', color: '#E8002D',
    },
    {
        id: 'daredevil-s2', category: 'STREAMING', featured: false,
        title: 'Daredevil: Born Again Season 2 Confirmed',
        excerpt: 'The Man Without Fear returns with darker storylines and new villains.',
        content: 'Following the massive success of Season 1, Disney+ has confirmed a second season of Daredevil: Born Again. The show will continue to explore Matt Murdock\'s dual life as lawyer and vigilante, with several classic Daredevil villains set to make their MCU debuts.',
        date: 'Jan 20, 2026', readTime: '3 min read', author: 'Streaming Desk', color: '#DC2626',
    },
];

export const getNewsById = (id: string) => allNews.find(n => n.id === id);
export const newsCategories = [...new Set(allNews.map(n => n.category))];
