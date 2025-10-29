export const STORAGE_KEYS = {
    PROGRESS: 'angul-it-progress',
    RESULTS: 'angul-it-progress-results'
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;