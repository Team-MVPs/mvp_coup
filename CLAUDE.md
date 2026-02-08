# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based multiplayer implementation of the card game Coup, built with React and Firebase Realtime Database. Players join rooms, play turn-based card game actions, and can bluff about which cards they hold. The game supports 2-10+ players with dynamic deck scaling.

## Development Commands

### Local Development
- `npm start` - Start development server on http://localhost:3000
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Create production build in `build/` folder
- `npm run flow` - Run Flow type checker

### Deployment
- `./deploy.sh` - Deploy to Firebase hosting (builds and deploys)
- Requires Firebase CLI to be configured

## Architecture

### Tech Stack
- React 16.13.1 with React Router
- Firebase Realtime Database (Firestore) for backend
- React Context API for state management (no Redux)
- React Bootstrap for UI components
- Flow for static type checking

### Directory Structure

```
src/
├── backend/           # Core game logic and Firebase operations
│   ├── startup.js     # Room creation, player registration
│   ├── game_logic.js  # Card distribution, deck scaling
│   ├── move_logic.js  # Main game state machine (RegisterMoveCallback)
│   ├── PerformMoves.js # Move execution and UI components
│   └── callbacks.js   # Utility functions (room cleanup, error handling)
├── gameplay/          # Main game screen components
├── components/        # Reusable UI components
├── contexts/          # PlayerContext and RoomContext
├── config/            # Firebase configuration
└── characters/        # Card definitions
```

### State Management

**Two React Contexts:**
1. **PlayerContext** (`contexts/PlayerContext.js`)
   - `playerID` - Unique identifier for current player
   - `playerIndex` - Player's position in turn order
   - Persisted to sessionStorage

2. **RoomContext** (`contexts/RoomContext.js`)
   - `roomName` - Current game room identifier
   - `playerNames` - Array of all player names
   - `playerNamesMapping` - Maps playerID to names
   - Syncs with Firebase in real-time

### Firebase Database Schema

```
root (collection)
└── {roomName} (document)
    ├── startGame: boolean
    ├── turn: number
    ├── winner: string (optional)
    ├── cards: array (shared card deck)
    ├── players/ (subcollection)
    │   └── {playerID} (document)
    │       ├── name: string
    │       ├── cards: array
    │       ├── coins: number
    │       └── inGame: boolean
    └── turns/ (subcollection)
        └── {turnNumber} (document)
            ├── playerName: string
            ├── playerID: string
            ├── move: {type, player, to}
            ├── confirmations: number
            ├── blocks: array
            ├── bluffs: array
            └── ambassadorBluff: boolean
```

### Game Flow

**1. Login & Room Setup**
- `LoginComponent` handles room creation/joining
- `register()` adds player to Firebase
- Host creates room with `createRoomName()`
- Non-hosts join existing room (checks for duplicates)

**2. Waiting for Players**
- `GameStart` component shows player list
- Host clicks "Start Game" when 2+ players present
- `distributeCards()` scales deck based on player count:
  - 2-6 players: 3 cards per type
  - 6-10 players: 5 cards per type
  - 10+ players: 6 cards per type
- Each player gets 2 cards and 2 coins

**3. Active Gameplay**
- `MainScreen` is main gameplay orchestrator
- Turn determined by: `turn % totalPlayers === playerIndex`
- Active player sees `MoveList` with 7 available moves
- Player selects move → `updateTurnInDB()` creates turn document
- `RegisterMoveCallback()` is the core state machine:
  - Listens to turn document changes
  - Other players respond (confirm/block/bluff)
  - Handles bluff resolution with `HasCard()`
  - Executes moves after confirmations
  - `incrementTurn()` advances to next active player

**4. Move System Architecture**
- Higher-order functions create move callbacks: `move(type)` returns configured callback
- Firebase `FieldValue.increment()` for atomic coin updates
- Turn document acts as state machine (move → responses → resolution)
- Real-time listeners (`onSnapshot`) cascade UI updates

**5. Game End**
- `foundWinner()` detects last player with cards
- Winner field set in room document
- "New Game" button returns to login
- `cleanupRoom()` deletes room on host disconnect

### Key Files

**`backend/move_logic.js`** (~350 lines)
- Main game state machine logic
- `RegisterMoveCallback()` handles all move processing
- Bluff detection, blocking mechanics, move execution
- Most complex file in codebase

**`gameplay/AllPlayersScreen.js`** (PlayerScreen component)
- Main gameplay orchestrator
- Subscribes to room/player/turn documents
- Displays MoveList, ResponseList, and game state
- 3-column layout: UserDetails | PlayerScreen | PastMoves

**`backend/PerformMoves.js`**
- React components for special moves (Coup, LoseCard, AttemptAssassin, Captain)
- Move execution functions (generalIncome, foreignAid, Duke, etc.)
- `HasCard()` validation function
- `exchangeOneCard()` deck management

**`backend/startup.js`**
- Room and player initialization
- Validation functions for room/player names
- `startGame()` triggers game start

### Important Patterns

1. **Real-time State Synchronization**
   - All components subscribe to Firebase with `onSnapshot()`
   - Proper cleanup with `return () => unsubscribe()`
   - Turn document changes cascade through listeners

2. **Atomic Updates**
   - Use `firebase.firestore.FieldValue.increment()` for coins
   - Prevents race conditions in concurrent actions

3. **Turn Order Logic**
   - Current turn tracked at room level
   - Player turn determined by modulo: `turn % totalPlayers === playerIndex`
   - `incrementTurn()` finds next player with cards (skips eliminated players)

4. **Move Validation**
   - Coin requirements checked in UI (MoveList component)
   - Card ownership validated server-side in `HasCard()`
   - Bluff resolution determines card loss

5. **No Middleware Pattern**
   - Components directly update Firebase
   - No Redux or action dispatchers
   - Intentionally simple for real-time game state

### Testing Notes

- Tests use `@testing-library/react` and `@testing-library/jest-dom`
- Run single test file: `npm test -- <filename>`
- Tests run in watch mode by default

### Firebase Configuration

- Config in `src/config/`
- Uses Firebase Realtime Database (Firestore)
- Anonymous auth enabled (no user accounts)
- Hosting configured for SPA (all routes → index.html)

### Known Architectural Characteristics

- `RegisterMoveCallback` is monolithic but handles all game state transitions
- Some mixing of concerns (game logic split between move_logic.js and PerformMoves.js)
- No explicit separation between presentation and business logic
- Context + props drilling (no global state library)
- Real-time database updates drive all UI changes
