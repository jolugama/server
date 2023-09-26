export interface Superheroes {
    superheroes: Superhero[];
}

export interface Superhero {
    id: number;
    name: string;
    alias: string;
    description: string;
    universe: Universe;
    abilities: Abilities[];
    firstAppearance?: string;
    teams?: string[];
    images?: string[];
}

export enum Universe {
    Dc = "DC",
    Marvel = "Marvel",
}


export enum Abilities {
    Superstrength = "superstrength",
    Flight = "flight",
    XRayVision = "X-ray vision",
    Invulnerability = "invulnerability",
    Intelligence = "intelligence",
    MartialArtsTraining = "martial arts training",
    AdvancedTechnology = "advanced technology",
    Resilience = "resilience",
    CombatSkills = "combat skills",
    Agility = "agility",
    WallCrawling = "wall-crawling",
    SpiderSense = "spider sense",
    IntegratedWeapons = "integrated weapons",
    Speed = "speed",
    EnhancedReflexes = "enhanced reflexes",
    TimeTravel = "time travel",
    Endurance = "endurance",
    Longevity = "longevity",
    FastSwimming = "fast swimming",
    CommunicationWithMarineLife = "communication with marine life",
    MartialArts = "martial arts",
    Espionage = "espionage",
    Marksmanship = "marksmanship",
    Regeneration = "regeneration",
    EnergyConstructCreation = "energy construct creation",
    EnergyManipulation = "energy manipulation",
    WeatherControl = "weather control",
    SharpenedSenses = "sharpened senses",
    ArcheryMastery = "archery mastery",
    Strategy = "strategy",
    Magic = "magic",
    Teleportation = "teleportation",
    RealityManipulation = "reality manipulation"
}
