export interface Movie {
    id: string;
    title: string;
    year: number;
    phase: number;
    synopsis: string;
    cast: string[];
    rating: string;
    runtime: string;
    color: string;
    trailerUrl: string;
}

export const allMovies: Movie[] = [
    // Phase 1
    {
        id: 'iron-man', title: 'Iron Man', year: 2008, phase: 1,
        synopsis: 'Tony Stark builds a high-tech suit of armor after being held captive, and becomes the superhero Iron Man.',
        cast: ['Robert Downey Jr.', 'Gwyneth Paltrow', 'Jeff Bridges', 'Terrence Howard'],
        rating: '7.9', runtime: '2h 6min', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/8ugaeA-nMTc',
    },
    {
        id: 'incredible-hulk', title: 'The Incredible Hulk', year: 2008, phase: 1,
        synopsis: 'Bruce Banner searches for a cure for the gamma radiation that transforms him into the Hulk.',
        cast: ['Edward Norton', 'Liv Tyler', 'Tim Roth', 'William Hurt'],
        rating: '6.7', runtime: '1h 52min', color: '#166534',
        trailerUrl: 'https://www.youtube.com/embed/xbqNb2PFKKA',
    },
    {
        id: 'iron-man-2', title: 'Iron Man 2', year: 2010, phase: 1,
        synopsis: 'Tony Stark faces pressure from the government, the press, and the public to share his technology with the military.',
        cast: ['Robert Downey Jr.', 'Scarlett Johansson', 'Mickey Rourke', 'Don Cheadle'],
        rating: '7.0', runtime: '2h 4min', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/BoohRoVA9WQ',
    },
    {
        id: 'thor', title: 'Thor', year: 2011, phase: 1,
        synopsis: 'The powerful but arrogant god Thor is banished to Earth, where he must learn humility to reclaim his power.',
        cast: ['Chris Hemsworth', 'Natalie Portman', 'Tom Hiddleston', 'Anthony Hopkins'],
        rating: '7.0', runtime: '1h 55min', color: '#1A5B9C',
        trailerUrl: 'https://www.youtube.com/embed/JOddp-nlNvQ',
    },
    {
        id: 'captain-america-tfa', title: 'Captain America: The First Avenger', year: 2011, phase: 1,
        synopsis: 'Steve Rogers becomes the first super-soldier during World War II and must stop the Red Skull.',
        cast: ['Chris Evans', 'Hugo Weaving', 'Tommy Lee Jones', 'Hayley Atwell'],
        rating: '6.9', runtime: '2h 4min', color: '#1E3A8A',
        trailerUrl: 'https://www.youtube.com/embed/JerVrbLldXw',
    },
    {
        id: 'the-avengers', title: 'The Avengers', year: 2012, phase: 1,
        synopsis: "Earth's mightiest heroes must come together to stop Loki and his alien army from enslaving humanity.",
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson', 'Chris Hemsworth', 'Mark Ruffalo'],
        rating: '8.0', runtime: '2h 23min', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/eOrNdBpGMv8',
    },
    // Phase 2
    {
        id: 'iron-man-3', title: 'Iron Man 3', year: 2013, phase: 2,
        synopsis: 'Tony Stark faces the Mandarin, a terrorist who destroys his world and pushes him to his limits.',
        cast: ['Robert Downey Jr.', 'Guy Pearce', 'Ben Kingsley', 'Gwyneth Paltrow'],
        rating: '7.1', runtime: '2h 10min', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/Ke1Y3P9D0Bc',
    },
    {
        id: 'thor-dark-world', title: 'Thor: The Dark World', year: 2013, phase: 2,
        synopsis: 'Thor battles the Dark Elves to save the Nine Realms from an ancient enemy.',
        cast: ['Chris Hemsworth', 'Natalie Portman', 'Tom Hiddleston', 'Christopher Eccleston'],
        rating: '6.8', runtime: '1h 52min', color: '#1A5B9C',
        trailerUrl: 'https://www.youtube.com/embed/npvJ9FTgZbM',
    },
    {
        id: 'winter-soldier', title: 'Captain America: The Winter Soldier', year: 2014, phase: 2,
        synopsis: 'Steve Rogers struggles to embrace his role in the modern world as a new threat emerges from within S.H.I.E.L.D.',
        cast: ['Chris Evans', 'Scarlett Johansson', 'Sebastian Stan', 'Anthony Mackie'],
        rating: '7.7', runtime: '2h 16min', color: '#64748B',
        trailerUrl: 'https://www.youtube.com/embed/7SlILk2WMTI',
    },
    {
        id: 'gotg', title: 'Guardians of the Galaxy', year: 2014, phase: 2,
        synopsis: 'A group of intergalactic criminals must pull together to stop a fanatical warrior from taking over the universe.',
        cast: ['Chris Pratt', 'Zoe Saldana', 'Dave Bautista', 'Vin Diesel', 'Bradley Cooper'],
        rating: '8.0', runtime: '2h 1min', color: '#F97316',
        trailerUrl: 'https://www.youtube.com/embed/d96cjJhvlMA',
    },
    {
        id: 'age-of-ultron', title: 'Avengers: Age of Ultron', year: 2015, phase: 2,
        synopsis: 'The Avengers must stop the artificial intelligence Ultron from carrying out his terrible plan.',
        cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Mark Ruffalo', 'Chris Evans', 'Scarlett Johansson'],
        rating: '7.3', runtime: '2h 21min', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/tmeOjFno6Do',
    },
    {
        id: 'ant-man', title: 'Ant-Man', year: 2015, phase: 2,
        synopsis: 'Armed with a suit that shrinks and increases strength, burglar Scott Lang must become a hero.',
        cast: ['Paul Rudd', 'Evangeline Lilly', 'Michael Douglas', 'Corey Stoll'],
        rating: '7.3', runtime: '1h 57min', color: '#EF4444',
        trailerUrl: 'https://www.youtube.com/embed/pWdKf3MneyI',
    },
    // Phase 3
    {
        id: 'civil-war', title: 'Captain America: Civil War', year: 2016, phase: 3,
        synopsis: 'Political intervention divides the Avengers, leading to an all-out war between Iron Man and Captain America.',
        cast: ['Chris Evans', 'Robert Downey Jr.', 'Scarlett Johansson', 'Chadwick Boseman', 'Tom Holland'],
        rating: '7.8', runtime: '2h 27min', color: '#1E3A8A',
        trailerUrl: 'https://www.youtube.com/embed/dKrVegVI16E',
    },
    {
        id: 'doctor-strange', title: 'Doctor Strange', year: 2016, phase: 3,
        synopsis: 'A brilliant neurosurgeon discovers the hidden world of mysticism and alternate dimensions.',
        cast: ['Benedict Cumberbatch', 'Chiwetel Ejiofor', 'Rachel McAdams', 'Tilda Swinton'],
        rating: '7.5', runtime: '1h 55min', color: '#8B5CF6',
        trailerUrl: 'https://www.youtube.com/embed/HSzx-zryEgM',
    },
    {
        id: 'homecoming', title: 'Spider-Man: Homecoming', year: 2017, phase: 3,
        synopsis: 'Peter Parker balances his life as a student with being Spider-Man while facing the Vulture.',
        cast: ['Tom Holland', 'Michael Keaton', 'Robert Downey Jr.', 'Zendaya'],
        rating: '7.4', runtime: '2h 13min', color: '#DC2626',
        trailerUrl: 'https://www.youtube.com/embed/U0D3AOldjMY',
    },
    {
        id: 'ragnarok', title: 'Thor: Ragnarok', year: 2017, phase: 3,
        synopsis: 'Thor must fight the all-powerful Hela to save Asgard from total destruction.',
        cast: ['Chris Hemsworth', 'Tom Hiddleston', 'Cate Blanchett', 'Jeff Goldblum'],
        rating: '7.9', runtime: '2h 10min', color: '#22C55E',
        trailerUrl: 'https://www.youtube.com/embed/ue80QwXMRHg',
    },
    {
        id: 'black-panther', title: 'Black Panther', year: 2018, phase: 3,
        synopsis: "T'Challa returns to Wakanda to take his rightful place as king but faces a powerful adversary.",
        cast: ['Chadwick Boseman', 'Michael B. Jordan', 'Lupita Nyongo', 'Danai Gurira'],
        rating: '7.3', runtime: '2h 14min', color: '#7C3AED',
        trailerUrl: 'https://www.youtube.com/embed/xjDjIWPwcPU',
    },
    {
        id: 'infinity-war', title: 'Avengers: Infinity War', year: 2018, phase: 3,
        synopsis: 'The Avengers must stop Thanos from collecting all six Infinity Stones and wiping out half of all life.',
        cast: ['Robert Downey Jr.', 'Chris Hemsworth', 'Josh Brolin', 'Chris Evans', 'Benedict Cumberbatch'],
        rating: '8.4', runtime: '2h 29min', color: '#F0C040',
        trailerUrl: 'https://www.youtube.com/embed/6ZfuNTqbHE8',
    },
    {
        id: 'ant-man-wasp', title: 'Ant-Man and the Wasp', year: 2018, phase: 3,
        synopsis: 'Scott Lang and Hope van Dyne team up to rescue her mother from the quantum realm.',
        cast: ['Paul Rudd', 'Evangeline Lilly', 'Michael Douglas', 'Michelle Pfeiffer'],
        rating: '7.0', runtime: '1h 58min', color: '#EAB308',
        trailerUrl: 'https://www.youtube.com/embed/8_rTIAOohas',
    },
    {
        id: 'captain-marvel', title: 'Captain Marvel', year: 2019, phase: 3,
        synopsis: 'Carol Danvers becomes the universe\'s most powerful hero when Earth is caught in a galactic war.',
        cast: ['Brie Larson', 'Samuel L. Jackson', 'Ben Mendelsohn', 'Jude Law'],
        rating: '6.8', runtime: '2h 3min', color: '#EAB308',
        trailerUrl: 'https://www.youtube.com/embed/Z1BCujX3pw8',
    },
    {
        id: 'endgame', title: 'Avengers: Endgame', year: 2019, phase: 3,
        synopsis: 'The remaining Avengers assemble once more to reverse Thanos\'s actions and restore order to the universe.',
        cast: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Scarlett Johansson', 'Josh Brolin'],
        rating: '8.4', runtime: '3h 1min', color: '#E8002D',
        trailerUrl: 'https://www.youtube.com/embed/TcMBFSGVi1c',
    },
    {
        id: 'far-from-home', title: 'Spider-Man: Far From Home', year: 2019, phase: 3,
        synopsis: 'Peter Parker goes on a European vacation but must step up when Mysterio unleashes elemental creatures.',
        cast: ['Tom Holland', 'Jake Gyllenhaal', 'Zendaya', 'Samuel L. Jackson'],
        rating: '7.4', runtime: '2h 9min', color: '#DC2626',
        trailerUrl: 'https://www.youtube.com/embed/Nt9L1jCKGnE',
    },
];

export const getMovieById = (id: string) => allMovies.find(m => m.id === id);
export const phases = [...new Set(allMovies.map(m => m.phase))].sort();
