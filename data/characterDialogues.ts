export interface DialogueLine {
    id: string;
    label: string;
    subtitle: string;
    audioFile: string; // path relative to /characters/voices/
}

export interface CharacterDialogue {
    characterId: string;
    lines: DialogueLine[];
}

export const characterDialogues: CharacterDialogue[] = [
    {
        characterId: "iron-man",
        lines: [
            {
                id: "im-iron-man",
                label: "I AM IRON MAN",
                subtitle: "I am Iron Man.",
                audioFile: "/characters/voices/Voicy_Iron Man I am iron man 1.mp3",
            },
            {
                id: "genius-billionaire",
                label: "GENIUS BILLIONAIRE",
                subtitle: "Genius, billionaire, playboy, philanthropist.",
                audioFile: "/characters/voices/Voicy__Genius, Billionaire, Playboy, Philanthropist_.mp3",
            },
            {
                id: "love-you-3000",
                label: "LOVE YOU 3000",
                subtitle: "I love you three thousand.",
                audioFile: "/characters/voices/i_love_you_3000.mp3",
            },
            {
                id: "run-before-walk",
                label: "RUN BEFORE YOU WALK",
                subtitle: "Sometimes you gotta run before you can walk.",
                audioFile: "/characters/voices/jarvis!-sometimes-you-got-to-run-before-you-can-walk.mp3",
            },
            {
                id: "nuke-incoming",
                label: "NUKE COMING IN",
                subtitle: "I got a nuke coming in. It's gonna blow in less than a minute.",
                audioFile: "/characters/voices/i-got-a-nuke-coming-in-it's-gonna-blow-in-less-than-a-minute.mp3",
            },
        ],
    },
    {
        characterId: "captain-america",
        lines: [
            {
                id: "all-day",
                label: "I CAN DO THIS ALL DAY",
                subtitle: "I can do this all day.",
                audioFile: "/characters/voices/Voicy_I Can Do This All Day.mp3",
            },
            {
                id: "avengers-assemble",
                label: "AVENGERS ASSEMBLE",
                subtitle: "Avengers… assemble.",
                audioFile: "/characters/voices/Voicy_Avengers Assemble.mp3",
            },
            {
                id: "get-out",
                label: "ANYONE WANT TO GET OUT?",
                subtitle: "Before we get started, does anyone want to get out?",
                audioFile: "/characters/voices/Voicy_Before we get started, does anyone want to get out_.mp3",
            },
            {
                id: "hail-hydra",
                label: "HAIL HYDRA",
                subtitle: "Hail Hydra.",
                audioFile: "/characters/voices/Voicy__Hail Hydra_.mp3",
            },
            {
                id: "did-what-i-had-to",
                label: "I DID WHAT I HAD TO",
                subtitle: "I did what I had to do.",
                audioFile: "/characters/voices/Voicy_I did what i had to do.mp3",
            },
        ],
    },
    {
        characterId: "thor",
        lines: [
            {
                id: "hammer-down",
                label: "PUT THE HAMMER DOWN",
                subtitle: "You want me to put the hammer down?!",
                audioFile: "/characters/voices/you-want-me-to-put-the-hammer-down.mp3",
            },
            {
                id: "real-fight",
                label: "GIVE ME A REAL FIGHT",
                subtitle: "Give me a real fight!",
                audioFile: "/characters/voices/Voicy_Give me a real fight!.mp3",
            },
            {
                id: "thats-enough",
                label: "THAT'S ENOUGH",
                subtitle: "That's enough!",
                audioFile: "/characters/voices/Voicy_That's Enough .mp3",
            },
        ],
    },
    {
        characterId: "hulk",
        lines: [
            {
                id: "hulk-smash",
                label: "HULK SMASH!",
                subtitle: "HULK SMASH!",
                audioFile: "/characters/voices/Voicy_Hulk smash!.mp3",
            },
            {
                id: "hulk-roar",
                label: "HULK ROAR",
                subtitle: "*ROOOAAARRR!*",
                audioFile: "/characters/voices/Voicy_Hulk roar.mp3",
            },
            {
                id: "hulk-smash-2",
                label: "AND HULK… SMASH!",
                subtitle: "And Hulk… SMASH!",
                audioFile: "/characters/voices/and-hulk-smash-c9a.mp3",
            },
        ],
    },
    {
        characterId: "loki",
        lines: [
            {
                id: "petty-tiny",
                label: "SO PETTY AND TINY",
                subtitle: "You people are so petty… and tiny.",
                audioFile: "/characters/voices/Voicy_You people are so petty, and tiny.mp3",
            },
            {
                id: "madness",
                label: "THIS MADNESS",
                subtitle: "Look at this! Look around you! You think this madness will end with your rule?",
                audioFile: "/characters/voices/look-at-this!-look-around-you!-you-think-this-madness-will-end-with-your-rule.mp3",
            },
            {
                id: "more-evolved",
                label: "MORE EVOLVED",
                subtitle: "I thought humans were more evolved than this.",
                audioFile: "/characters/voices/i-thought-humans-were-more-evolved-than-this.mp3",
            },
        ],
    },
    {
        characterId: "thanos",
        lines: [
            {
                id: "dont-deserve",
                label: "YOU DON'T DESERVE THIS",
                subtitle: "You don't deserve this power!",
                audioFile: "/characters/voices/Voicy_You don't deserve this power!.mp3",
            },
            {
                id: "out-of-hand",
                label: "OUT OF HAND",
                subtitle: "Things just got out of hand.",
                audioFile: "/characters/voices/Voicy_Things just got out of the hand.mp3",
            },
        ],
    },
    {
        characterId: "spider-man",
        lines: [],
    },
    {
        characterId: "doctor-strange",
        lines: [],
    },
    {
        characterId: "black-panther",
        lines: [],
    },
    {
        characterId: "scarlet-witch",
        lines: [],
    },
    {
        characterId: "ant-man",
        lines: [],
    },
    {
        characterId: "black-widow",
        lines: [],
    },
    {
        characterId: "star-lord",
        lines: [],
    },
];

/** Get dialogue data for a specific character */
export function getDialogueForCharacter(characterId: string): CharacterDialogue | undefined {
    return characterDialogues.find((d) => d.characterId === characterId);
}

/** Get characters that have voice lines available */
export function getCharactersWithVoice(): string[] {
    return characterDialogues.filter((d) => d.lines.length > 0).map((d) => d.characterId);
}
