# Migration Plan: Coup App Modernization

## Current State Analysis

### Dependencies (Outdated)
- **React**: 16.13.1 → 19.2.4 (3 major versions behind)
- **Firebase**: 7.14.3 → 12.9.0 (5 major versions, modular API rewrite)
- **React Router**: 5.1.2 → 6.x (major breaking changes)
- **React Bootstrap**: 1.0.0 → 2.x (Bootstrap 5 migration)
- **Testing Library**: Multiple packages outdated
- **Flow**: 0.122.0 → will be replaced with TypeScript
- **react-scripts**: 3.4.1 → 5.0.1

### Code State
- ✅ **Already functional components** (no class components to convert)
- ❌ **14 files with inline styles** (need SCSS module migration)
- ❌ **3 CSS files** (App.css, index.css, Card.css - need SCSS conversion)
- ❌ **No TypeScript** (all .js files)
- ❌ **No mobile responsiveness** (desktop-only)
- ❌ **Flow type checking** (outdated, incomplete coverage)

### Critical Files Requiring Major Changes
1. `backend/move_logic.js` (~350 lines, monolithic state machine)
2. `backend/PerformMoves.js` (mixed concerns)
3. `gameplay/AllPlayersScreen.js` (main orchestrator)
4. `config/firebase.js` (old Firebase API)
5. All context providers (need TypeScript interfaces)

---

## Migration Strategy

### Approach
- **Incremental migration** (not big bang)
- **Each phase independently testable**
- **Maintain functionality throughout**
- **Branch per phase** for easy rollback

---

## Phase 1: Foundation & Tooling Setup

**Goal**: Modernize build tooling and establish TypeScript infrastructure without breaking existing code

**Duration Estimate**: 1-2 weeks

### Tasks

#### 1.1: Upgrade Node Dependencies (Critical First Step)
**Dependencies**: None
**Risk**: Medium

- [ ] Update `react-scripts` from 3.4.1 → 5.0.1
  - Includes Webpack 5, faster builds, better tree-shaking
  - Test that `npm start`, `npm build`, `npm test` still work
- [ ] Update testing libraries:
  - `@testing-library/react`: 9.5.0 → 16.3.2
  - `@testing-library/jest-dom`: 4.2.4 → 6.9.1
  - `@testing-library/user-event`: 7.2.1 → 14.6.1
- [ ] Update `react-icons`: 3.10.0 → 5.5.0 (minor breaking changes)
- [ ] Remove `flow-bin` and `.flowconfig` (will be replaced by TypeScript)
- [ ] Run full test suite after each update
- [ ] Verify Firebase connection still works

**Validation**:
- ✓ App runs on `npm start`
- ✓ Production build succeeds
- ✓ Tests pass
- ✓ Firebase connection active

#### 1.2: TypeScript Configuration
**Dependencies**: 1.1 complete
**Risk**: Low

- [ ] Install TypeScript dependencies:
  ```bash
  npm install --save-dev typescript @types/react @types/react-dom @types/react-router-dom @types/node
  ```
- [ ] Create `tsconfig.json` with strict mode:
  ```json
  {
    "compilerOptions": {
      "target": "ES2020",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "jsx": "react-jsx",
      "module": "ESNext",
      "moduleResolution": "node",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true,
      "allowSyntheticDefaultImports": true
    },
    "include": ["src"]
  }
  ```
- [ ] Create `.eslintrc.js` for TypeScript linting
- [ ] Add `"type": "module"` support if needed

**Validation**:
- ✓ TypeScript compiles without blocking errors
- ✓ IDE shows TypeScript IntelliSense

#### 1.3: SCSS Setup
**Dependencies**: None
**Risk**: Low

- [ ] Install SCSS dependencies:
  ```bash
  npm install --save-dev sass
  ```
