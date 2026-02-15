/**
 * Validation helper functions
 */

/**
 * Validates if a string is not empty after trimming
 * @param value - The string to validate
 * @returns True if valid, false otherwise
 */
export const isNonEmptyString = (value: any): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates room name format
 * @param roomName - The room name to validate
 * @returns True if valid, false otherwise
 */
export const isValidRoomName = (roomName: string): boolean => {
  return isNonEmptyString(roomName);
};

/**
 * Validates player name format
 * @param playerName - The player name to validate
 * @returns True if valid, false otherwise
 */
export const isValidPlayerName = (playerName: string): boolean => {
  return isNonEmptyString(playerName);
};
