export interface TimelineEvent {
    id: string;
    year: string;
    title: string;
    description: string;
    category: 'movie' | 'show' | 'event' | 'origin';
    color: string;
    icon: string;
}

export const mcuTimeline: TimelineEvent[] = [
    { id: 'cap-serum', year: '1943', title: 'Super Soldier Serum', description: 'Steve Rogers is transformed into Captain America to fight HYDRA during World War II.', category: 'origin', color: '#1E3A8A', icon: '🛡️' },
    { id: 'cap-frozen', year: '1945', title: 'Captain America Lost', description: 'Steve Rogers crashes the Valkyrie into the Arctic, sacrificing himself to save millions. He is frozen in ice.', category: 'event', color: '#64748B', icon: '❄️' },
    { id: 'captain-marvel-origin', year: '1995', title: 'Captain Marvel Emerges', description: 'Carol Danvers gains cosmic powers from the Tesseract and becomes the protector of the universe.', category: 'origin', color: '#EAB308', icon: '⭐' },
    { id: 'iron-man-born', year: '2008', title: 'Iron Man is Born', description: 'Tony Stark builds the first Iron Man suit in captivity and announces himself as Iron Man to the world.', category: 'movie', color: '#E8002D', icon: '🔴' },
    { id: 'hulk-incident', year: '2008', title: 'The Hulk Incident', description: 'Bruce Banner\'s gamma experiment goes wrong, and the Hulk is unleashed on the world for the first time.', category: 'movie', color: '#166534', icon: '💚' },
    { id: 'thor-banished', year: '2011', title: 'Thor Banished to Earth', description: 'Odin banishes Thor to Earth, where he learns humility and proves himself worthy of Mjolnir.', category: 'movie', color: '#1A5B9C', icon: '⚡' },
    { id: 'cap-found', year: '2011', title: 'Cap Found in Ice', description: 'S.H.I.E.L.D. discovers Captain America\'s frozen body in the Arctic. He awakens in the 21st century.', category: 'event', color: '#1E3A8A', icon: '🧊' },
    { id: 'battle-ny', year: '2012', title: 'Battle of New York', description: 'The Avengers assemble for the first time to stop Loki and the Chitauri invasion of New York City.', category: 'movie', color: '#E8002D', icon: '🏙️' },
    { id: 'hydra-reveal', year: '2014', title: 'HYDRA Infiltration Revealed', description: 'Captain America discovers HYDRA has infiltrated S.H.I.E.L.D. from within, leading to its collapse.', category: 'movie', color: '#64748B', icon: '🐙' },
    { id: 'guardians-form', year: '2014', title: 'Guardians of the Galaxy', description: 'Peter Quill, Gamora, Drax, Rocket, and Groot form the Guardians and save Xandar from Ronan.', category: 'movie', color: '#F97316', icon: '🌌' },
    { id: 'ultron', year: '2015', title: 'Age of Ultron', description: 'Tony Stark creates Ultron, an AI that goes rogue and threatens to destroy humanity. Vision is born.', category: 'movie', color: '#E8002D', icon: '🤖' },
    { id: 'sokovia-accords', year: '2016', title: 'Sokovia Accords & Civil War', description: 'The Avengers are torn apart over government oversight. Iron Man and Captain America go to war.', category: 'movie', color: '#1E3A8A', icon: '📜' },
    { id: 'spider-man-debut', year: '2016', title: 'Spider-Man Joins the MCU', description: 'Peter Parker is recruited by Tony Stark and makes his debut as Spider-Man during the airport battle.', category: 'event', color: '#DC2626', icon: '🕷️' },
    { id: 'strange-origin', year: '2016', title: 'Doctor Strange Emerges', description: 'Dr. Stephen Strange discovers the mystic arts at Kamar-Taj and becomes the Sorcerer Supreme.', category: 'origin', color: '#8B5CF6', icon: '🔮' },
    { id: 'ragnarok', year: '2017', title: 'Ragnarök & Fall of Asgard', description: 'Hela destroys Mjolnir, conquers Asgard, and Thor is forced to trigger Ragnarök to stop her.', category: 'movie', color: '#22C55E', icon: '🔥' },
    { id: 'wakanda-revealed', year: '2018', title: 'Wakanda Revealed to World', description: 'King T\'Challa opens Wakanda to the world after defeating Killmonger and embracing change.', category: 'movie', color: '#7C3AED', icon: '🏔️' },
    { id: 'snap', year: '2018', title: 'The Snap (The Blip)', description: 'Thanos collects all six Infinity Stones and snaps his fingers, erasing half of all life in the universe.', category: 'event', color: '#F0C040', icon: '💎' },
    { id: 'endgame-battle', year: '2023', title: 'Battle of Earth', description: 'The Avengers travel through time, collect the stones, and fight Thanos in the greatest battle ever. Tony Stark sacrifices himself.', category: 'movie', color: '#E8002D', icon: '⚔️' },
    { id: 'multiverse-opens', year: '2024', title: 'The Multiverse Opens', description: 'Wanda\'s reality-warping in Westview and Sylvie killing He Who Remains fracture the multiverse.', category: 'event', color: '#E11D48', icon: '🌀' },
    { id: 'loki-throne', year: '2024', title: 'Loki Takes the Throne', description: 'Loki sacrifices himself to become the god of the multiverse, holding the timelines together at the end of time.', category: 'show', color: '#166534', icon: '👑' },
];

export const timelineCategories = [...new Set(mcuTimeline.map(e => e.category))];
