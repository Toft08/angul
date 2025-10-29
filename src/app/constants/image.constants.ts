export const IMAGE_CATEGORIES = {
    darts: ['DL.jpg', 'JDG.jpg', 'OL.jpg', 'SL.jpg'],
    discs: ['buzzz.jpg', 'fd3.jpg', 'reko.jpg', 'zone.jpg'],
    targets: ['BD.jpg', 'DK.jpg', 'DKP.jpg', 'WD.jpg']
} as const;

export type ImageCategory = keyof typeof IMAGE_CATEGORIES;

// Helper function to get images for a category with proper typing
export function getImagesForCategory(category: ImageCategory): string[] {
    return [...IMAGE_CATEGORIES[category]];
}

// Helper function to get category from filename
export function getCategoryFromFilename(filename: string): ImageCategory | 'unknown' {
    for (const [category, images] of Object.entries(IMAGE_CATEGORIES)) {
        if ((images as readonly string[]).includes(filename)) {
            return category as ImageCategory;
        }
    }
    return 'unknown';
}