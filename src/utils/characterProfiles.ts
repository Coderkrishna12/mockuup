export interface CharacterProfile {
    id: string;
    name: string;
    alias: string;
    team: string;
    bio: string;
    image: string;
    color: string;
    powers: {
        strength: number;
        speed: number;
        durability: number;
        energy: number;
        intelligence: number;
        combat: number;
    };
    movies: string[];
    relatedIds: string[];
}

// Import paths — these resolve at build time
const images: Record<string, string> = {
    'iron-man': '/src/assets/images/iron-man.png',
    'thor': '/src/assets/images/thor.png',
    'captain-america': '/src/assets/images/captain-america.png',
    'hulk': '/src/assets/images/hulk.png',
    'spider-man': '/src/assets/images/hero-bg.png',
    'doctor-strange': '/src/assets/images/doctor-strange.png',
    'black-panther': '/src/assets/images/black-panther.png',
    'thanos': '/src/assets/images/thanos.png',
    'black-widow': '/src/assets/images/black-widow.png',
    'hawkeye': '/src/assets/images/hawkeye.png',
    'captain-marvel': '/src/assets/images/captain-marvel.png',
    'ant-man': '/src/assets/images/ant-man.png',
    'falcon': '/src/assets/images/falcon.png',
    'loki': '/src/assets/images/loki.png',
    'vision': '/src/assets/images/vision.png',
    'war-machine': '/src/assets/images/war-machine.png',
    'groot': '/src/assets/images/groot.png',
    'rocket': '/src/assets/images/rocket.png',
    'star-lord': '/src/assets/images/star-lord.png',
    'gamora': '/src/assets/images/gamora.png',
    'winter-soldier': '/src/assets/images/winter-soldier.png',
    'nick-fury': '/src/assets/images/nick-fury.png',
    'wasp': '/src/assets/images/wasp.png',
};

