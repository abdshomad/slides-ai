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

const getSlideTextBlocks = (outline: string): string[] => {
    const lines = outline.split('\n');
    const blocks: string[] = [];
    let currentBlock: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        const isBullet = /^\s*([-*]|\d+\.)\s+/.test(trimmedLine);

        if (!isBullet && trimmedLine !== '') { // It's a title
            if (currentBlock.length > 0) {
                blocks.push(currentBlock.join('\n'));
            }
            currentBlock = [line];
        } else if (trimmedLine !== '' || currentBlock.length > 0) { // Add blank lines only after a title has started
            currentBlock.push(line);
        }
    }

    if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n'));
    }
    
    // Trim trailing newlines from each block to prevent excessive spacing
    return blocks.map(block => block.trimEnd());
};

export const updateSlideContentInOutline = (outline: string, slideIndex: number, newContent: { title: string, bulletPoints: string[] }): string => {
    const blocks = getSlideTextBlocks(outline);
    if (slideIndex < 0 || slideIndex >= blocks.length) {
        return outline; // Index out of bounds
    }

    const oldBlock = blocks[slideIndex];
    const layoutRegex = /\[LAYOUT:\s*([^\]]+)\]/;
    const layoutMatch = oldBlock.match(layoutRegex);
    const layoutTag = layoutMatch ? layoutMatch[0] : '[LAYOUT: DEFAULT]'; // Default if none found

    let newBlock = `${layoutTag} ${newContent.title}`.trim();

    if (newContent.bulletPoints && newContent.bulletPoints.length > 0) {
        newBlock += '\n' + newContent.bulletPoints.map(p => `- ${p}`).join('\n');
    }

    blocks[slideIndex] = newBlock;

    return blocks.join('\n\n');
};

export const removeSlideFromOutline = (outline: string, slideIndex: number): string => {
    const blocks = getSlideTextBlocks(outline);
    if (slideIndex < 0 || slideIndex >= blocks.length) {
        return outline;
    }
    blocks.splice(slideIndex, 1);
    return blocks.join('\n\n');
};

export const addSlideToOutline = (outline: string, slideIndex: number): string => {
    const blocks = getSlideTextBlocks(outline);
    const newSlideText = '[LAYOUT: DEFAULT] New Slide\n- Add content here';

    if (slideIndex < 0 || slideIndex > blocks.length) {
        blocks.push(newSlideText);
    } else {
        blocks.splice(slideIndex, 0, newSlideText);
    }
    
    return blocks.join('\n\n');
};