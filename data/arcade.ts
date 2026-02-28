export interface ArcadeCharacter {
    id: string;
    name: string;
    health: number;
    power: number;
    speed: number;
    specialAbility: string;
    specialName: string;
    color: string;
    emoji: string;
}

export const arcadeCharacters: ArcadeCharacter[] = [
    { id: "iron-man", name: "Iron Man", health: 85, power: 90, speed: 75, specialAbility: "repulsor", specialName: "Repulsor Blast", color: "#DC2626", emoji: "🦾" },
    { id: "captain-america", name: "Captain America", health: 95, power: 70, speed: 80, specialAbility: "shield", specialName: "Shield Throw", color: "#2563EB", emoji: "🛡️" },
    { id: "thor", name: "Thor", health: 100, power: 95, speed: 65, specialAbility: "lightning", specialName: "Lightning Strike", color: "#7C3AED", emoji: "⚡" },
    { id: "spider-man", name: "Spider-Man", health: 75, power: 65, speed: 95, specialAbility: "web", specialName: "Web Stun", color: "#EF4444", emoji: "🕷️" },
    { id: "hulk", name: "Hulk", health: 120, power: 100, speed: 50, specialAbility: "smash", specialName: "Hulk Smash", color: "#16A34A", emoji: "💚" },
];

export const arcadeGames = [
    {
        id: "battle",
        title: "Hero Battle Arena",
        description: "Character vs character fighting game. Select your hero, battle AI opponents!",
        icon: "⚔️",
        color: "#DC2626",
        difficulty: "Medium",
    },
    {
        id: "stones",
        title: "Infinity Stone Collector",
        description: "Endless runner — collect all six Infinity Stones while dodging obstacles.",
        icon: "💎",
        color: "#7C3AED",
        difficulty: "Easy",
    },
    {
        id: "swing",
        title: "Spider Swing Challenge",
        description: "Physics-based web swinging between buildings. How far can you go?",
        icon: "🕸️",
        color: "#EF4444",
        difficulty: "Hard",
    },
    {
        id: "shield",
        title: "Shield Defense",
        description: "Rotate Captain America's shield to block incoming projectiles in waves.",
        icon: "🛡️",
        color: "#2563EB",
        difficulty: "Medium",
    },
    {
        id: "reactor",
        title: "Stark Reactor Charge",
        description: "Reaction-speed game. Stabilize Iron Man's arc reactor under pressure!",
        icon: "⚡",
        color: "#F59E0B",
        difficulty: "Easy",
    },
];
