export interface HistoryEra {
    id: string;
    title: string;
    subtitle: string;
    period: string;
    color: string;
    imageUrl: string;
    characterImages: string[];
    paragraphs: string[];
    milestones: { year: string; event: string }[];
}

export const historyEras: HistoryEra[] = [
    {
        id: "golden-age",
        title: "The Golden Age",
        subtitle: "Birth of the Superhero",
        period: "1939 – 1956",
        color: "#FFD700",
        imageUrl: "https://image.tmdb.org/t/p/w1280/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
        characterImages: [
            "https://image.tmdb.org/t/p/w342/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg",
            "https://image.tmdb.org/t/p/w342/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
        ],
        paragraphs: [
            "In 1939, a small New York publishing company called Timely Comics introduced the world to the Human Torch and Namor the Sub-Mariner. These were among the first Marvel characters — though the company wouldn't bear that name for decades.",
            "In 1941, Joe Simon and Jack Kirby created Captain America, punching Hitler on the cover of his debut issue months before the US entered World War II. The character became a cultural icon and a symbol of American resilience.",
            "The Golden Age of comics was defined by patriotic heroes, war stories, and the birth of the superhero genre. These early creations laid the foundation for everything that would follow."
        ],
        milestones: [
            { year: "1939", event: "Timely Comics publishes Marvel Comics #1" },
            { year: "1941", event: "Captain America Comics #1 debuts" },
            { year: "1945", event: "WWII ends; superhero popularity declines" },
            { year: "1951", event: "Timely becomes Atlas Comics" },
        ],
    },
    {
        id: "silver-age",
        title: "The Marvel Revolution",
        subtitle: "Stan Lee & The Silver Age",
        period: "1961 – 1970",
        color: "#C0C0C0",
        imageUrl: "https://image.tmdb.org/t/p/w1280/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
        characterImages: [
            "https://image.tmdb.org/t/p/w342/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
            "https://image.tmdb.org/t/p/w342/rweIrveL43TaxUN0akQEaAXL6x0.jpg",
        ],
        paragraphs: [
            "In 1961, Stan Lee and Jack Kirby created the Fantastic Four, launching the Marvel Age of Comics. Unlike DC's perfect heroes, Marvel's characters were flawed, relatable, and lived in New York City.",
            "Spider-Man debuted in Amazing Fantasy #15 (1962) — a teenager dealing with homework, bullies, and superhero responsibilities. The X-Men explored civil rights through the lens of mutant persecution. The Avengers assembled. The Hulk raged.",
            "Stan Lee, Jack Kirby, and Steve Ditko built an interconnected universe where heroes crossed over, fought each other, and dealt with real-world problems. This was revolutionary. Marvel Comics was born."
        ],
        milestones: [
            { year: "1961", event: "Fantastic Four #1 creates the Marvel Universe" },
            { year: "1962", event: "Spider-Man and Hulk debut" },
            { year: "1963", event: "X-Men, Avengers, and Iron Man debut" },
            { year: "1966", event: "Black Panther debuts — first Black superhero" },
        ],
    },
    {
        id: "bronze-age",
        title: "The Bronze Age",
        subtitle: "Darkness & Social Relevance",
        period: "1970 – 1985",
        color: "#CD7F32",
        imageUrl: "https://image.tmdb.org/t/p/w1280/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
        characterImages: [
            "https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            "https://image.tmdb.org/t/p/w342/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
        ],
        paragraphs: [
            "The 1970s brought darker, more socially conscious storytelling. Comics tackled drug abuse, racism, and corruption. The Comics Code Authority loosened its grip, allowing more mature content.",
            "Wolverine debuted in 1974, becoming one of Marvel's most popular characters. The Punisher followed. Luke Cage and Storm broke barriers for Black representation. The X-Men were revitalized by Chris Claremont, becoming Marvel's most popular franchise.",
            "Frank Miller transformed Daredevil into a noir masterpiece. The Elektra Saga and Born Again storyline showed comics could be literature."
        ],
        milestones: [
            { year: "1974", event: "Wolverine makes his first appearance" },
            { year: "1975", event: "Giant-Size X-Men reinvents the team" },
            { year: "1980", event: "The Dark Phoenix Saga is published" },
            { year: "1986", event: "Daredevil: Born Again changes the medium" },
        ],
    },
    {
        id: "modern-age",
        title: "The Modern Age",
        subtitle: "Reinvention & Rise",
        period: "1985 – 2007",
        color: "#ED1D24",
        imageUrl: "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
        characterImages: [
            "https://image.tmdb.org/t/p/w342/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
            "https://image.tmdb.org/t/p/w342/78lPtwv72eTNqFW9COBYI0dWDJa.jpg",
        ],
        paragraphs: [
            "Marvel entered the Modern Age with groundbreaking events like Secret Wars and the near-bankruptcy that threatened to end it all. But from the ashes rose something greater.",
            "The Ultimate Universe reimagined classic heroes for a new generation. Civil War divided the Marvel Universe in a story that would inspire one of the most successful films ever made. The Infinity Gauntlet brought cosmic storytelling to its peak.",
            "And then, in 2008, everything changed. Marvel Studios took a gamble on a B-list hero named Iron Man, casting Robert Downey Jr. in the role. The Marvel Cinematic Universe was born."
        ],
        milestones: [
            { year: "1991", event: "The Infinity Gauntlet miniseries" },
            { year: "1996", event: "Marvel files for bankruptcy" },
            { year: "2000", event: "Ultimate Spider-Man launches" },
            { year: "2006", event: "Civil War event reshapes Marvel" },
        ],
    },
    {
        id: "mcu-era",
        title: "The MCU Era",
        subtitle: "From Page to Screen to Dominance",
        period: "2008 – Present",
        color: "#1E90FF",
        imageUrl: "https://image.tmdb.org/t/p/w1280/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        characterImages: [
            "https://image.tmdb.org/t/p/w342/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            "https://image.tmdb.org/t/p/w342/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
        ],
        paragraphs: [
            "Iron Man (2008) changed cinema forever. What started as a risky bet became a $30 billion franchise spanning 30+ films and a dozen TV series. The MCU proved that interconnected storytelling could work on the biggest stage.",
            "The Infinity Saga built to Avengers: Endgame, a cultural event that united the world. The Multiverse Saga expanded into the multiverse itself, with Disney+ series deepening character stories. The X-Men and Fantastic Four finally came home.",
            "From comic book pages in the 1930s to the biggest entertainment franchise in human history — Marvel's journey is the ultimate superhero origin story. And it's far from over."
        ],
        milestones: [
            { year: "2008", event: "Iron Man launches the MCU" },
            { year: "2012", event: "The Avengers proves the shared universe works" },
            { year: "2018", event: "Infinity War breaks box office records" },
            { year: "2019", event: "Endgame becomes highest-grossing film ever" },
            { year: "2021", event: "Disney+ expands the MCU with WandaVision, Loki" },
            { year: "2025", event: "Avengers: Doomsday begins the new saga" },
        ],
    },
];