- [ ] Create SCSS structure:
  ```
  src/
  └── styles/
      ├── _variables.scss      # Colors, breakpoints, spacing
      ├── _mixins.scss         # Responsive mixins
      ├── _typography.scss     # Font definitions
      └── globals.scss         # Global styles
  ```
- [ ] Define mobile-first breakpoints in `_variables.scss`:
  ```scss
  $breakpoint-xs: 320px;
  $breakpoint-sm: 768px;
  $breakpoint-md: 1024px;
  $breakpoint-lg: 1440px;
  ```
- [ ] Create responsive mixins in `_mixins.scss`

**Validation**:
- ✓ SCSS files compile
- ✓ Can import SCSS modules in components

---

## Phase 2: React & React Router Upgrade

**Goal**: Upgrade React ecosystem to modern versions

**Duration Estimate**: 2-3 weeks

### Tasks

#### 2.1: React 16 → 18 Upgrade
**Dependencies**: Phase 1 complete
**Risk**: High (breaking changes)

- [ ] Update React packages:
  ```bash
  npm install react@18 react-dom@18 @types/react@18 @types/react-dom@18
  ```
- [ ] Update `src/index.js` to use new React 18 root API:
  ```typescript
  // Old: ReactDOM.render(<App />, document.getElementById('root'))
  // New:
  import { createRoot } from 'react-dom/client';
  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
  ```
- [ ] Test all components for:
  - Double `useEffect` calls in Strict Mode (expected in dev)
  - Batching behavior changes
  - Suspense compatibility (not used yet, but prepare)
- [ ] Update Context providers for React 18 compatibility
- [ ] Fix any Concurrent Mode issues

**Critical Files to Test**:
- `contexts/PlayerContext.js`
- `contexts/RoomContext.js`
- `gameplay/AllPlayersScreen.js` (Firebase listeners)
- `backend/move_logic.js` (state machine)

**Validation**:
- ✓ No console warnings about deprecated APIs
- ✓ All Firebase listeners still work
- ✓ Game state updates properly
- ✓ Turn system functions correctly
- ✓ Multi-player testing successful

#### 2.2: React Router 5 → 6 Migration
**Dependencies**: 2.1 complete
**Risk**: High (major API changes)

- [ ] Update React Router:
  ```bash
  npm install react-router-dom@6
  ```
- [ ] Migrate `src/App.js` routes:
  - Replace `<Switch>` with `<Routes>`
  - Replace `<Route component={X} />` with `<Route element={<X />} />`
  - Remove `exact` prop (automatic in v6)
  - Update redirects to use `<Navigate>` instead of `<Redirect>`
- [ ] Update navigation calls:
  - Replace `history.push()` with `navigate()`
  - Use `useNavigate()` hook instead of `useHistory()`
- [ ] Test all navigation flows:
  - Login → GameStart
  - GameStart → MainScreen
  - Game end → Login

**Files to Update**:
- `src/App.js` (main routing)
- `components/LoginComponent.js`
- `gameplay/GameStart.js`
- `gameplay/AllPlayersScreen.js` (game end navigation)

**Validation**:
- ✓ All routes accessible
- ✓ Navigation works correctly
- ✓ No router-related console errors

---

## Phase 3: Firebase Modernization

**Goal**: Migrate to Firebase v9+ modular API

**Duration Estimate**: 3-4 weeks

### Tasks

#### 3.1: Firebase SDK Upgrade (Breaking Changes)
**Dependencies**: Phase 2 complete
**Risk**: Critical (entire backend changes)

- [ ] Update Firebase:
  ```bash
  npm install firebase@12
  ```
- [ ] Migrate `config/firebase.js` to modular API:
  ```typescript
  // Old: import firebase from 'firebase/app'
  // New:
  import { initializeApp } from 'firebase/app';
  import { getFirestore } from 'firebase/firestore';
  import { getAuth } from 'firebase/auth';
  ```
