export const STORAGE_KEYS = {
    PROGRESS: 'angul-it-progress',
    RESULTS: 'angul-it-progress-results',
    CHALLENGE_SET: 'angul-it-challenge-set'
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;