export interface Game {
    id: string;
    title: string;
    year: number;
    posterUrl: string;
    platforms: string[];
    genre: string[];
    description: string;
    trailerUrl: string;
    playUrl: string;
    developer: string;
    rating: string;
}

export const games: Game[] = [
    {
        id: "spider-man-2-ps5",
        title: "Marvel's Spider-Man 2",
        year: 2023,
        posterUrl: "https://image.tmdb.org/t/p/w500/rweIrp7jQFiOnKIEwDmYkGmHVBE.jpg",
        platforms: ["PS5"],
        genre: ["Action", "Adventure", "Open World"],
        description: "Spider-Men Peter Parker and Miles Morales face the ultimate test against Venom and the symbiote threat in this critically acclaimed sequel from Insomniac Games.",
        trailerUrl: "https://www.youtube.com/embed/nq1M_Wc4FIc",
        playUrl: "https://store.playstation.com",
        developer: "Insomniac Games",
        rating: "T",
    },
    {
        id: "wolverine-ps5",
        title: "Marvel's Wolverine",
        year: 2025,
        posterUrl: "https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg",
        platforms: ["PS5"],
        genre: ["Action", "Adventure"],
        description: "Insomniac Games brings Wolverine to life in a full-length, standalone game. Experience Logan's story in a grittier, more mature Marvel universe.",
        trailerUrl: "https://www.youtube.com/embed/watch",
        playUrl: "https://store.playstation.com",
        developer: "Insomniac Games",
        rating: "M",
    },
    {
        id: "guardians-of-the-galaxy-game",
        title: "Marvel's Guardians of the Galaxy",
        year: 2021,
        posterUrl: "https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg",
        platforms: ["PS5", "PS4", "Xbox", "PC", "Switch"],
        genre: ["Action", "Adventure", "RPG"],
        description: "Lead the Guardians through an original story full of cosmic battles, team banter, and critical choices that shape the narrative.",
        trailerUrl: "https://www.youtube.com/embed/1VnxmddGbHM",
        playUrl: "https://store.steampowered.com",
        developer: "Eidos-Montréal",
        rating: "T",
    },
    {
        id: "midnight-suns",
        title: "Marvel's Midnight Suns",
        year: 2022,
        posterUrl: "https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg",
        platforms: ["PS5", "Xbox", "PC"],
        genre: ["Tactical RPG", "Strategy"],
        description: "A tactical RPG set in the darker side of Marvel. Customize your hero, build friendships with legendary characters, and fight to save the world from Lilith.",
        trailerUrl: "https://www.youtube.com/embed/watch",
        playUrl: "https://store.steampowered.com",
        developer: "Firaxis Games",
        rating: "T",
    },
    {
        id: "spider-man-miles-morales",
        title: "Marvel's Spider-Man: Miles Morales",
        year: 2020,
        posterUrl: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
        platforms: ["PS5", "PS4", "PC"],
        genre: ["Action", "Adventure", "Open World"],
        description: "Miles Morales discovers explosive new powers in this thrilling adventure. Master bio-electric venom attacks and creative camouflage as the new Spider-Man of New York.",
        trailerUrl: "https://www.youtube.com/embed/gHzuHo80S2M",
        playUrl: "https://store.playstation.com",
        developer: "Insomniac Games",
        rating: "T",
    },
    {
        id: "avengers-game",
        title: "Marvel's Avengers",
        year: 2020,
        posterUrl: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        platforms: ["PS5", "PS4", "Xbox", "PC"],
        genre: ["Action", "Adventure", "GaaS"],
        description: "Assemble a team of Earth's Mightiest Heroes, master their powers, and live your Super Hero dreams in a cinematic co-op experience.",
        trailerUrl: "https://www.youtube.com/embed/DhQFSWQVGYA",
        playUrl: "https://store.steampowered.com",
        developer: "Crystal Dynamics",
        rating: "T",
    },
    {
        id: "marvel-snap",
        title: "Marvel Snap",
        year: 2022,
        posterUrl: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
        platforms: ["Mobile", "PC"],
        genre: ["Card Game", "Strategy"],
        description: "A fast-paced card battler featuring hundreds of Marvel characters. Build your deck, unleash combos, and battle in 3-minute matches.",
        trailerUrl: "https://www.youtube.com/embed/watch",
        playUrl: "https://www.marvelsnap.com",
        developer: "Second Dinner",
        rating: "E",
    },
    {
        id: "marvel-rivals",
        title: "Marvel Rivals",
        year: 2024,
        posterUrl: "https://image.tmdb.org/t/p/w500/fBEucxECxOKjGNq6VSVGlXPWQ33.jpg",
        platforms: ["PS5", "Xbox", "PC"],
        genre: ["Hero Shooter", "Multiplayer"],
        description: "A team-based PVP hero shooter set across a dynamic, destructible Marvel universe. Choose your hero and dominate the battlefield.",
        trailerUrl: "https://www.youtube.com/embed/watch",
        playUrl: "https://www.marvelrivals.com",
        developer: "NetEase Games",
        rating: "T",
    },
];

/** Get game by ID */
export function getGameById(id: string): Game | undefined {
    return games.find((g) => g.id === id);
}

/** Get all unique platforms */
export function getGamePlatforms(): string[] {
    return [...new Set(games.flatMap((g) => g.platforms))].sort();
}
