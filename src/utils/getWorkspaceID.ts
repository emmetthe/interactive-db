import { customAlphabet } from 'nanoid';

const UUID_KEY = 'uuid';
// Generates a random ID of 25 characters using the specified alphabet
const randomId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 25);

export const generateId = () => randomId();

export const getWorkspaceId = (): string => {
    let workspaceId = localStorage.getItem(UUID_KEY);

    if (!workspaceId) {
        workspaceId = randomId(8);
        localStorage.setItem(UUID_KEY, workspaceId);
    }

    return workspaceId;
};
