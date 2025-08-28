import { useState, useCallback } from 'react';
// FIX: Correct import path for types
import { Slide } from '../types/index';

declare global {
  interface Window {
    htmlToImage: any;
  }
}

const useSlideExport = (
  slideContentRef: React.RefObject<HTMLDivElement>,
  slide: Slide | null,
  slideNumber: number
) => {
  const [isExporting, setIsExporting] = useState(false);

  const captureSlideAsBase64 = useCallback(async (pixelRatio: number = 1.5): Promise<string> => {
    if (!slideContentRef.current) {
        throw new Error("Slide content ref is not available.");
    }
    const dataUrl = await window.htmlToImage.toPng(slideContentRef.current, { cacheBust: true, pixelRatio });
    const base64Data = dataUrl.split(',')[1];
    if (!base64Data) {
        throw new Error("Failed to convert captured image to base64.");
    }
    return base64Data;
  }, [slideContentRef]);

  const exportSlide = useCallback(async () => {
    if (!slide) return;
    setIsExporting(true);
    try {
        const base64Png = await captureSlideAsBase64(2); // Higher quality for export
        const link = document.createElement('a');
        link.download = `slide_${slideNumber}_${slide.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        link.href = `data:image/png;base64,${base64Png}`;
        link.click();
    } catch (err) {
        console.error('Failed to export slide as image:', err);
    } finally {
        setIsExporting(false);
    }
  }, [slide, slideNumber, captureSlideAsBase64]);

  return { isExporting, exportSlide, captureSlideAsBase64 };
};

export default useSlideExport;