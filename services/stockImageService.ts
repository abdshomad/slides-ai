import { StockImageResult } from '../types/api';

// Mock data to simulate API responses from Unsplash/Pexels
const mockImageData: StockImageResult[] = [
  // Business & Technology
  { id: '1', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=400&auto=format&fit=crop', description: 'Colleagues collaborating on a laptop in a modern office.', user: { name: 'Austin Distel', link: 'https://unsplash.com/@austindistel' } },
  { id: '2', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop', description: 'A team having a discussion in a bright meeting room.', user: { name: 'Mimi Thian', link: 'https://unsplash.com/@mthian' } },
  { id: '3', url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop', description: 'Overhead view of a team working on a project with laptops and gadgets.', user: { name: 'Marvin Meyer', link: 'https://unsplash.com/@marvelous' } },
  // Nature
  { id: '4', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1948&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=400&auto=format&fit=crop', description: 'A serene forest with a path leading through it.', user: { name: 'v2osk', link: 'https://unsplash.com/@v2osk' } },
  { id: '5', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2070&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=400&auto=format&fit=crop', description: 'Misty forest path with sunbeams shining through the trees.', user: { name: 'David Marcu', link: 'https://unsplash.com/@dmarcu' } },
  { id: '6', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=400&auto=format&fit=crop', description: 'Majestic mountains reflected in a clear lake.', user: { name: 'David Marcu', link: 'https://unsplash.com/@dmarcu' } },
  // Abstract & Creative
  { id: '7', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2070&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=400&auto=format&fit=crop', description: 'Purple and blue abstract gradient background.', user: { name: 'eberhard grossgasteiger', link: 'https://unsplash.com/@eberhardgross' } },
  { id: '8', url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1974&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=400&auto=format&fit=crop', description: 'Colorful abstract light trails creating a sense of motion.', user: { name: 'Jr Korpa', link: 'https://unsplash.com/@korpa' } },
  { id: '9', url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?q=80&w=1974&auto=format&fit=crop', thumbUrl: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?q=80&w=400&auto=format&fit=crop', description: 'Abstract swirling colors, purple and pink.', user: { name: 'Billy Huynh', link: 'https://unsplash.com/@billy_huy' } },
];

/**
 * Simulates searching for images from a stock photo API like Unsplash.
 * @param query The search term.
 * @returns A promise that resolves to an array of StockImageResult objects.
 */
export const searchStockImages = async (query: string): Promise<StockImageResult[]> => {
  console.log(`Simulating search for: "${query}"`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!query) {
    return mockImageData.slice(0, 6); // Return a few defaults if query is empty
  }

  const lowerCaseQuery = query.toLowerCase();
  
  // Simple keyword-based filtering logic
  if (lowerCaseQuery.includes('business') || lowerCaseQuery.includes('tech') || lowerCaseQuery.includes('office') || lowerCaseQuery.includes('meeting')) {
    return mockImageData.filter(img => ['1', '2', '3'].includes(img.id));
  }
  if (lowerCaseQuery.includes('nature') || lowerCaseQuery.includes('forest') || lowerCaseQuery.includes('mountain') || lowerCaseQuery.includes('landscape')) {
    return mockImageData.filter(img => ['4', '5', '6'].includes(img.id));
  }
  if (lowerCaseQuery.includes('abstract') || lowerCaseQuery.includes('creative') || lowerCaseQuery.includes('gradient') || lowerCaseQuery.includes('background')) {
    return mockImageData.filter(img => ['7', '8', '9'].includes(img.id));
  }
  if (lowerCaseQuery.includes('fail')) {
    return []; // Simulate a search with no results
  }

  // Return a random subset if no keywords match, to simulate a broad search
  return [...mockImageData].sort(() => 0.5 - Math.random()).slice(0, 6);
};