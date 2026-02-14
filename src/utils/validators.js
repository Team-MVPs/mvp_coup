/**
 * Validation helper functions
 */

/**
 * Validates if a string is not empty after trimming
 * @param {string} value - The string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isNonEmptyString = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates room name format
 * @param {string} roomName - The room name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidRoomName = (roomName) => {
  return isNonEmptyString(roomName);
};

/**
 * Validates player name format
 * @param {string} playerName - The player name to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidPlayerName = (playerName) => {
  return isNonEmptyString(playerName);
};
