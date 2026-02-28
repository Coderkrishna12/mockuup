export interface TVShow {
    id: string;
    title: string;
    year: string;
    seasons: number;
    episodes: number;
    status: 'Completed' | 'Ongoing' | 'Upcoming';
    platform: string;
    synopsis: string;
    cast: string[];
    rating: string;
    color: string;
    trailerUrl: string;
}

export const allShows: TVShow[] = [
    {
        id: 'wandavision', title: 'WandaVision', year: '2021', seasons: 1, episodes: 9,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Wanda Maximoff and Vision live an idyllic suburban life that starts to unravel, revealing a reality-bending mystery.',
        cast: ['Elizabeth Olsen', 'Paul Bettany', 'Kathryn Hahn', 'Teyonah Parris'],
        rating: '7.9', color: '#E11D48',
        trailerUrl: 'https://www.youtube.com/embed/sj9J2ecsSpo',
    },
    {
        id: 'falcon-winter-soldier', title: 'The Falcon and the Winter Soldier', year: '2021', seasons: 1, episodes: 6,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Sam Wilson and Bucky Barnes team up on a global adventure that tests their abilities and their patience.',
        cast: ['Anthony Mackie', 'Sebastian Stan', 'Wyatt Russell', 'Daniel Brühl'],
        rating: '7.2', color: '#1E3A8A',
        trailerUrl: 'https://www.youtube.com/embed/IWBsDaFWyTE',
    },
    {
        id: 'loki', title: 'Loki', year: '2021-2023', seasons: 2, episodes: 12,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'The mercurial villain Loki resumes his role as the God of Mischief after stealing the Tesseract during Endgame.',
        cast: ['Tom Hiddleston', 'Sophia Di Martino', 'Owen Wilson', 'Ke Huy Quan'],
        rating: '8.2', color: '#166534',
        trailerUrl: 'https://www.youtube.com/embed/nW948Va-l10',
    },
    {
        id: 'hawkeye', title: 'Hawkeye', year: '2021', seasons: 1, episodes: 6,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Clint Barton must partner with Kate Bishop to confront enemies from his past as Ronin.',
        cast: ['Jeremy Renner', 'Hailee Steinfeld', 'Florence Pugh', 'Vincent D\'Onofrio'],
        rating: '7.5', color: '#7C3AED',
        trailerUrl: 'https://www.youtube.com/embed/5VYb3B1ETlk',
    },
    {
        id: 'moon-knight', title: 'Moon Knight', year: '2022', seasons: 1, episodes: 6,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Steven Grant discovers he has dissociative identity disorder and shares a body with mercenary Marc Spector.',
        cast: ['Oscar Isaac', 'Ethan Hawke', 'May Calamawy', 'F. Murray Abraham'],
        rating: '7.3', color: '#F5F5F5',
        trailerUrl: 'https://www.youtube.com/embed/x7Krla_UxRg',
    },
    {
        id: 'ms-marvel-show', title: 'Ms. Marvel', year: '2022', seasons: 1, episodes: 6,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Kamala Khan, a Muslim American teenager, discovers she has superpowers and navigates life as a new hero.',
        cast: ['Iman Vellani', 'Matt Lintz', 'Zenobia Shroff', 'Mohan Kapur'],
        rating: '6.2', color: '#EAB308',
        trailerUrl: 'https://www.youtube.com/embed/m9EX0f6V11Y',
    },
    {
        id: 'she-hulk', title: 'She-Hulk: Attorney at Law', year: '2022', seasons: 1, episodes: 9,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Jennifer Walters navigates the complications of being a single attorney in her 30s who also happens to be a Hulk.',
        cast: ['Tatiana Maslany', 'Mark Ruffalo', 'Jameela Jamil', 'Tim Roth'],
        rating: '5.3', color: '#166534',
        trailerUrl: 'https://www.youtube.com/embed/gObCr0YIg64',
    },
    {
        id: 'secret-invasion', title: 'Secret Invasion', year: '2023', seasons: 1, episodes: 6,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Nick Fury learns a faction of Skrulls have been infiltrating Earth for years, leading to a covert conflict.',
        cast: ['Samuel L. Jackson', 'Ben Mendelsohn', 'Cobie Smulders', 'Olivia Colman'],
        rating: '5.4', color: '#14B8A6',
        trailerUrl: 'https://www.youtube.com/embed/BjCkBnMmAfU',
    },
    {
        id: 'echo', title: 'Echo', year: '2024', seasons: 1, episodes: 5,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Maya Lopez must face her past, reconnect with her Native American roots, and use her powers to protect her family.',
        cast: ['Alaqua Cox', 'Chaske Spencer', 'Tantoo Cardinal', 'Vincent D\'Onofrio'],
        rating: '5.6', color: '#DC2626',
        trailerUrl: 'https://www.youtube.com/embed/kPn3ssSqO6M',
    },
    {
        id: 'agatha-all-along', title: 'Agatha All Along', year: '2024', seasons: 1, episodes: 9,
        status: 'Completed', platform: 'Disney+',
        synopsis: 'Agatha Harkness gathers a coven of witches to traverse the dangerous Witches\' Road and reclaim her power.',
        cast: ['Kathryn Hahn', 'Joe Locke', 'Aubrey Plaza', 'Patti LuPone'],
        rating: '6.8', color: '#8B5CF6',
        trailerUrl: 'https://www.youtube.com/embed/9ftx96VBPWI',
    },
    {
        id: 'daredevil-born-again', title: 'Daredevil: Born Again', year: '2025', seasons: 1, episodes: 9,
        status: 'Ongoing', platform: 'Disney+',
        synopsis: 'Matt Murdock returns as the Devil of Hell\'s Kitchen in a gritty new chapter against his archenemy Wilson Fisk.',
        cast: ['Charlie Cox', 'Vincent D\'Onofrio', 'Jon Bernthal', 'Deborah Ann Woll'],
        rating: '8.1', color: '#DC2626',
        trailerUrl: 'https://www.youtube.com/embed/9Cf_WkMNSeI',
    },
    {
        id: 'ironheart', title: 'Ironheart', year: '2025', seasons: 1, episodes: 6,
        status: 'Upcoming', platform: 'Disney+',
        synopsis: 'Genius inventor Riri Williams creates the most advanced suit of armor since Iron Man.',
        cast: ['Dominique Thorne', 'Anthony Ramos', 'Lyric Ross'],
        rating: 'TBD', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/',
    },
];

export const getShowById = (id: string) => allShows.find(s => s.id === id);
export const showStatuses = [...new Set(allShows.map(s => s.status))];
