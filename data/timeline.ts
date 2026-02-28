export interface TimelineEvent {
    id: string;
    date: string;
    year: number;
    title: string;
    description: string;
    movieId: string;
    isMainTimeline: boolean;
    universe: string;
    phase: number;
    category: "movie" | "event" | "branch" | "cosmic";
    imageUrl?: string;
    characterImage?: string;
    backdropUrl?: string;
}

export const timelineEvents: TimelineEvent[] = [
    // ═══════════════════ PHASE 1 — THE BEGINNING ═══════════════════
    {
        id: "iron-man-origin",
        date: "2008",
        year: 2008,
        title: "Iron Man Takes Flight",
        description: "Tony Stark builds the first Iron Man suit in captivity, escaping his captors and becoming the armored Avenger. He publicly reveals his identity: 'I am Iron Man.'",
        movieId: "iron-man",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 1,
        category: "movie",
        characterImage: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/yFuKvT4Vm3sKHdFY4eG6I4ldAnn.jpg",
    },
    {
        id: "hulk-incident",
        date: "2008",
        year: 2008,
        title: "The Hulk Emerges",
        description: "Bruce Banner's gamma radiation experiment goes wrong, creating the Hulk. He goes on the run from the military while seeking a cure.",
        movieId: "the-incredible-hulk",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 1,
        category: "movie",
        characterImage: "https://image.tmdb.org/t/p/w500/hV2llx6BhMM3M87PEeyEq0KsR4O.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/sxMCqlMiQE1ueEhTMS48sSqdKnU.jpg",
    },
    {
        id: "stark-expo",
        date: "2010",
        year: 2010,
        title: "Stark Expo & Whiplash Attack",
        description: "Tony Stark faces new threats as Ivan Vanko attacks with his own arc reactor technology. Stark discovers a new element to replace palladium.",
        movieId: "iron-man-2",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 1,
        category: "movie",
    },
    {
        id: "thor-banishment",
        date: "2011",
        year: 2011,
        title: "Thor's Banishment to Earth",
        description: "Thor is cast out of Asgard by Odin for his arrogance. On Earth, he learns humility and proves worthy of Mjolnir once again.",
        movieId: "thor",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 1,
        category: "movie",
        characterImage: "https://image.tmdb.org/t/p/w500/jmlBGPJ0EBbyAqOd1dIzptFkdS1.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/2UFxrk28id6pMJITo9OLVEjx0xE.jpg",
    },
    {
        id: "cap-frozen",
        date: "2011",
        year: 2011,
        title: "Captain America: The Super-Soldier",
        description: "Steve Rogers undergoes the Super-Soldier transformation and fights Red Skull during WWII. He crashes into the Arctic and is frozen for 70 years.",
        movieId: "captain-america-the-first-avenger",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 1,
        category: "movie",
        characterImage: "https://image.tmdb.org/t/p/w500/rFljUyTRGFNWGLf1rWpBUlBblRR.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/3lBDg3i6nn5R1EDEAV2mGDhFNhA.jpg",
    },
    {
        id: "battle-of-new-york",
        date: "2012",
        year: 2012,
        title: "The Battle of New York",
        description: "Loki opens a portal above New York, unleashing the Chitauri army. The Avengers assemble for the first time to defend Earth in their greatest battle yet.",
        movieId: "the-avengers",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 1,
        category: "event",
        characterImage: "https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    },

    // ═══════════════════ PHASE 2 — EXPANSION ═══════════════════
    {
        id: "mandarin-threat",
        date: "2013",
        year: 2013,
        title: "The Mandarin Threatens",
        description: "Tony Stark's world is shattered by the Mandarin. Stripped of everything, Tony must rebuild and rely on his ingenuity to protect those he loves.",
        movieId: "iron-man-3",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 2,
        category: "movie",
    },
    {
        id: "dark-elves",
        date: "2013",
        year: 2013,
        title: "The Dark Elves Attack",
        description: "Malekith and the Dark Elves attempt to use the Aether to plunge the universe into darkness. Thor must ally with Loki to save the Nine Realms.",
        movieId: "thor-the-dark-world",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 2,
        category: "movie",
    },
    {
        id: "shield-falls",
        date: "2014",
        year: 2014,
        title: "The Fall of S.H.I.E.L.D.",
        description: "Steve Rogers discovers that Hydra has infiltrated S.H.I.E.L.D. He joins forces with Natasha Romanoff and Sam Wilson to bring down the corrupted organization.",
        movieId: "captain-america-the-winter-soldier",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 2,
        category: "event",
    },
    {
        id: "guardians-form",
        date: "2014",
        year: 2014,
        title: "Guardians of the Galaxy Unite",
        description: "A ragtag group of intergalactic misfits — Star-Lord, Gamora, Drax, Rocket, and Groot — band together to stop Ronan from destroying the galaxy.",
        movieId: "guardians-of-the-galaxy",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 2,
        category: "movie",
    },
    {
        id: "ultron-created",
        date: "2015",
        year: 2015,
        title: "The Age of Ultron",
        description: "Tony Stark and Bruce Banner's peacekeeping program, Ultron, becomes sentient and threatens global extinction. The Avengers must unite to stop their own creation.",
        movieId: "avengers-age-of-ultron",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 2,
        category: "event",
    },
    {
        id: "ant-man-heist",
        date: "2015",
        year: 2015,
        title: "The Ant-Man Heist",
        description: "Scott Lang takes on the mantle of Ant-Man, using Hank Pym's shrinking technology to pull off a heist that could save the world.",
        movieId: "ant-man",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 2,
        category: "movie",
    },

    // ═══════════════════ PHASE 3 — THE INFINITY SAGA ═══════════════════
    {
        id: "civil-war",
        date: "2016",
        year: 2016,
        title: "The Avengers Civil War",
        description: "The Sokovia Accords fracture the Avengers. Captain America and Iron Man clash over government oversight, tearing the team apart.",
        movieId: "captain-america-civil-war",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "event",
    },
    {
        id: "mystic-arts",
        date: "2016",
        year: 2016,
        title: "Doctor Strange & the Mystic Arts",
        description: "Stephen Strange discovers the mystic arts and battles Dormammu to protect Earth from interdimensional threats. He becomes the Sorcerer Supreme.",
        movieId: "doctor-strange",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "movie",
    },
    {
        id: "spider-debut",
        date: "2017",
        year: 2017,
        title: "Spider-Man Swings Into Action",
        description: "Peter Parker proves himself as a hero beyond the Stark suit, taking down the Vulture while balancing his high school life in Queens.",
        movieId: "spider-man-homecoming",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "movie",
    },
    {
        id: "ragnarok",
        date: "2017",
        year: 2017,
        title: "Ragnarök — The Fall of Asgard",
        description: "Hela, the goddess of death, destroys Mjolnir and conquers Asgard. Thor must trigger Ragnarök to save his people, resulting in Asgard's destruction.",
        movieId: "thor-ragnarok",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "event",
    },
    {
        id: "wakanda-revealed",
        date: "2018",
        year: 2018,
        title: "Wakanda Revealed to the World",
        description: "T'Challa becomes the Black Panther and decides to reveal Wakanda's true nature and technology to the world, ending centuries of isolation.",
        movieId: "black-panther",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "event",
    },
    {
        id: "the-snap",
        date: "2018",
        year: 2018,
        title: "THE SNAP — The Decimation",
        description: "Thanos collects all six Infinity Stones and snaps his fingers, wiping out half of all life in the universe. The Avengers suffer their greatest defeat.",
        movieId: "avengers-infinity-war",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "cosmic",
    },
    {
        id: "the-blip",
        date: "2023",
        year: 2023,
        title: "THE BLIP — Endgame",
        description: "The Avengers use time travel to collect Infinity Stones from the past. Tony Stark snaps his fingers to defeat Thanos, sacrificing his life to restore the universe.",
        movieId: "avengers-endgame",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 3,
        category: "cosmic",
    },

    // ═══════════════════ PHASE 4 — THE MULTIVERSE SAGA ═══════════════════
    {
        id: "black-widow-past",
        date: "2021",
        year: 2021,
        title: "Black Widow's Final Mission",
        description: "Natasha Romanoff confronts her past as she takes down the Red Room and the villain Taskmaster, freeing the Widows from their programming.",
        movieId: "black-widow",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 4,
        category: "movie",
    },
    {
        id: "multiverse-opens",
        date: "2022",
        year: 2022,
        title: "The Multiverse Cracks Open",
        description: "Doctor Strange confronts the consequences of the multiverse as Scarlet Witch's grief-driven quest for her children threatens to shatter reality itself.",
        movieId: "doctor-strange-multiverse-of-madness",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 4,
        category: "cosmic",
    },

    // ═══════════════════ ALTERNATE TIMELINES ═══════════════════
    {
        id: "loki-timeline",
        date: "2012",
        year: 2012,
        title: "Loki Escapes with the Tesseract",
        description: "During the Avengers' time heist, a variant of Loki escapes with the Space Stone, creating a branched timeline and attracting the attention of the TVA.",
        movieId: "the-avengers",
        isMainTimeline: false,
        universe: "Loki Variant Timeline",
        phase: 4,
        category: "branch",
    },
    {
        id: "what-if-captain-carter",
        date: "1943",
        year: 1943,
        title: "Captain Carter is Born",
        description: "In an alternate reality, Peggy Carter takes the Super-Soldier serum instead of Steve Rogers, becoming Captain Carter and changing the course of history.",
        movieId: "captain-america-the-first-avenger",
        isMainTimeline: false,
        universe: "Earth-82111",
        phase: 4,
        category: "branch",
    },
    {
        id: "earth-838",
        date: "2022",
        year: 2022,
        title: "Earth-838: The Illuminati",
        description: "In an alternate universe, the Illuminati — a council of heroes including Professor X, Captain Carter, and others — governs reality, until the Scarlet Witch arrives.",
        movieId: "doctor-strange-multiverse-of-madness",
        isMainTimeline: false,
        universe: "Earth-838",
        phase: 4,
        category: "branch",
    },
    {
        id: "spider-verse",
        date: "2021",
        year: 2021,
        title: "Spider-Verse Collision",
        description: "A botched spell by Doctor Strange causes villains and heroes from other spider-verses to bleed into Earth-616, leading to a multiverse-shattering confrontation.",
        movieId: "spider-man-no-way-home",
        isMainTimeline: false,
        universe: "Spider-Verse",
        phase: 4,
        category: "cosmic",
    },

    // ═══════════════════ PHASE 5 ═══════════════════
    {
        id: "kang-dynasty-begins",
        date: "2023",
        year: 2023,
        title: "Kang Encountered in the Quantum Realm",
        description: "Ant-Man and his family are pulled into the Quantum Realm where they encounter Kang the Conqueror, a multiversal threat unlike anything seen before.",
        movieId: "ant-man-quantumania",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 5,
        category: "movie",
    },
    {
        id: "guardians-final",
        date: "2023",
        year: 2023,
        title: "The Guardians' Final Ride",
        description: "The Guardians of the Galaxy embark on one last mission to save Rocket's life and confront the High Evolutionary, before going their separate ways.",
        movieId: "guardians-of-the-galaxy-vol-3",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 5,
        category: "movie",
    },
    {
        id: "deadpool-enters-mcu",
        date: "2024",
        year: 2024,
        title: "Deadpool & Wolverine Enter the MCU",
        description: "Deadpool recruits a variant of Wolverine to save his universe from the TVA. The Merc with a Mouth finally joins the Marvel Cinematic Universe.",
        movieId: "deadpool-wolverine",
        isMainTimeline: true,
        universe: "Earth-616",
        phase: 5,
        category: "cosmic",
    },
];

/** Get events by phase */
export function getEventsByPhase(phase: number): TimelineEvent[] {
    return timelineEvents.filter((e) => e.phase === phase);
}

/** Get main timeline events */
export function getMainTimelineEvents(): TimelineEvent[] {
    return timelineEvents.filter((e) => e.isMainTimeline);
}

/** Get alternate timeline events */
export function getAlternateTimelineEvents(): TimelineEvent[] {
    return timelineEvents.filter((e) => !e.isMainTimeline);
}

/** Get events by universe */
export function getEventsByUniverse(universe: string): TimelineEvent[] {
    return timelineEvents.filter((e) => e.universe === universe);
}

/** Get all unique universes */
export function getUniverses(): string[] {
    return [...new Set(timelineEvents.map((e) => e.universe))];
}

/** Multiverse data for the explorer page */
export interface MultiverseUniverse {
    id: string;
    name: string;
    designation: string;
    description: string;
    keyCharacters: string[];
    status: "stable" | "unstable" | "destroyed" | "unknown";
    color: string;
    events: string[];
}

export const multiverseUniverses: MultiverseUniverse[] = [
    {
        id: "earth-616",
        name: "Sacred Timeline",
        designation: "Earth-616",
        description: "The primary Marvel Cinematic Universe timeline. Home to the Avengers, the Guardians of the Galaxy, and all known MCU heroes and events.",
        keyCharacters: ["iron-man", "captain-america", "thor", "spider-man", "doctor-strange"],
        status: "stable",
        color: "#FFD700",
        events: ["battle-of-new-york", "the-snap", "the-blip"],
    },
    {
        id: "earth-838",
        name: "Illuminati Universe",
        designation: "Earth-838",
        description: "A universe governed by the Illuminati, a council of powerful heroes including Professor X, Captain Carter, and others. Devastated by the incursion of the Scarlet Witch.",
        keyCharacters: ["doctor-strange"],
        status: "unstable",
        color: "#A855F7",
        events: ["earth-838"],
    },
    {
        id: "earth-82111",
        name: "Captain Carter's Universe",
        designation: "Earth-82111",
        description: "An alternate reality where Peggy Carter received the Super-Soldier serum instead of Steve Rogers, becoming Captain Carter during World War II.",
        keyCharacters: ["captain-america"],
        status: "stable",
        color: "#3B82F6",
        events: ["what-if-captain-carter"],
    },
    {
        id: "loki-branch",
        name: "Loki's Branch Timeline",
        designation: "Variant Timeline",
        description: "Created when a variant of Loki escaped with the Tesseract during the Avengers' time heist. This branch was pruned by the TVA but continues to exist.",
        keyCharacters: ["loki"],
        status: "unstable",
        color: "#22C55E",
        events: ["loki-timeline"],
    },
    {
        id: "spider-verse",
        name: "Spider-Verse Nexus",
        designation: "Spider-Verse",
        description: "A nexus of multiple realities connected through Spider-Man variants. Villains and heroes from across these realities bled into Earth-616.",
        keyCharacters: ["spider-man"],
        status: "unknown",
        color: "#EF4444",
        events: ["spider-verse"],
    },
    {
        id: "deadpool-universe",
        name: "Deadpool's Universe",
        designation: "Earth-10005",
        description: "The home universe of Wade Wilson / Deadpool, originally separate from the MCU. Deadpool crossed over into Earth-616 with a variant of Wolverine.",
        keyCharacters: [],
        status: "destroyed",
        color: "#DC2626",
        events: ["deadpool-enters-mcu"],
    },
    {
        id: "dark-dimension",
        name: "The Dark Dimension",
        designation: "Dark Dimension",
        description: "An ancient, timeless realm ruled by the dread Dormammu. Doctor Strange bargained with Dormammu to protect Earth from this dimension's invasion.",
        keyCharacters: ["doctor-strange"],
        status: "stable",
        color: "#7C3AED",
        events: ["mystic-arts"],
    },
    {
        id: "quantum-realm",
        name: "The Quantum Realm",
        designation: "Quantum Realm",
        description: "A subatomic dimension where time and space work differently. Home to Kang the Conqueror's exile and key to the Avengers' time travel in Endgame.",
        keyCharacters: ["ant-man"],
        status: "unknown",
        color: "#06B6D4",
        events: ["kang-dynasty-begins"],
    },
];
