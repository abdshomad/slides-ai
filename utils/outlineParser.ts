
export interface ParsedSlide {
  title: string;
  points: string[];
  layout: string;
}

/**
 * Parses a markdown-like text outline into an array of slide objects.
 * @param text The raw string outline.
 * @returns An array of ParsedSlide objects.
 */
export const parseOutline = (text: string): ParsedSlide[] => {
  if (!text) return [];

  const lines = text.split('\n').filter(line => line.trim() !== '');
  const slides: ParsedSlide[] = [];
  let currentSlide: ParsedSlide | null = null;
  const layoutRegex = /\[LAYOUT:\s*([^\]]+)\]/;

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Regex to detect bullet points (-, *, or number followed by .)
    const isBullet = /^\s*([-*]|\d+\.)\s+/.test(trimmedLine);

    if (isBullet && currentSlide) {
      // It's a bullet point for the current slide
      currentSlide.points.push(
        trimmedLine.replace(/^\s*([-*]|\d+\.)\s+/, '')
      );
    } else if (!isBullet) {
      // It's a title for a new slide. Push the previous one if it exists.
      if (currentSlide) {
        // Only push if it has a title or points
        if (currentSlide.title || currentSlide.points.length > 0) {
            slides.push(currentSlide);
        }
      }
      
      const layoutMatch = trimmedLine.match(layoutRegex);
      const layout = layoutMatch ? layoutMatch[1].trim() : 'ONE_COLUMN_TEXT'; // Default layout
      const title = trimmedLine.replace(layoutRegex, '').trim()
                      .replace(/^(slide\s*\d+\s*[:.-]?\s*)/i, '')
                      .replace(/^(\d+\.\s*)/, '');
      // Start a new slide
      currentSlide = {
        title: title,
        points: [],
        layout: layout
      };
    }
  }

  // Add the last slide to the array
  if (currentSlide && (currentSlide.title || currentSlide.points.length > 0)) {
    slides.push(currentSlide);
  }

  return slides;
};