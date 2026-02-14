Migration plan for Claude Code to follow

## Key things to remember: 
1. App should always be tested by running npm build and npm start to ensure it complies 
2. Prevent as much re rendering as possible 
3. clarify questions as required
4. create new PR branches for each major phase.

## Phase 1: Code organization 
**Goal**: split files that handle complex logic into multiple files. 
**Remember**: if possible, create all changes in one PR since all the files will affect each other

Backend: 
- ensure each file only handles specific tasks that relate to each other 
- calls made to firebase should be moved into a common API folder and be listed under common files (for example all calls related to room data should be under roomData.js for example, but use better naming)
- add comments to all the functions describing what its purpose is, what are the parameters, and its outcome if any
- add error handling around firebase calls using try and catch 
- ensure values are stored in variables to be reused if needed multiple times in one handler (for example game_logic.js, playerCollection.get is called multiple times but instead the value can be stored in a variable to prevent multiple api calls)
- optimize any api calls as needed, try to prevent looping within a loop but clarify how you intend to update it

Frontend: 
- ensure component files only render one component and import other components as needed 
- ensure state changes and re renders are handled through use state and use effect and other hooks in react
- move frontend related files to a common folder 
- smaller react components should be in their own files and be imported into parent components for rendering, use prop drilling to pass props down to childern (or can use react context if that is better, if redux is required confirm first and clarify why)
- components moved to their own folders should have the scss files associated with them in that same folder as well
- ensure useEffect hooks have proper dependencies in them
- there a lot of firebase calls being made inside useEffect hooks, does that need to happen?

General: 
- ensure common functions are moved to util files instead of being created in the same file multiple times
- move constants to consts file and import them into files as needed
- for functions and components, use ES6 notation instead of the traditional notation (for example: export const test = () => {...})
- helper functions should be moved into utils file
- remove console logs and other types of debugging code that was added, also remove commented out code to reduce code size
- startup.js is a good example of a file handling only things related to each other
- create common folder for frontend related code and common folder for backend/api handling related code
- there are a lot of redirects used when errors happen for example, if they are not needed they should be removed 
- remove any files or code that is not being used in general to clean up the codebase
- clean up the if else statements throughout the files to make them look cleaner, for example use conditional logic to determine if things should be rendered rather than if else statements


Specific Files:
1. move_logic.js: 
- split this files functions into multiple files as needed since its doing a lot of different functions
- move constants into generic consts file
- keep any logic related to moves in here with better naming conventions and better functional logic 
- all the firebase calls should be moved to a common file and placed inside of backend folder (if there is a better idea for this please suggest)
- the big function register move callback is doing a lot of logic related to different types of move options, clean this up and use better standards to make it more readable 

2. MoveList.js:
- this should probably not be in the backend folder since it has lots of different component renderings
- move the smaller components into its own files and import them where needed

3. PerformMoves.js: 
- move each component/function into its own seperate file instead in the frontend
- if there is any backend type calls being made here, they should be calling some api handler instead of all being called in this file 

4. LoginComponent.js
- existingRoom function is doing a lot of checks that require calling firebase multiple times, is there anyway we can decrease the number of api calls?

5. firebase.js:
- move the API keys and values to an env file and then import them through there

6. AllPlayersScreen.js:
- this file is handling a lot of logic, is there any way we can condense it, move things to their own files, make it more readable? 
- it is a lot of logic related to what should be shown on the screen based on what the turn is so clarify how to handle fixing this file if need be

## End of Phase 1: ensure the app builds and run npm start to ensure it can work 

## Phase 2: Update JS to Typescript:

**Goal**: update all JS files to use TS or TSX (latest version)

- ensure the files use typescript with proper types
- create a types file to hold common types definitions 
- component files should have their own props/interface defined within them


## End of Phase 2: check the app builds and ensure no typescript errors

