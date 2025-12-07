import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { GameState, Participant, Gift, TileType, GamePhase } from '../types/game';
import { generateBoard, BOARD_SIZE, shuffleArray } from '../utils/gameUtils';

interface GameContextProps extends GameState {
    startGame: (numParticipants: number) => void;
    rollDice: () => void;
    resolveEffect: (result?: any) => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

type Action =
    | { type: 'START_GAME'; payload: { participants: Participant[]; gifts: Gift[]; giftQueue: number[] } }
    | { type: 'ROLL_START' }
    | { type: 'ROLL_COMPLETE'; payload: { value: number } }
    | { type: 'MOVE_TOKEN'; payload: { position: number } }
    | { type: 'SET_PENDING_EFFECT'; payload: { effect: TileType | null } }
    | { type: 'RESOLVE_TURN'; payload: { success: boolean } }
    | { type: 'UPDATE_PLAYER_STATUS'; payload: { id: string; status: Participant['status']; giftId?: number } }
    | { type: 'TAKE_GIFT'; payload: { giftId: number; ownerId: string } }
    | { type: 'ADD_LOG'; payload: string }
    | { type: 'RESET_GAME' };

const initialState: GameState = {
    phase: 'SETUP',
    participants: [],
    gifts: [],
    board: generateBoard(),
    tokenPosition: 0,
    currentTurnId: null,
    giftQueue: [],
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
                participants: action.payload.participants,
                gifts: action.payload.gifts,
                giftQueue: action.payload.giftQueue,
                currentTurnId: action.payload.participants[0]?.id || null,
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
        case 'UPDATE_PLAYER_STATUS':
            return {
                ...state,
                participants: state.participants.map((p) =>
                    p.id === action.payload.id
                        ? { ...p, status: action.payload.status, giftId: action.payload.giftId }
                        : p
                ),
            };
        case 'TAKE_GIFT': {
            // Remove from giftQueue
            const { giftId, ownerId } = action.payload;
            const newQueue = state.giftQueue.filter(id => id !== giftId);

            return {
                ...state,
                giftQueue: newQueue,
                gifts: state.gifts.map((g) =>
                    g.id === giftId
                        ? { ...g, status: 'taken', ownerId }
                        : g
                ),
            };
        }
        case 'RESOLVE_TURN': {
            const { currentTurnId, participants } = state;
            const currentIdx = participants.findIndex(p => p.id === currentTurnId);
            if (currentIdx === -1) return state;

            const newParticipants = [...participants];
            const currentP = newParticipants[currentIdx];

            if (action.payload.success) {
                // Already handled by assignGift -> status='done'
            } else {
                // Failure/Skip: Move to back of the line.
                newParticipants.splice(currentIdx, 1);
                newParticipants.push(currentP);
            }

            const nextPlayer = newParticipants.find(p => p.status === 'queue');

            return {
                ...state,
                participants: newParticipants,
                currentTurnId: nextPlayer ? nextPlayer.id : null,
                pendingEffect: null,
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

    const startGame = (numParticipants: number) => {
        const participants: Participant[] = Array.from({ length: numParticipants }, (_, i) => ({
            id: `p-${i + 1}`,
            name: `Player ${i + 1}`,
            status: 'queue',
        }));

        // Shuffle initial queue
        const shuffledParticipants = shuffleArray(participants);

        const gifts: Gift[] = Array.from({ length: numParticipants }, (_, i) => ({
            id: i + 1,
            label: i + 1,
            status: 'pool',
        }));

        const giftQueue = shuffleArray(gifts.map(g => g.id));

        dispatch({
            type: 'START_GAME',
            payload: { participants: shuffledParticipants, gifts, giftQueue },
        });
    };

    const endTurn = (success: boolean) => {
        dispatch({ type: 'RESOLVE_TURN', payload: { success } });
    };

    const assignGift = (playerId: string, giftId: number) => {
        dispatch({
            type: 'UPDATE_PLAYER_STATUS',
            payload: { id: playerId, status: 'done', giftId }
        });
        dispatch({
            type: 'TAKE_GIFT',
            payload: { giftId, ownerId: playerId }
        });
        endTurn(true);
    };

    const handleTurnEnd = (gotGift: boolean) => {
        if (!gotGift) {
            endTurn(false);
        }
    };

    const rollDice = async () => {
        if (state.isRolling || !state.currentTurnId) return;

        dispatch({ type: 'ROLL_START' });

        await new Promise(resolve => setTimeout(resolve, 1000));

        const roll = Math.floor(Math.random() * 6) + 1;
        dispatch({ type: 'ROLL_COMPLETE', payload: { value: roll } });

        const newPos = (state.tokenPosition + roll) % BOARD_SIZE;

        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch({ type: 'MOVE_TOKEN', payload: { position: newPos } });

        const tile = state.board[newPos];

        if (tile.type === 'queue_draw') {
            // Auto-resolve immediately
            dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: 'queue_draw' } });
            // We need to trigger resolution. 
            // We can't call resolveEffect here directly as it relies on closure state which is stale?
            // Actually, resolveEffect uses state from closure.
            // But render hasn't happened. 
            // Let's use a timeout to allow render cycle? 
            // Or better, let the UI trigger it via useEffect?
            // Current GameControls logic triggers it? 
            // We will make GameControls trigger it if pendingEffect is queue_draw.
        } else if (tile.type === 'skip') {
            setTimeout(() => handleTurnEnd(false), 500);
        } else {
            dispatch({ type: 'SET_PENDING_EFFECT', payload: { effect: tile.type } });
        }
    };

    const resolveEffect = (result?: any) => {
        const { currentTurnId, pendingEffect, giftQueue, gifts } = state;
        if (!currentTurnId) return;

        if (pendingEffect === 'random') {
            const giftId = result as number;
            if (giftId) {
                assignGift(currentTurnId, giftId);
            } else {
                handleTurnEnd(false);
            }
        } else if (pendingEffect === 'queue_draw') {
            if (giftQueue.length > 0) {
                const giftId = giftQueue[0];
                assignGift(currentTurnId, giftId);
            } else {
                handleTurnEnd(false);
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