- [ ] Update all Firebase imports across codebase:
  - `firebase.firestore()` → `getFirestore(app)`
  - `firebase.auth()` → `getAuth(app)`
  - `firestore.collection()` → `collection(db, 'name')`
  - `doc.data()` → same, but imports change

**Import Migration Pattern**:
```typescript
// OLD:
import firebase from 'firebase/app';
const db = firebase.firestore();
db.collection('rooms').doc(roomName).set(...)

// NEW:
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
const db = getFirestore();
setDoc(doc(db, 'rooms', roomName), ...)
```

#### 3.2: Backend File Updates
**Dependencies**: 3.1 complete
**Risk**: Critical

Update each backend file with new Firebase API:

- [ ] `backend/startup.js`:
  - Update `register()` function
  - Update `createRoomName()` function
  - Migrate `FieldValue` usage
- [ ] `backend/game_logic.js`:
  - Update `distributeCards()` function
  - Migrate batch operations
- [ ] `backend/move_logic.js` (MOST CRITICAL):
  - Update `RegisterMoveCallback()` listener syntax
  - Migrate all `onSnapshot()` calls
  - Update `updateTurnInDB()` function
  - Update `incrementTurn()` function
  - Test extensively (this is the game state machine)
- [ ] `backend/PerformMoves.js`:
  - Update all Firebase operations
  - Update `exchangeOneCard()` function
- [ ] `backend/callbacks.js`:
  - Update `cleanupRoom()` deletion logic

#### 3.3: Context Provider Updates
**Dependencies**: 3.2 complete
**Risk**: High

- [ ] Update `contexts/RoomContext.js`:
  - Migrate Firebase listeners to new API
  - Update `onSnapshot` syntax
- [ ] Update `contexts/PlayerContext.js`:
  - Ensure compatibility with new Firebase

#### 3.4: Gameplay Component Updates
**Dependencies**: 3.3 complete
**Risk**: High

- [ ] Update `gameplay/AllPlayersScreen.js`:
  - Migrate all Firebase listeners
  - Update turn subscription logic
  - Update winner detection
- [ ] Update `gameplay/GameStart.js`:
  - Update player list listener
  - Update start game trigger
- [ ] Update `gameplay/PastMoves.js`:
  - Update turn history listener

**Validation After Each Substep**:
- ✓ Firebase connection successful
- ✓ Room creation works
- ✓ Player registration works
- ✓ Card distribution works
- ✓ Turn system works
- ✓ Move validation works
- ✓ Bluff system works
- ✓ Game end detection works
- ✓ Room cleanup on disconnect works

**Full Integration Testing**:
- ✓ Complete game playthrough (2 players)
- ✓ Complete game playthrough (6 players)
- ✓ Complete game playthrough (10+ players)
- ✓ Test all move types
- ✓ Test blocking mechanics
- ✓ Test bluff detection
- ✓ Test Ambassador card exchange
- ✓ Test disconnection handling

---

## Phase 4: TypeScript Conversion

**Goal**: Convert all JavaScript files to TypeScript

**Duration Estimate**: 4-6 weeks

### Conversion Order Strategy
Convert from **leaf components → parent components**, and **utilities → logic → UI**.

### Tasks

#### 4.1: Type Definitions & Interfaces
**Dependencies**: Phase 3 complete
**Risk**: Low

- [ ] Create `src/types/` directory
- [ ] Define core interfaces in `types/game.ts`:
  ```typescript
  export interface Player {
    id: string;
    name: string;
    cards: Card[];
    coins: number;
    inGame: boolean;
  }

  export interface Card {
    type: CardType;
    name: string;
    image?: string;
  }

  export type CardType = 'Duke' | 'Assassin' | 'Ambassador' | 'Captain' | 'Contessa';

  export interface Move {
    type: MoveType;
    player: string;
    targetPlayer?: string;
    to?: string;
  }

  export type MoveType =
    | 'general_income'
    | 'foreign_aid'
    | 'duke'
    | 'exchange_cards'
    | 'steal'
    | 'assassinate'
    | 'coup';

  export interface Turn {
    playerName: string;
    playerID: string;
    move: Move;
    confirmations: number;
    blocks: string[];
    bluffs: string[];
    ambassadorBluff: boolean;
  }

  export interface Room {
    startGame: boolean;
    turn: number;
    winner?: string;
    cards: Card[];
  }
  ```
