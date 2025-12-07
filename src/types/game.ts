export type TileType = 'skip' | 'random' | 'reroll' | 'queue_draw';

export interface Tile {
    id: number;
    index: number;
    type: TileType;
}

export type ParticipantStatus = 'queue' | 'spectating' | 'done';

export interface Participant {
    id: string; // UUID or simple counter string
    name: string;
    status: ParticipantStatus;
    giftId?: number; // link to a gift if they have one
}

export type GiftStatus = 'pool' | 'queue' | 'taken';

export interface Gift {
    id: number;
    label: number; // The visual number on the gift
    status: GiftStatus;
    ownerId?: string; // Participant who took it
}

export type GamePhase = 'SETUP' | 'GAME' | 'GIFT_REVEAL';

export interface GameState {
    phase: GamePhase;
    participants: Participant[];
    gifts: Gift[];
    board: Tile[];
    tokenPosition: number; // 0 to BOARD_SIZE - 1
    currentTurnId: string | null;
    giftQueue: number[]; // Ordered list of Gift IDs for 'queue_draw'
    logs: string[]; // Simple action logs
    lastDiceRoll: number | null;
    isRolling: boolean;
    pendingEffect: TileType | null; // If we need to show a modal for an effect
}