export const allCharacters: CharacterProfile[] = [
    {
        id: 'iron-man', name: 'Iron Man', alias: 'Tony Stark', team: 'Avengers',
        bio: 'Genius billionaire inventor who created a powered armor suit to save the world. Founding member of the Avengers and architect of Earth\'s mightiest defense systems.',
        image: images['iron-man'], color: '#E8002D',
        powers: { strength: 85, speed: 70, durability: 85, energy: 95, intelligence: 100, combat: 65 },
        movies: ['Iron Man', 'The Avengers', 'Age of Ultron', 'Civil War', 'Infinity War', 'Endgame'],
        relatedIds: ['spider-man', 'captain-america', 'war-machine'],
    },
    {
        id: 'thor', name: 'Thor', alias: 'Thor Odinson', team: 'Avengers',
        bio: 'The Asgardian God of Thunder, wielder of Mjolnir and Stormbreaker. One of the most powerful beings in the universe.',
        image: images['thor'], color: '#1A5B9C',
        powers: { strength: 95, speed: 80, durability: 95, energy: 100, intelligence: 50, combat: 80 },
        movies: ['Thor', 'The Avengers', 'Thor: Dark World', 'Ragnarok', 'Infinity War', 'Endgame'],
        relatedIds: ['loki', 'hulk', 'captain-america'],
    },
    {
        id: 'captain-america', name: 'Captain America', alias: 'Steve Rogers', team: 'Avengers',
        bio: 'The first super-soldier. A man out of time who became the moral compass of the Avengers and the symbol of freedom.',
        image: images['captain-america'], color: '#1E3A8A',
        powers: { strength: 60, speed: 50, durability: 65, energy: 15, intelligence: 60, combat: 95 },
        movies: ['Captain America: TFA', 'The Avengers', 'Winter Soldier', 'Civil War', 'Infinity War', 'Endgame'],
        relatedIds: ['winter-soldier', 'falcon', 'iron-man'],
    },
    {
        id: 'hulk', name: 'Hulk', alias: 'Bruce Banner', team: 'Avengers',
        bio: 'Gamma-irradiated scientist who transforms into the green goliath. The strongest Avenger, with limitless strength fueled by rage.',
        image: images['hulk'], color: '#166534',
        powers: { strength: 100, speed: 55, durability: 100, energy: 40, intelligence: 90, combat: 55 },
        movies: ['The Incredible Hulk', 'The Avengers', 'Age of Ultron', 'Ragnarok', 'Infinity War', 'Endgame'],
        relatedIds: ['thor', 'iron-man', 'black-widow'],
    },
    {
        id: 'spider-man', name: 'Spider-Man', alias: 'Peter Parker', team: 'Avengers',
        bio: 'Friendly neighborhood Spider-Man. Bitten by a radioactive spider, he gained incredible abilities and a strong sense of responsibility.',
        image: images['spider-man'], color: '#DC2626',
        powers: { strength: 65, speed: 70, durability: 60, energy: 30, intelligence: 85, combat: 75 },
        movies: ['Civil War', 'Homecoming', 'Infinity War', 'Far From Home', 'No Way Home'],
        relatedIds: ['iron-man', 'doctor-strange', 'nick-fury'],
    },
    {
        id: 'doctor-strange', name: 'Doctor Strange', alias: 'Stephen Strange', team: 'Avengers',
        bio: 'Former neurosurgeon turned Sorcerer Supreme. Master of the Mystic Arts and protector of reality itself.',
        image: images['doctor-strange'], color: '#8B5CF6',
        powers: { strength: 30, speed: 40, durability: 50, energy: 100, intelligence: 95, combat: 50 },
        movies: ['Doctor Strange', 'Ragnarok', 'Infinity War', 'Endgame', 'Multiverse of Madness'],
        relatedIds: ['spider-man', 'iron-man', 'thanos'],
    },
    {
        id: 'black-panther', name: 'Black Panther', alias: "T'Challa", team: 'Avengers',
        bio: 'King of Wakanda and protector of the most technologically advanced nation on Earth. Enhanced by the Heart-Shaped Herb.',
        image: images['black-panther'], color: '#7C3AED',
        powers: { strength: 70, speed: 65, durability: 75, energy: 35, intelligence: 80, combat: 90 },
        movies: ['Civil War', 'Black Panther', 'Infinity War', 'Endgame', 'Wakanda Forever'],
        relatedIds: ['captain-america', 'falcon', 'war-machine'],
    },
    {
        id: 'thanos', name: 'Thanos', alias: 'The Mad Titan', team: 'Villain',
        bio: 'The most feared being in the universe. Obsessed with balancing the cosmos, he sought the six Infinity Stones to reshape reality.',
        image: images['thanos'], color: '#F0C040',
        powers: { strength: 100, speed: 50, durability: 100, energy: 95, intelligence: 85, combat: 85 },
        movies: ['The Avengers', 'Guardians of the Galaxy', 'Age of Ultron', 'Infinity War', 'Endgame'],
        relatedIds: ['iron-man', 'gamora', 'doctor-strange'],
    },
    {
        id: 'black-widow', name: 'Black Widow', alias: 'Natasha Romanoff', team: 'Avengers',
        bio: 'Former Russian spy turned Avenger. One of the world\'s greatest hand-to-hand combatants and strategists.',
        image: images['black-widow'], color: '#B91C1C',
        powers: { strength: 30, speed: 45, durability: 35, energy: 15, intelligence: 75, combat: 95 },
        movies: ['Iron Man 2', 'The Avengers', 'Winter Soldier', 'Age of Ultron', 'Endgame', 'Black Widow'],
        relatedIds: ['hawkeye', 'captain-america', 'hulk'],
    },
    {
        id: 'hawkeye', name: 'Hawkeye', alias: 'Clint Barton', team: 'Avengers',
        bio: 'The world\'s greatest marksman. No superpowers, just unmatched skill and unwavering dedication to protecting the innocent.',
        image: images['hawkeye'], color: '#A855F7',
        powers: { strength: 25, speed: 40, durability: 30, energy: 15, intelligence: 55, combat: 90 },
        movies: ['Thor', 'The Avengers', 'Age of Ultron', 'Civil War', 'Endgame'],
        relatedIds: ['black-widow', 'captain-america', 'falcon'],
    },
    {
        id: 'captain-marvel', name: 'Captain Marvel', alias: 'Carol Danvers', team: 'Avengers',
        bio: 'The most powerful hero in the Marvel universe. Given cosmic powers by the Tesseract, she protects entire galaxies.',
        image: images['captain-marvel'], color: '#EAB308',
        powers: { strength: 95, speed: 90, durability: 95, energy: 100, intelligence: 65, combat: 70 },
        movies: ['Captain Marvel', 'Endgame', 'The Marvels'],
        relatedIds: ['iron-man', 'thor', 'nick-fury'],
    },
    {
        id: 'ant-man', name: 'Ant-Man', alias: 'Scott Lang', team: 'Avengers',
        bio: 'Former thief turned size-shifting hero. Can shrink to subatomic size or grow to giant proportions using Pym Particles.',
        image: images['ant-man'], color: '#EF4444',
        powers: { strength: 55, speed: 45, durability: 45, energy: 60, intelligence: 50, combat: 40 },
        movies: ['Ant-Man', 'Civil War', 'Ant-Man and the Wasp', 'Endgame', 'Quantumania'],
        relatedIds: ['wasp', 'captain-america', 'falcon'],
    },
    {
        id: 'loki', name: 'Loki', alias: 'Loki Laufeyson', team: 'Villain',
        bio: 'God of Mischief and adopted brother of Thor. A master of deception who walks the line between villain and anti-hero.',
        image: images['loki'], color: '#22C55E',
        powers: { strength: 50, speed: 55, durability: 60, energy: 80, intelligence: 90, combat: 55 },
        movies: ['Thor', 'The Avengers', 'Thor: Dark World', 'Ragnarok', 'Infinity War'],
        relatedIds: ['thor', 'thanos', 'doctor-strange'],
    },
    {
        id: 'falcon', name: 'Falcon', alias: 'Sam Wilson', team: 'Avengers',
        bio: 'Veteran pararescueman turned winged Avenger. Inherited the shield and title of Captain America from Steve Rogers.',
        image: images['falcon'], color: '#DC2626',
        powers: { strength: 35, speed: 60, durability: 30, energy: 25, intelligence: 55, combat: 70 },
        movies: ['Winter Soldier', 'Age of Ultron', 'Civil War', 'Infinity War', 'Endgame'],
        relatedIds: ['captain-america', 'winter-soldier', 'war-machine'],
    },
    {
        id: 'vision', name: 'Vision', alias: 'The Vision', team: 'Avengers',
        bio: 'Synthetic being created from vibranium, the Mind Stone, and the consciousness of J.A.R.V.I.S. A being of immense power and compassion.',
        image: images['vision'], color: '#059669',
        powers: { strength: 75, speed: 65, durability: 80, energy: 95, intelligence: 90, combat: 55 },
        movies: ['Age of Ultron', 'Civil War', 'Infinity War'],
        relatedIds: ['iron-man', 'thanos', 'war-machine'],
    },
    {
        id: 'star-lord', name: 'Star-Lord', alias: 'Peter Quill', team: 'Guardians',
        bio: 'Half-human, half-Celestial leader of the Guardians of the Galaxy. A roguish adventurer with a heart of gold and killer taste in music.',
        image: images['star-lord'], color: '#F97316',
        powers: { strength: 40, speed: 45, durability: 40, energy: 50, intelligence: 50, combat: 55 },
        movies: ['Guardians of the Galaxy', 'Vol. 2', 'Infinity War', 'Endgame', 'Vol. 3'],
        relatedIds: ['gamora', 'rocket', 'groot'],
    },
    {
        id: 'gamora', name: 'Gamora', alias: 'Zen-Whoberi', team: 'Guardians',
        bio: 'The deadliest woman in the galaxy. Adopted daughter of Thanos turned Guardian of the Galaxy.',
        image: images['gamora'], color: '#10B981',
        powers: { strength: 55, speed: 60, durability: 55, energy: 20, intelligence: 65, combat: 90 },
        movies: ['Guardians of the Galaxy', 'Vol. 2', 'Infinity War', 'Endgame'],
        relatedIds: ['thanos', 'star-lord', 'rocket'],
    },
    {
        id: 'groot', name: 'Groot', alias: 'I Am Groot', team: 'Guardians',
        bio: 'A sentient tree-like creature and loyal member of the Guardians. Can only say three words, but speaks volumes through action.',
        image: images['groot'], color: '#78350F',
        powers: { strength: 80, speed: 20, durability: 85, energy: 30, intelligence: 20, combat: 45 },
        movies: ['Guardians of the Galaxy', 'Vol. 2', 'Infinity War', 'Endgame', 'Vol. 3'],
        relatedIds: ['rocket', 'star-lord', 'thor'],
    },
    {
        id: 'rocket', name: 'Rocket', alias: 'Rocket Raccoon', team: 'Guardians',
        bio: 'Genetically engineered raccoon and master tactician. Expert in weapons and explosives with a sharp tongue to match.',
        image: images['rocket'], color: '#A16207',
        powers: { strength: 25, speed: 45, durability: 30, energy: 40, intelligence: 80, combat: 70 },
        movies: ['Guardians of the Galaxy', 'Vol. 2', 'Infinity War', 'Endgame', 'Vol. 3'],
        relatedIds: ['groot', 'star-lord', 'thor'],
    },
    {
        id: 'winter-soldier', name: 'Winter Soldier', alias: 'Bucky Barnes', team: 'Avengers',
        bio: 'Steve Rogers\' best friend, brainwashed into becoming a deadly assassin. Now redeemed and fighting alongside the Avengers.',
        image: images['winter-soldier'], color: '#64748B',
        powers: { strength: 55, speed: 50, durability: 55, energy: 20, intelligence: 50, combat: 90 },
        movies: ['Captain America: TFA', 'Winter Soldier', 'Civil War', 'Infinity War', 'Endgame'],
        relatedIds: ['captain-america', 'falcon', 'black-widow'],
    },
    {
        id: 'war-machine', name: 'War Machine', alias: 'James Rhodes', team: 'Avengers',
        bio: 'Military officer and Tony Stark\'s best friend. Pilots the War Machine armor — Iron Man\'s heavier, more heavily armed counterpart.',
        image: images['war-machine'], color: '#374151',
        powers: { strength: 80, speed: 65, durability: 85, energy: 90, intelligence: 55, combat: 65 },
        movies: ['Iron Man 2', 'Iron Man 3', 'Age of Ultron', 'Civil War', 'Infinity War', 'Endgame'],
        relatedIds: ['iron-man', 'captain-america', 'falcon'],
    },
    {
        id: 'nick-fury', name: 'Nick Fury', alias: 'Nicholas J. Fury', team: 'S.H.I.E.L.D.',
        bio: 'Former Director of S.H.I.E.L.D. and architect of the Avengers Initiative. The spy who assembled Earth\'s mightiest heroes.',
        image: images['nick-fury'], color: '#1F2937',
        powers: { strength: 25, speed: 30, durability: 25, energy: 10, intelligence: 85, combat: 75 },
        movies: ['Iron Man', 'Captain America: TFA', 'The Avengers', 'Winter Soldier', 'Age of Ultron', 'Captain Marvel'],
        relatedIds: ['captain-marvel', 'captain-america', 'iron-man'],
    },
    {
        id: 'wasp', name: 'Wasp', alias: 'Hope van Dyne', team: 'Avengers',
        bio: 'Brilliant scientist and partner of Ant-Man. Equipped with a suit that allows flight and energy blasts alongside size manipulation.',
        image: images['wasp'], color: '#EAB308',
        powers: { strength: 45, speed: 55, durability: 40, energy: 65, intelligence: 75, combat: 70 },
        movies: ['Ant-Man', 'Ant-Man and the Wasp', 'Endgame', 'Quantumania'],
        relatedIds: ['ant-man', 'captain-america', 'iron-man'],
    },
];

export const getCharacterById = (id: string) => allCharacters.find(c => c.id === id);
export const getCharactersByTeam = (team: string) => allCharacters.filter(c => c.team === team);
export const teams = [...new Set(allCharacters.map(c => c.team))];