- [ ] Define Firebase types in `types/firebase.ts`
- [ ] Define context types in `types/context.ts`

#### 4.2: Utility & Config Files (Leaves)
**Dependencies**: 4.1 complete
**Risk**: Low

Convert simple files first:

- [ ] `character_cards.js` → `character_cards.ts`
- [ ] `characters/Character.js` → `characters/Character.tsx`
- [ ] `config/firebase.js` → `config/firebase.ts`
- [ ] `backend/callbacks.js` → `backend/callbacks.ts`

#### 4.3: Context Providers
**Dependencies**: 4.2 complete
**Risk**: Medium

- [ ] `contexts/PlayerContext.js` → `contexts/PlayerContext.tsx`
  - Define `PlayerContextType` interface
  - Type `useState` values
  - Type context provider props
- [ ] `contexts/RoomContext.js` → `contexts/RoomContext.tsx`
  - Define `RoomContextType` interface
  - Type Firebase listener callbacks

#### 4.4: Components (Simple → Complex)
**Dependencies**: 4.3 complete
**Risk**: Medium

**Simple components** (no complex logic):
- [ ] `components/Creators.js` → `components/Creators.tsx`
- [ ] `components/PopupComponent.js` → `components/PopupComponent.tsx`
- [ ] `components/PlayCard.js` → `components/PlayCard.tsx`
- [ ] `gameplay/WaitForHost.js` → `gameplay/WaitForHost.tsx`
- [ ] `gameplay/PastMoves.js` → `gameplay/PastMoves.tsx`

**Medium complexity**:
- [ ] `components/LoginComponent.js` → `components/LoginComponent.tsx`
- [ ] `components/OtherPlayerInfoComponent.js` → `components/OtherPlayerInfoComponent.tsx`
- [ ] `gameplay/UserDetails.js` → `gameplay/UserDetails.tsx`
- [ ] `gameplay/GameStart.js` → `gameplay/GameStart.tsx`

#### 4.5: Backend Logic (Most Critical)
**Dependencies**: 4.4 complete
**Risk**: High

- [ ] `backend/startup.js` → `backend/startup.ts`
  - Type all function parameters
  - Type all return values
  - Type Firebase document structures
- [ ] `backend/game_logic.js` → `backend/game_logic.ts`
  - Type card distribution logic
  - Type deck scaling functions
- [ ] `backend/MoveList.js` → `backend/MoveList.tsx`
- [ ] `backend/OtherMoves.js` → `backend/OtherMoves.tsx`
- [ ] `backend/PerformMoves.js` → `backend/PerformMoves.tsx`
  - Type all move functions
  - Type component props
- [ ] `backend/move_logic.js` → `backend/move_logic.ts` (**MOST CRITICAL**)
  - Type the monolithic `RegisterMoveCallback` function
  - Type all callbacks and higher-order functions
  - Type state machine states
  - Add extensive JSDoc comments
  - Consider refactoring into smaller typed functions

#### 4.6: Main App Components
**Dependencies**: 4.5 complete
**Risk**: Medium

- [ ] `gameplay/AllPlayersScreen.js` → `gameplay/AllPlayersScreen.tsx`
  - Type all props
  - Type all state
  - Type Firebase listener callbacks
- [ ] `gameplay/MainScreen.js` → `gameplay/MainScreen.tsx`
- [ ] `gameplay/PopupFile.js` → `gameplay/PopupFile.tsx`
- [ ] `src/App.js` → `src/App.tsx`
- [ ] `src/index.js` → `src/index.tsx`

