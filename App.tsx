import React, { useEffect } from 'react';
import usePresentations from './hooks/usePresentations';
import PresentationList from './components/PresentationList';
import PresentationEditor from './components/PresentationEditor';
import Loader from './components/Loader';

const App: React.FC = () => {
  const {
    presentations,
    currentPresentation,
    isLoading,
    actions,
  } = usePresentations();

  useEffect(() => {
    // On initial load, if there are no presentations, create a new one automatically.
    if (!isLoading && presentations.length === 0) {
      actions.createPresentation();
    }
  }, [isLoading, presentations, actions]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <Loader />
        <p className="mt-4">Loading Presentations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Presentation Designer
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            From raw ideas to polished slides with AI-powered research and design.
          </p>
        </header>
        <main className="bg-slate-800 rounded-xl shadow-2xl p-6 sm:p-8">
          {currentPresentation ? (
            <PresentationEditor
              key={currentPresentation.id} // Re-mount component on presentation change
              presentation={currentPresentation}
              onUpdatePresentation={actions.updatePresentation}
              onAddCheckpoint={actions.addCheckpoint}
              onRollback={actions.rollbackToCheckpoint}
              onExitEditor={actions.clearCurrentPresentation}
            />
          ) : (
            <PresentationList
              presentations={presentations}
              onCreate={actions.createPresentation}
              onSelect={actions.selectPresentation}
              onDelete={actions.deletePresentation}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;