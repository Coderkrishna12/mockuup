export interface Comic {
    id: string;
    title: string;
    series: string;
    issue: number;
    year: number;
    writer: string;
    artist: string;
    description: string;
    era: string;
    color: string;
    coverUrl: string;
}

export const allComics: Comic[] = [
    {
        id: 'amazing-fantasy-15', title: 'Amazing Fantasy #15', series: 'Amazing Fantasy', issue: 15, year: 1962,
        writer: 'Stan Lee', artist: 'Steve Ditko',
        description: 'The very first appearance of Spider-Man. A radioactive spider bite gives teenager Peter Parker incredible abilities.',
        era: 'Silver Age', color: '#DC2626',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/54/Amazing_Fantasy_15.png',
    },
    {
        id: 'x-men-1', title: 'X-Men #1', series: 'X-Men', issue: 1, year: 1963,
        writer: 'Stan Lee', artist: 'Jack Kirby',
        description: 'The debut of Marvel\'s mutant superhero team — Cyclops, Beast, Angel, Iceman, and Marvel Girl vs. Magneto.',
        era: 'Silver Age', color: '#EAB308',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2c/X-Men_Vol_1_1.png',
    },
    {
        id: 'avengers-1', title: 'The Avengers #1', series: 'The Avengers', issue: 1, year: 1963,
        writer: 'Stan Lee', artist: 'Jack Kirby',
        description: 'Earth\'s Mightiest Heroes unite for the first time. Iron Man, Thor, Hulk, Ant-Man, and Wasp vs. Loki.',
        era: 'Silver Age', color: '#E8002D',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/ed/Avengers1.png',
    },
    {
        id: 'incredible-hulk-181', title: 'The Incredible Hulk #181', series: 'The Incredible Hulk', issue: 181, year: 1974,
        writer: 'Len Wein', artist: 'Herb Trimpe',
        description: 'The first full appearance of Wolverine, battling the Hulk and the Wendigo in the Canadian wilderness.',
        era: 'Bronze Age', color: '#166534',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Hulk181.png',
    },
    {
        id: 'iron-man-128', title: 'Iron Man #128', series: 'Iron Man', issue: 128, year: 1979,
        writer: 'David Michelinie', artist: 'Bob Layton',
        description: 'The iconic "Demon in a Bottle" conclusion. Tony Stark confronts his alcoholism in this groundbreaking issue.',
        era: 'Bronze Age', color: '#E8002D',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Iron_Man_128.jpg',
    },
    {
        id: 'secret-wars-1', title: 'Secret Wars #1', series: 'Secret Wars', issue: 1, year: 1984,
        writer: 'Jim Shooter', artist: 'Mike Zeck',
        description: 'The Beyonder transports Marvel\'s heroes and villains to Battleworld for the ultimate showdown.',
        era: 'Bronze Age', color: '#8B5CF6',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/Secretwars1.png',
    },
    {
        id: 'infinity-gauntlet-1', title: 'Infinity Gauntlet #1', series: 'Infinity Gauntlet', issue: 1, year: 1991,
        writer: 'Jim Starlin', artist: 'George Pérez',
        description: 'Thanos wields the completed Infinity Gauntlet, erasing half the universe with a snap. The inspiration for Infinity War.',
        era: 'Modern Age', color: '#F0C040',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2e/InfinityGauntlet1.png',
    },
    {
        id: 'civil-war-1', title: 'Civil War #1', series: 'Civil War', issue: 1, year: 2006,
        writer: 'Mark Millar', artist: 'Steve McNiven',
        description: 'The Superhuman Registration Act splits the Marvel Universe. Iron Man vs. Captain America in an ideological war.',
        era: 'Modern Age', color: '#1E3A8A',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/72/CivilWar1.jpg',
    },
    {
        id: 'ultimate-spider-man-1', title: 'Ultimate Spider-Man #1', series: 'Ultimate Spider-Man', issue: 1, year: 2000,
        writer: 'Brian Michael Bendis', artist: 'Mark Bagley',
        description: 'A modern retelling of Spider-Man\'s origin for a new generation. The book that launched the Ultimate Universe.',
        era: 'Modern Age', color: '#DC2626',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/Ultimate_Spider-Man_1.jpg',
    },
    {
        id: 'house-of-m-1', title: 'House of M #1', series: 'House of M', issue: 1, year: 2005,
        writer: 'Brian Michael Bendis', artist: 'Olivier Coipel',
        description: 'Scarlet Witch reshapes reality, creating a world where mutants rule. "No More Mutants" echoes forever.',
        era: 'Modern Age', color: '#E11D48',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/43/HouseOfM_1.jpg',
    },
    {
        id: 'planet-hulk', title: 'Planet Hulk #1', series: 'Planet Hulk', issue: 1, year: 2006,
        writer: 'Greg Pak', artist: 'Carlo Pagulayan',
        description: 'Exiled to the planet Sakaar, the Hulk rises from gladiator to king in this epic space odyssey.',
        era: 'Modern Age', color: '#166534',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/Incredible_Hulk_92.jpg',
    },
    {
        id: 'new-avengers-1', title: 'New Avengers #1', series: 'New Avengers', issue: 1, year: 2005,
        writer: 'Brian Michael Bendis', artist: 'David Finch',
        description: 'A new team of Avengers forms from the ashes. Spider-Man, Wolverine, and Luke Cage join the roster.',
        era: 'Modern Age', color: '#E8002D',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c3/New_Avengers_Vol_1_1.png',
    },
    {
        id: 'black-panther-1-2016', title: 'Black Panther #1 (2016)', series: 'Black Panther', issue: 1, year: 2016,
        writer: 'Ta-Nehisi Coates', artist: 'Brian Stelfreeze',
        description: 'A Nation Under Our Feet. T\'Challa faces a violent uprising that threatens to destroy Wakanda from within.',
        era: 'Contemporary', color: '#7C3AED',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/99/Black_Panther_Vol_6_1.png',
    },
    {
        id: 'ms-marvel-1', title: 'Ms. Marvel #1', series: 'Ms. Marvel', issue: 1, year: 2014,
        writer: 'G. Willow Wilson', artist: 'Adrian Alphona',
        description: 'Kamala Khan becomes the new Ms. Marvel — the first Muslim character to headline a Marvel comic.',
        era: 'Contemporary', color: '#EF4444',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c5/Ms._Marvel_Vol_3_1.png',
    },
    {
        id: 'immortal-hulk-1', title: 'Immortal Hulk #1', series: 'Immortal Hulk', issue: 1, year: 2018,
        writer: 'Al Ewing', artist: 'Joe Bennett',
        description: 'A horror-infused reinvention. Bruce Banner can\'t die — and something terrible comes out at night.',
        era: 'Contemporary', color: '#166534',
        coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e0/Immortal_Hulk_Vol_1_1.png',
    },
];

export const getComicById = (id: string) => allComics.find(c => c.id === id);
export const eras = [...new Set(allComics.map(c => c.era))];
