import { nanoid } from 'nanoid';

export default function generateUniqueId(): string {
  const id = nanoid();
  return id; // e.g., "f3G8Z1kL"
}
