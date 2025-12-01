import { customAlphabet } from 'nanoid';

// Generates a random ID of 25 characters using the specified alphabet
const randomId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 25);

export const generateId = () => randomId();

// For generating shorter workspace IDs (8 characters)
export const getWorkspaceId = () => randomId(8);