**Validation After Each File**:
- ✓ TypeScript compiles with no errors
- ✓ Component still functions correctly
- ✓ Tests pass (update test files to `.tsx` as needed)

---

## Phase 5: SCSS Migration & Styling

**Goal**: Replace all inline styles and CSS files with SCSS modules

**Duration Estimate**: 3-4 weeks

### Tasks

#### 5.1: Global Styles Migration
**Dependencies**: Phase 1.3 complete
**Risk**: Low

- [ ] Convert `src/index.css` → `src/styles/globals.scss`
- [ ] Convert `src/App.css` → `src/App.module.scss`
- [ ] Convert `src/styles/Card.css` → `src/styles/Card.module.scss`
- [ ] Import global styles in `index.tsx`:
  ```typescript
  import './styles/globals.scss';
  ```

#### 5.2: Component SCSS Modules (Inline Styles → SCSS)
**Dependencies**: 5.1 complete
**Risk**: Medium

For each of the 14 files with inline styles:

**Process per component**:
1. Create `ComponentName.module.scss` next to component
2. Extract inline styles to SCSS with BEM naming
3. Replace `style={{...}}` with `className={styles.blockName}`
4. Remove inline style objects
5. Test visual appearance

**Files to migrate** (prioritize by complexity):

**Simple components first**:
- [ ] `characters/Character.tsx` → `Character.module.scss`
- [ ] `character_cards.ts` → Extract to `CharacterCards.module.scss` if needed
- [ ] `components/PlayCard.tsx` → `PlayCard.module.scss`
- [ ] `gameplay/WaitForHost.tsx` → `WaitForHost.module.scss`

**Medium complexity**:
- [ ] `components/Creators.tsx` → `Creators.module.scss`
- [ ] `components/LoginComponent.tsx` → `LoginComponent.module.scss`
- [ ] `components/OtherPlayerInfoComponent.tsx` → `OtherPlayerInfo.module.scss`
- [ ] `gameplay/PastMoves.tsx` → `PastMoves.module.scss`
- [ ] `gameplay/UserDetails.tsx` → `UserDetails.module.scss`

**Complex components**:
- [ ] `gameplay/GameStart.tsx` → `GameStart.module.scss`
- [ ] `gameplay/MainScreen.tsx` → `MainScreen.module.scss`
- [ ] `gameplay/AllPlayersScreen.tsx` → `AllPlayersScreen.module.scss`
- [ ] `backend/PerformMoves.tsx` → `PerformMoves.module.scss`
- [ ] `src/App.tsx` → Already has `App.module.scss`

**BEM Naming Example**:
```scss
// LoginComponent.module.scss
.loginContainer {
  padding: 2rem;

  &__header {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__input {
    padding: 0.5rem;
    margin-bottom: 1rem;
  }

  &__button {
    padding: 0.75rem;

    &--primary {
      background-color: var(--primary-color);
    }
  }
}
```

**Validation Per Component**:
- ✓ Visual appearance unchanged
- ✓ Hover states work
- ✓ Active states work
- ✓ Responsive behavior maintained

#### 5.3: Remove Bootstrap Dependency (Optional)
**Dependencies**: 5.2 complete
**Risk**: High (if chosen)

**Decision Point**: Keep Bootstrap or remove?

**Option A: Keep Bootstrap** (Recommended for faster migration)
- Update to Bootstrap 5: `npm install bootstrap@5 react-bootstrap@2`
- Migrate Bootstrap 4 → 5 breaking changes
- Keep using React Bootstrap components

**Option B: Remove Bootstrap** (More work, more control)
- Replace Bootstrap components with custom components
- Implement own grid system with SCSS
- Replace modals, accordions, buttons with custom versions

**Recommendation**: Keep Bootstrap 5 for this phase, optionally remove in future phase.

---

## Phase 6: Mobile Responsiveness

**Goal**: Make app fully responsive from 320px to 1440px+

