export type TileType = 'skip' | 'random' | 'reroll' | 'queue_draw';

export interface Tile {
    id: number;
    index: number;
    type: TileType;
}

export type GiftStatus = 'pool' | 'queue' | 'taken';

export interface Gift {
    id: number;
    label: number; // The visual number on the gift
    status: GiftStatus;
}

export type GamePhase = 'SETUP' | 'GAME' | 'GIFT_REVEAL';

export interface GameState {
    phase: GamePhase;
    gifts: Gift[];
    board: Tile[];
    tokenPosition: number; // 0 to BOARD_SIZE - 1
    giftQueue: number[]; // Ordered list of Gift IDs for 'queue_draw'
    givenGifts: number[]; // Chronological list of given gift IDs
    logs: string[]; // Simple action logs
    lastDiceRoll: number | null;
    isRolling: boolean;
    isMoving: boolean; // Token is moving or turn is processing
    pendingEffect: TileType | null; // If we need to show a modal for an effect
}
