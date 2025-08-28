import React, { useState, useEffect, useCallback } from 'react';
import usePresentations from './hooks/usePresentations';
import Loader from './components/Loader';
import useTheme from './hooks/useTheme';
import ViewManager from './components/ViewManager';
// FIX: Corrected import path for the View type.
import { View } from './types/index';
import OnboardingTour from './components/OnboardingTour';
import AppHeader from './components/AppHeader';
import { useOnboardingTour, tourSteps } from './hooks/useOnboardingTour';


const App: React.FC = () => {
  const {
    presentations,
    currentPresentation,
    isLoading,
    brandKit,
    actions,
  } = usePresentations();
  
  const [activeView, setActiveView] = useState<View>('main');
  const { theme, setTheme } = useTheme();

  const {
    isTourOpen,
    tourStep,
    tourStepIndex,
    totalSteps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
  } = useOnboardingTour();

  const handleStartTour = useCallback(() => {
    if (!currentPresentation) {
      actions.createPresentation('Onboarding Tour Presentation');
    }
    // Ensure we are in the main view for the start of the tour
    setActiveView('main');
    startTour();
  }, [currentPresentation, actions, startTour]);
  
  // This effect ensures the correct application view is displayed for the current tour step.
  useEffect(() => {
    if (isTourOpen) {
      const step = tourSteps[tourStepIndex];
      if (step.view !== activeView) {
        setActiveView(step.view);
      }
    }
  }, [tourStepIndex, isTourOpen, activeView]);

  // This effect automatically starts the tour for first-time users.
  useEffect(() => {
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (!tourCompleted) {
      // Use a timeout to ensure the UI has time to render before starting the tour.
      const timer = setTimeout(handleStartTour, 500);
      return () => clearTimeout(timer);
    }
  }, [handleStartTour]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--background-base)] text-[var(--text-primary)] flex flex-col items-center justify-center">
        <Loader />
        <p className="mt-4">Loading Presentations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[var(--text-primary)] flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <AppHeader 
          onStartTour={handleStartTour}
          theme={theme}
          setTheme={setTheme}
          setActiveView={setActiveView}
        />
        <main className="bg-[var(--background-muted)]/70 backdrop-blur-xl border border-[var(--border-primary)]/50 rounded-xl shadow-2xl p-6 sm:p-8">
            <ViewManager 
              activeView={activeView}
              setActiveView={setActiveView}
              presentations={presentations}
              currentPresentation={currentPresentation}
              actions={actions}
              brandKit={brandKit}
            />
        </main>
      </div>
       <OnboardingTour
        isOpen={isTourOpen}
        step={tourStep}
        stepIndex={tourStepIndex}
        totalSteps={totalSteps}
        onNext={nextStep}
        onPrev={prevStep}
        onSkip={skipTour}
      />
      <style>{`
        .animate-fade-in-fast {
          animation: fadeIn 0.15s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;