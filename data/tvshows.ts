export interface TVShow {
    id: string;
    title: string;
    phase: number;
    year: number;
    posterUrl: string;
    backdropUrl: string;
    synopsis: string;
    trailerUrl: string;
    castIds: string[];
    genre: string[];
    rating: string;
    seasons: number;
    episodes: number;
    episodeRuntime: string;
    creator: string;
    status: "Completed" | "Ongoing" | "Upcoming";
}

export const tvShows: TVShow[] = [
    // ═══════════════════ PHASE 4 ═══════════════════
    {
        id: "wandavision",
        title: "WandaVision",
        phase: 4,
        year: 2021,
        posterUrl: "https://image.tmdb.org/t/p/w500/glKDfE6btIRcVB5zrjspRIs4r52.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/57vVjteHOhsRccslf8AGXD5UDKc.jpg",
        synopsis: "Blending the style of classic sitcoms with the MCU, Wanda Maximoff and Vision — two super-powered beings living their ideal suburban lives — begin to suspect that everything is not as it seems.",
        trailerUrl: "https://www.youtube.com/embed/sj9J2ecsSpo",
        castIds: ["scarlet-witch", "vision"],
        genre: ["Drama", "Mystery", "Sci-Fi"],
        rating: "TV-PG",
        seasons: 1,
        episodes: 9,
        episodeRuntime: "30-50 min",
        creator: "Jac Schaeffer",
        status: "Completed",
    },
    {
        id: "the-falcon-and-the-winter-soldier",
        title: "The Falcon and the Winter Soldier",
        phase: 4,
        year: 2021,
        posterUrl: "https://image.tmdb.org/t/p/w500/6kbAMLteGO8yyewYau6bJ683sw7.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/JB17sIsAc4o5HIuVn7p3GH6EQs.jpg",
        synopsis: "Following the events of Avengers: Endgame, Sam Wilson and Bucky Barnes team up in a global adventure that tests their abilities — and their patience.",
        trailerUrl: "https://www.youtube.com/embed/IWBsDaFWyTE",
        castIds: ["captain-america"],
        genre: ["Action", "Adventure", "Drama"],
        rating: "TV-14",
        seasons: 1,
        episodes: 6,
        episodeRuntime: "45-60 min",
        creator: "Malcolm Spellman",
        status: "Completed",
    },
    {
        id: "loki",
        title: "Loki",
        phase: 4,
        year: 2021,
        posterUrl: "https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg",
        synopsis: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of Avengers: Endgame.",
        trailerUrl: "https://www.youtube.com/embed/nW948Va-l10",
        castIds: ["loki"],
        genre: ["Action", "Fantasy", "Sci-Fi"],
        rating: "TV-14",
        seasons: 2,
        episodes: 12,
        episodeRuntime: "40-55 min",
        creator: "Michael Waldron",
        status: "Completed",
    },
    {
        id: "what-if",
        title: "What If...?",
        phase: 4,
        year: 2021,
        posterUrl: "https://image.tmdb.org/t/p/w500/lztz5XBMG1x6Y5ubz7CxfPFsAcW.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/4N6zEMfZ57zNEQcM8gWeeerFJyq.jpg",
        synopsis: "Exploring pivotal moments from the MCU and turning them on their head, leading the audience into uncharted territory through the voice of the Watcher.",
        trailerUrl: "https://www.youtube.com/embed/x9D0uUKJ5KI",
        castIds: ["doctor-strange", "captain-america", "thor"],
        genre: ["Animation", "Action", "Sci-Fi"],
        rating: "TV-14",
        seasons: 3,
        episodes: 27,
        episodeRuntime: "25-35 min",
        creator: "A.C. Bradley",
        status: "Completed",
    },
    {
        id: "hawkeye",
        title: "Hawkeye",
        phase: 4,
        year: 2021,
        posterUrl: "https://image.tmdb.org/t/p/w500/pqzjCxPVc9TkVgGRWeAoMmyqkZV.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/1R68vl3d5s86JsS2NPjl8Y8rSoB.jpg",
        synopsis: "Former Avenger Clint Barton has a seemingly simple mission: get back to his family for Christmas. Possible? Maybe with the help of Kate Bishop.",
        trailerUrl: "https://www.youtube.com/embed/5VYb3B1ETlk",
        castIds: ["hawkeye"],
        genre: ["Action", "Comedy", "Drama"],
        rating: "TV-14",
        seasons: 1,
        episodes: 6,
        episodeRuntime: "40-55 min",
        creator: "Jonathan Igla",
        status: "Completed",
    },
    {
        id: "moon-knight",
        title: "Moon Knight",
        phase: 4,
        year: 2022,
        posterUrl: "https://image.tmdb.org/t/p/w500/vKDUmKO6F9bSKKyHhg7YGbgcEeF.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/1uZOB1vHMOgSCcTMEMJzDpINuvb.jpg",
        synopsis: "Steven Grant discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector. As their enemies converge upon them, they must navigate their complex identities while thrust into a deadly mystery among the powerful gods of Egypt.",
        trailerUrl: "https://www.youtube.com/embed/x7Krla_UxRg",
        castIds: [],
        genre: ["Action", "Drama", "Fantasy"],
        rating: "TV-14",
        seasons: 1,
        episodes: 6,
        episodeRuntime: "40-55 min",
        creator: "Jeremy Slater",
        status: "Completed",
    },
    {
        id: "ms-marvel",
        title: "Ms. Marvel",
        phase: 4,
        year: 2022,
        posterUrl: "https://image.tmdb.org/t/p/w500/3HWWh92kZbD7odwJX7nKmXNZsYo.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/Ag7FyzQCKgfNH3vqjB9n7DVNZ4.jpg",
        synopsis: "Kamala Khan, a Marvel fangirl from Jersey City, discovers she has superpowers. As she navigates high school and family life, she takes on the mantle of Ms. Marvel.",
        trailerUrl: "https://www.youtube.com/embed/m9EX0f6V11Y",
        castIds: ["captain-marvel"],
        genre: ["Action", "Adventure", "Comedy"],
        rating: "TV-PG",
        seasons: 1,
        episodes: 6,
        episodeRuntime: "40-55 min",
        creator: "Bisha K. Ali",
        status: "Completed",
    },
    {
        id: "she-hulk",
        title: "She-Hulk: Attorney at Law",
        phase: 4,
        year: 2022,
        posterUrl: "https://image.tmdb.org/t/p/w500/hJfI6AGrmr4uSHRccfJuSsapvOb.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/xKCOhcTkalcpLeKFAb4uMr2DsAj.jpg",
        synopsis: "Jennifer Walters, an attorney specializing in superhuman-oriented legal cases, navigates the complicated life of a single, 30-something who also happens to be a green 6-foot-7-inch superpowered hulk.",
        trailerUrl: "https://www.youtube.com/embed/gim2kprjL50",
        castIds: ["hulk"],
        genre: ["Comedy", "Drama", "Sci-Fi"],
        rating: "TV-14",
        seasons: 1,
        episodes: 9,
        episodeRuntime: "25-40 min",
        creator: "Jessica Gao",
        status: "Completed",
    },

    // ═══════════════════ PHASE 5 ═══════════════════
    {
        id: "secret-invasion",
        title: "Secret Invasion",
        phase: 5,
        year: 2023,
        posterUrl: "https://image.tmdb.org/t/p/w500/f5ZMzzCvt2IzVDxr54gHPv9jlC9.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/bVmSd2xPVYYkd4Siypo7N6le0GH.jpg",
        synopsis: "Nick Fury and Talos discover a faction of shapeshifting Skrulls who have been infiltrating Earth for years, sparking a covert war that threatens humanity's very existence.",
        trailerUrl: "https://www.youtube.com/embed/sJNbn4GALzU",
        castIds: ["nick-fury"],
        genre: ["Action", "Drama", "Thriller"],
        rating: "TV-14",
        seasons: 1,
        episodes: 6,
        episodeRuntime: "40-55 min",
        creator: "Kyle Bradstreet",
        status: "Completed",
    },
    {
        id: "echo",
        title: "Echo",
        phase: 5,
        year: 2024,
        posterUrl: "https://image.tmdb.org/t/p/w500/vFyJH630cF68LohVYjQW49074Sy.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/rj3jAjjauPczaYCyxv8VhuOvhNr.jpg",
        synopsis: "Maya Lopez must face her past, reconnect with her Native American roots and embrace the meaning of family to use her own abilities and be able to fight the Kingpin.",
        trailerUrl: "https://www.youtube.com/embed/aiEUyZjpDYs",
        castIds: ["hawkeye"],
        genre: ["Action", "Crime", "Drama"],
        rating: "TV-MA",
        seasons: 1,
        episodes: 5,
        episodeRuntime: "35-45 min",
        creator: "Marion Dayre",
        status: "Completed",
    },
    {
        id: "agatha-all-along",
        title: "Agatha All Along",
        phase: 5,
        year: 2024,
        posterUrl: "https://image.tmdb.org/t/p/w500/mGsxKwXUjojitRv2E9qMTbxbBRd.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/jHx0nHOTUqEYI2QxWLVw9a7k5bS.jpg",
        synopsis: "Agatha Harkness, following the events of WandaVision, gathers a coven of witches and embarks on the dangerous Witches' Road to reclaim her lost power.",
        trailerUrl: "https://www.youtube.com/embed/Yf6MiDBcne0",
        castIds: ["scarlet-witch"],
        genre: ["Fantasy", "Horror", "Mystery"],
        rating: "TV-14",
        seasons: 1,
        episodes: 9,
        episodeRuntime: "30-50 min",
        creator: "Jac Schaeffer",
        status: "Completed",
    },
    {
        id: "daredevil-born-again",
        title: "Daredevil: Born Again",
        phase: 5,
        year: 2025,
        posterUrl: "https://image.tmdb.org/t/p/w500/9lLuhV703HGCbnz6FxnqCwIwzAZ.jpg",
        backdropUrl: "https://image.tmdb.org/t/p/w1280/kLCaXT2KoMWjR69TsT4BUlYj2B3.jpg",
        synopsis: "Matt Murdock, a blind lawyer with heightened abilities, fights for justice through his bustling law firm, while former mob boss Wilson Fisk pursues his own political endeavors in New York.",
        trailerUrl: "https://www.youtube.com/embed/a42GV6vU0WY",
        castIds: [],
        genre: ["Action", "Crime", "Drama"],
        rating: "TV-MA",
        seasons: 1,
        episodes: 9,
        episodeRuntime: "45-60 min",
        creator: "Matt Corman & Chris Ord",
        status: "Ongoing",
    },
];

/** Get TV show by ID */
export function getTVShowById(id: string): TVShow | undefined {
    return tvShows.find((s) => s.id === id);
}

/** Get TV shows by phase */
export function getTVShowsByPhase(phase: number): TVShow[] {
    return tvShows.filter((s) => s.phase === phase);
}

/** Get all unique phases for shows */
export function getShowPhases(): number[] {
    return [...new Set(tvShows.map((s) => s.phase))].sort();
}

/** Get all unique genres for shows */
export function getShowGenres(): string[] {
    return [...new Set(tvShows.flatMap((s) => s.genre))].sort();
}