**Duration Estimate**: 3-4 weeks

### Tasks

#### 6.1: Responsive Layout Architecture
**Dependencies**: Phase 5 complete
**Risk**: Medium

- [ ] Audit current layout breakpoints
- [ ] Define component breakpoint strategy:
  - **320px-767px**: Mobile (single column, stacked)
  - **768px-1023px**: Tablet (2 columns)
  - **1024px+**: Desktop (3 columns, current layout)
- [ ] Update `_mixins.scss` with responsive mixins:
  ```scss
  @mixin mobile {
    @media (max-width: 767px) { @content; }
  }

  @mixin tablet {
    @media (min-width: 768px) and (max-width: 1023px) { @content; }
  }

  @mixin desktop {
    @media (min-width: 1024px) { @content; }
  }
  ```

#### 6.2: Core Component Responsiveness
**Dependencies**: 6.1 complete
**Risk**: High

**Critical components requiring responsive design**:

- [ ] **`MainScreen.tsx`** (3-column → responsive layout)
  - Desktop: 3 columns (UserDetails | PlayerScreen | PastMoves)
  - Tablet: 2 columns, collapse PastMoves to bottom
  - Mobile: 1 column, tabs or accordion for sections
  - Add touch-friendly navigation

- [ ] **`AllPlayersScreen.tsx`** (main gameplay)
  - Make move buttons touch-friendly (44px minimum)
  - Stack response options vertically on mobile
  - Ensure card images scale properly
  - Test landscape orientation

- [ ] **`UserDetails.tsx`** (player info sidebar)
  - Mobile: Collapsible header section
  - Show own cards prominently
  - Other player info in expandable list

- [ ] **`LoginComponent.tsx`**
  - Center form on all screen sizes
  - Ensure input fields are touch-friendly
  - Adjust spacing for mobile

- [ ] **`GameStart.tsx`**
  - Responsive player list
  - Touch-friendly "Start Game" button
  - Proper spacing on small screens

- [ ] **`PastMoves.tsx`**
  - Horizontal scrolling on mobile if needed
  - Compact move history view
  - Expandable details

#### 6.3: Touch Optimization
**Dependencies**: 6.2 complete
**Risk**: Medium

- [ ] Ensure all interactive elements ≥ 44px touch targets
- [ ] Add touch feedback (active states) to all buttons
- [ ] Test gesture support (swipe, tap, long-press if applicable)
- [ ] Disable hover-only interactions on touch devices
- [ ] Test on actual mobile devices (iOS Safari, Chrome Android)

#### 6.4: Responsive Testing
**Dependencies**: 6.3 complete
**Risk**: Low

Test on multiple devices and orientations:

- [ ] iPhone SE (320px width)
- [ ] iPhone 12/13/14 (390px width)
- [ ] iPhone Pro Max (430px width)
- [ ] iPad (768px width)
- [ ] iPad Pro (1024px width)
- [ ] Desktop (1440px+ width)
- [ ] Test portrait orientation
- [ ] Test landscape orientation
- [ ] Test with browser dev tools device emulation
- [ ] Test with actual devices if possible

**Validation Checklist**:
- ✓ No horizontal scroll on any device
- ✓ All text readable without zooming
- ✓ All buttons reachable with thumb
- ✓ Forms usable on mobile
- ✓ Cards visible and playable
- ✓ Move selection easy on touch
- ✓ Game flow works on mobile
- ✓ Performance acceptable on mobile devices

---

## Phase 7: Code Quality & Optimization

**Goal**: Refactor, optimize, and improve code quality

**Duration Estimate**: 2-3 weeks

### Tasks

#### 7.1: Refactor Monolithic Files
**Dependencies**: Phase 4 complete
**Risk**: High

- [ ] **Refactor `backend/move_logic.ts`** (most critical):
  - Extract `RegisterMoveCallback` into smaller functions:
    - `handleMoveConfirmation()`
    - `handleBluffDetection()`
    - `handleBlockMechanic()`
    - `executeMoveEffects()`
  - Create state machine abstraction
  - Add extensive unit tests for each function
  - Document state transitions

