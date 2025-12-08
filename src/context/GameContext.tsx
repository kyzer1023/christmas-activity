import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GameState, Gift, TileType } from '../types/game';
import { generateBoard, BOARD_SIZE, shuffleArray } from '../utils/gameUtils';

interface GameContextProps extends GameState {
    startGame: (numGifts: number) => void;
    rollDice: () => void;
    resolveEffect: (result?: any) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

type Action =
    | { type: 'START_GAME'; payload: { gifts: Gift[]; giftQueue: number[] } }
    | { type: 'ROLL_START' }
    | { type: 'ROLL_COMPLETE'; payload: { value: number } }
    | { type: 'MOVE_TOKEN'; payload: { position: number } }
    | { type: 'SET_PENDING_EFFECT'; payload: { effect: TileType | null } }
    | { type: 'TAKE_GIFT'; payload: { giftId: number } }
    | { type: 'ADD_LOG'; payload: string }
    | { type: 'RESET_GAME' };

const initialState: GameState = {
    phase: 'SETUP',
    gifts: [],
    board: generateBoard(),
    tokenPosition: 0,
    giftQueue: [],
    givenGifts: [],
    logs: [],
    lastDiceRoll: null,
    isRolling: false,
    pendingEffect: null,
};

const gameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...state,
                phase: 'GAME',
                gifts: action.payload.gifts,
                giftQueue: action.payload.giftQueue,
                givenGifts: [],
                logs: [],
            };
        case 'ROLL_START':
            return { ...state, isRolling: true };
        case 'ROLL_COMPLETE':
            return { ...state, isRolling: false, lastDiceRoll: action.payload.value };
        case 'MOVE_TOKEN':
            return { ...state, tokenPosition: action.payload.position };
        case 'SET_PENDING_EFFECT':
            return { ...state, pendingEffect: action.payload.effect };
        case 'TAKE_GIFT': {
            const { giftId } = action.payload;
            // Remove from giftQueue if present
            const newQueue = state.giftQueue.filter(id => id !== giftId);

            // Add to givenGifts if not already there (though logic should prevent duplicates)
            const newGivenGifts = [...state.givenGifts, giftId];

            return {
                ...state,
                giftQueue: newQueue,
                givenGifts: newGivenGifts,
                gifts: state.gifts.map((g) =>
                    g.id === giftId
                        ? { ...g, status: 'taken' }
                        : g
                ),
                pendingEffect: null, // Clear effect after taking gift
            };
        }
        case 'ADD_LOG':
            return { ...state, logs: [action.payload, ...state.logs].slice(0, 50) };
        case 'RESET_GAME':
            return initialState;
        default:
            return state;
    }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const startGame = (numGifts: number) => {
        const gifts: Gift[] = Array.from({ length: numGifts }, (_, i) => ({
            id: i + 1,
            label: i + 1,
            status: 'pool',
        }));

        const giftQueue = shuffleArray(gifts.map(g => g.id));

        dispatch({
            type: 'START_GAME',
            payload: { gifts, giftQueue },
        });
    };

    const assignGift = (giftId: number) => {
        dispatch({
            type: 'TAKE_GIFT',
            payload: { giftId }
        });
    };

    const rollDice = async () => {
        if (state.isRolling) return;

        dispatch({ type: 'ROLL_START' });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const roll = Math.floor(Math.random() * 6) + 1;
        dispatch({ type: 'ROLL_COMPLETE', payload: { value: roll } });

        const newPos = (state.tokenPosition + roll) % BOARD_SIZE;

        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch({ type: 'MOVE_TOKEN', payload: { position: newPos } });

        // Wait for token animation to arrive before triggering effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        const tile = state.board[newPos];

        if (tile.type === 'queue_draw') {
            dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: 'queue_draw' } });
        } else if (tile.type === 'skip') {
            // Skip logic if needed
        } else {
            dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: tile.type } });
        }
    };

    const resolveEffect = (result?: any) => {
        const { pendingEffect, giftQueue } = state;

        if (pendingEffect === 'random') {
            const giftId = result as number;
            if (giftId) {
                assignGift(giftId);
            } else {
                dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: null } });
            }
        } else if (pendingEffect === 'queue_draw') {
            if (giftQueue.length > 0) {
                const giftId = giftQueue[0];
                assignGift(giftId);
            } else {
                dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: null } });
            }
        } else if (pendingEffect === 'reroll') {
            dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: null } });
        }
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
    };

    return (
        <GameContext.Provider value={{ ...state, startGame, rollDice, resolveEffect, resetGame }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};
