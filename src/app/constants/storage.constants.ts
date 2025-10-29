export const STORAGE_KEYS = {
    PROGRESS: 'angul-it-progress',
    RESULTS: 'angul-it-progress-results',
    CHALLENGES: 'angul-it-challenges'
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;