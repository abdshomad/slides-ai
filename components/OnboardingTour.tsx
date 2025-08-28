import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';

interface TourStep {
  target: string;
  title: string;
  content: string;
  view: string;
}

interface OnboardingTourProps {
  isOpen: boolean;
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ isOpen, step, stepIndex, totalSteps, onNext, onPrev, onSkip }) => {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [arrowPos, setArrowPos] = useState({ top: '', left: '', right: '', bottom: '' });
  
  useLayoutEffect(() => {
    if (isOpen && step) {
      let timeoutId: number;

      const findAndPosition = () => {
        const targetEl = document.querySelector<HTMLElement>(step.target);
        if (targetEl) {
          // Ensure the target element is visible before calculating its position
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

          // Delay to allow the smooth scroll animation to complete
          timeoutId = window.setTimeout(() => {
            const rect = targetEl.getBoundingClientRect();
            setTargetRect(rect);

            // --- Popover Position Calculation ---
            const popoverHeight = 200; // Estimated height
            const popoverWidth = 320;
            const spacing = 15;
            let top = rect.bottom + spacing;
            let left = rect.left + rect.width / 2 - popoverWidth / 2;
            let arrow = { top: '-0.375rem', left: '', right: '', bottom: '' };

            // Position popover above if it overflows the bottom of the viewport
            if (top + popoverHeight > window.innerHeight) {
              top = rect.top - popoverHeight - spacing;
              arrow = { top: 'auto', bottom: '-0.375rem', left: '', right: '' };
            }

            // Adjust horizontal position to stay within the viewport
            if (left < 10) {
                left = 10;
            }
            if (left + popoverWidth > window.innerWidth - 10) {
              left = window.innerWidth - popoverWidth - 10;
            }
            
            // Adjust arrow position based on horizontal adjustments
            const arrowLeftOffset = rect.left + rect.width / 2 - left;
            arrow.left = `calc(${arrowLeftOffset}px - 0.375rem)`;

            setPopoverPos({ top, left });
            setArrowPos(arrow);
          }, 300); // 300ms is a reasonable time for smooth scrolling
        } else {
          // If the target element isn't in the DOM yet, retry shortly
          timeoutId = window.setTimeout(findAndPosition, 300);
        }
      };

      findAndPosition();

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [isOpen, step]);


  if (!isOpen || !step || !targetRect) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="tour-highlight-area"
        style={{
          width: `${targetRect.width + 12}px`,
          height: `${targetRect.height + 12}px`,
          top: `${targetRect.top - 6}px`,
          left: `${targetRect.left - 6}px`,
        }}
      ></div>
      <div 
        className="tour-popover bg-[var(--background-muted)] border border-[var(--border-primary)] rounded-lg p-5 text-[var(--text-primary)] w-full animate-fade-in-fast"
        style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
        role="dialog"
        aria-labelledby="tour-title"
      >
        <div 
          className="tour-popover-arrow"
          style={{ ...arrowPos, borderColor: `var(--border-primary) transparent transparent var(--border-primary)` }}
        />
        <div className="flex justify-between items-start mb-2">
            <h3 id="tour-title" className="text-lg font-bold text-[var(--accent-DEFAULT)]">{step.title}</h3>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">{stepIndex + 1} / {totalSteps}</span>
        </div>
        <p className="text-[var(--text-secondary)] mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
            <button onClick={onSkip} className="text-sm text-[var(--text-secondary)] hover:underline">Skip Tour</button>
            <div className="flex gap-2">
                {stepIndex > 0 && (
                    <button onClick={onPrev} className="px-4 py-1.5 rounded-md text-sm text-[var(--text-primary)] hover:bg-[var(--background-interactive-hover)] transition-colors border border-[var(--border-secondary)]">Back</button>
                )}
                <button onClick={stepIndex === totalSteps - 1 ? onSkip : onNext} className="px-4 py-1.5 rounded-md text-sm text-white bg-[var(--accent-DEFAULT)] hover:bg-[var(--accent-hover)] transition-colors">
                    {stepIndex === totalSteps - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default OnboardingTour;