- [ ] **Refactor `backend/PerformMoves.tsx`**:
  - Separate move logic from UI components
  - Extract hooks: `useMove()`, `useCoinUpdate()`
  - Move validation logic to separate file

- [ ] **Refactor `gameplay/AllPlayersScreen.tsx`**:
  - Extract custom hooks:
    - `useGameState()`
    - `useTurnListener()`
    - `usePlayerData()`
  - Separate concerns: UI vs logic

#### 7.2: Performance Optimization
**Dependencies**: 7.1 complete
**Risk**: Medium

- [ ] Add React memoization where appropriate:
  - `React.memo()` for expensive components
  - `useMemo()` for expensive calculations
  - `useCallback()` for passed callbacks
- [ ] Optimize Firebase listeners:
  - Ensure proper unsubscribe cleanup
  - Minimize listener count
  - Use `onSnapshot` options for efficiency
- [ ] Code splitting:
  - Lazy load routes: `React.lazy(() => import('./MainScreen'))`
  - Add `<Suspense>` boundaries
- [ ] Optimize bundle size:
  - Tree-shake unused code
  - Analyze bundle with `npm run build` + source-map-explorer
  - Remove unused dependencies

#### 7.3: Testing Infrastructure
**Dependencies**: 7.2 complete
**Risk**: Medium

- [ ] Update existing tests to TypeScript
- [ ] Add tests for critical functions:
  - `backend/move_logic.ts` (state machine)
  - `backend/game_logic.ts` (card distribution)
  - `backend/startup.ts` (room creation)
- [ ] Add integration tests:
  - Full game flow test
  - Multi-player interaction test
- [ ] Add E2E tests (optional):
  - Consider Playwright or Cypress
  - Test critical user journeys

#### 7.4: Accessibility (A11y)
**Dependencies**: None (can be parallel)
**Risk**: Low

- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Add focus indicators
- [ ] Test with screen reader
- [ ] Ensure color contrast meets WCAG AA
- [ ] Add skip links for navigation

#### 7.5: Documentation
**Dependencies**: All phases complete
**Risk**: Low

- [ ] Update README.md with new tech stack
- [ ] Add TSDoc comments to all public functions
- [ ] Create architecture diagrams (optional)
- [ ] Document game rules in app
- [ ] Add troubleshooting guide

---

## Phase 8: Bootstrap 5 Upgrade (Optional)

**Goal**: Upgrade Bootstrap 4 → 5 if keeping Bootstrap

**Duration Estimate**: 1-2 weeks

**Dependencies**: Phase 5 complete

### Tasks

- [ ] Update dependencies:
  ```bash
  npm install bootstrap@5 react-bootstrap@2
  ```
- [ ] Migrate breaking changes:
  - Replace `.form-group` with `.mb-3`
  - Update utility class names
  - Update modal component props
  - Update accordion syntax
  - Remove jQuery dependency (already done)
- [ ] Test all Bootstrap components still work
- [ ] Update custom styles for Bootstrap 5 compatibility

---

## Dependency Graph

```
Phase 1 (Foundation)
    ↓
Phase 2 (React Upgrade)
    ↓
Phase 3 (Firebase Migration) ← CRITICAL PATH
    ↓
Phase 4 (TypeScript Conversion) ← LONGEST PHASE
    ↓
Phase 5 (SCSS Migration)
    ↓
Phase 6 (Mobile Responsiveness)
    ↓
Phase 7 (Code Quality)
    ↓
Phase 8 (Bootstrap 5) [Optional]
```

**Parallel Work Opportunities**:
- Phase 1.3 (SCSS setup) can happen anytime before Phase 5
- Phase 7.4 (Accessibility) can happen in parallel with Phases 5-6
- Phase 7.5 (Documentation) can be ongoing throughout

