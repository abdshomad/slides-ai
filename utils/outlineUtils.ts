/**
 * Updates the layout tag for a specific slide within a raw outline string.
 * @param outline The full outline text.
 * @param slideIndex The zero-based index of the slide to update.
 * @param newLayout The new layout string (e.g., 'DEFAULT').
 * @returns The updated outline string.
 */
export const updateLayoutInOutline = (outline: string, slideIndex: number, newLayout: string): string => {
    const lines = outline.split('\n');
    let slideTitleCount = -1;
    let targetLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine === '') continue;
        
        const isBullet = /^\s*([-*]|\d+\.)\s+/.test(trimmedLine);
        if (!isBullet) {
            slideTitleCount++;
            if (slideTitleCount === slideIndex) {
                targetLineIndex = i;
                break;
            }
        }
    }

    if (targetLineIndex !== -1) {
        const layoutRegex = /\[LAYOUT:\s*([^\]]+)\]/;
        const oldLine = lines[targetLineIndex];
        let newLine = '';
        if (layoutRegex.test(oldLine)) {
            newLine = oldLine.replace(layoutRegex, `[LAYOUT: ${newLayout}]`);
        } else {
            // If for some reason there's no layout tag, add one.
            newLine = `[LAYOUT: ${newLayout}] ${oldLine.trim()}`;
        }
        lines[targetLineIndex] = newLine;
        return lines.join('\n');
    }

    return outline; // Return original if slide not found
};
