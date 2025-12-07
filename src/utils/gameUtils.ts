import type { Tile, TileType } from '../types/game';

export const BOARD_SIZE = 12;

// Custom pattern for 12 segments: 3 of each? or distributed?
// User said: "having these options: reroll, queue draw, skip and reroll"
// Wait, user comment: "what i meant that there will be 12 pies having these options: reroll, queue draw, skip and *random*?"
// "reroll, queue draw, skip and reroll" -> User likely meant Random.
// Let's assume 3 of each: Skip, Random, Reroll, Queue Draw.
const TILE_PATTERN: TileType[] = [
    'queue_draw', 'random', 'skip', 'reroll',
    'queue_draw', 'random', 'skip', 'reroll',
    'queue_draw', 'random', 'skip', 'reroll'
];

export const generateBoard = (): Tile[] => {
    return Array.from({ length: BOARD_SIZE }, (_, index) => ({
        id: index,
        index,
        type: TILE_PATTERN[index],
    }));
};

export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