---

## Risk Mitigation Strategies

### High-Risk Phases

**Phase 3 (Firebase Migration)** - Highest Risk
- **Mitigation**:
  - Create comprehensive backup before starting
  - Migrate one backend file at a time
  - Keep thorough test coverage
  - Have rollback plan for each substep
  - Test with real multi-player scenarios
  - Consider feature flags to toggle between old/new Firebase code

**Phase 2.1 (React 18 Upgrade)** - High Risk
- **Mitigation**:
  - Read React 18 migration guide thoroughly
  - Test double-rendering behavior in dev mode
  - Ensure all useEffect cleanups are correct
  - Test with StrictMode enabled

**Phase 4.5 (Backend TypeScript)** - High Risk
- **Mitigation**:
  - Add Jest tests before TypeScript conversion
  - Convert one function at a time
  - Use `// @ts-ignore` temporarily if needed, then fix
  - Pair program for `move_logic.ts` conversion

### Rollback Strategy

For each phase:
1. Create feature branch: `feature/phase-N-description`
2. Commit frequently with descriptive messages
3. Keep phase branches until next phase validated
4. Tag main branch before merging each phase: `v1.0-phase-N-complete`
5. If rollback needed: `git revert` or `git reset --hard <tag>`

---

## Success Criteria

### Phase Completion Checklist

Each phase complete when:
- ✓ All tasks checked off
- ✓ All tests passing
- ✓ No TypeScript errors (phases 4+)
- ✓ No console errors or warnings
- ✓ Full game playthrough successful (2, 6, 10+ players)
- ✓ All moves work correctly
- ✓ Bluff/block mechanics function
- ✓ Code review completed
- ✓ Branch merged to main

### Final Success Criteria

Migration complete when:
- ✓ All code in TypeScript (strict mode)
- ✓ All inline styles converted to SCSS modules
- ✓ Fully responsive (320px - 1440px+)
- ✓ Modern dependencies (React 18+, Firebase 12+)
- ✓ Performance meets benchmarks
- ✓ All tests passing
- ✓ Documentation updated
- ✓ Deployed to production successfully

---

## Estimated Timeline

| Phase | Duration | Risk | Parallel? |
|-------|----------|------|-----------|
| Phase 1: Foundation | 1-2 weeks | Medium | No |
| Phase 2: React Upgrade | 2-3 weeks | High | No |
| Phase 3: Firebase Migration | 3-4 weeks | **Critical** | No |
| Phase 4: TypeScript | 4-6 weeks | High | No |
| Phase 5: SCSS Migration | 3-4 weeks | Medium | Partial |
| Phase 6: Mobile Responsive | 3-4 weeks | Medium | Partial with 7.4 |
| Phase 7: Code Quality | 2-3 weeks | Medium | Partial |
| Phase 8: Bootstrap 5 | 1-2 weeks | Low | Optional |

**Total Sequential**: 19-28 weeks (5-7 months)
**With Parallel Work**: 16-24 weeks (4-6 months)

**Recommendation**: Allocate 6 months with buffer for testing and unexpected issues.

---

## Notes

- **Code freeze recommended** during Phase 3 (Firebase migration)
- **Staging environment** highly recommended for testing
- **Backup Firebase data** before Phase 3
- **User communication** if this is production (expect potential downtime)
- Consider **feature flags** for gradual rollout of major changes
- **Continuous deployment** should be paused during high-risk phases
- Keep **rollback scripts** ready for quick recovery

---

## Next Steps

1. **Review this plan** with the team
2. **Adjust timeline** based on team size and availability
3. **Set up project tracking** (Jira, GitHub Projects, etc.)
4. **Create Phase 1 branch**: `git checkout -b feature/phase-1-foundation`
5. **Begin Phase 1.1**: Update react-scripts and testing libraries
6. **Schedule regular check-ins** (weekly migration status meetings)
