import React from 'react';
// FIX: Correct import path for types
import { PresentationProject } from '../types/index';
import PRDViewer from './docs/PRDViewer';
import SamplePresentationViewer from './docs/SamplePresentationViewer';
import PresentationEditor from './PresentationEditor';
import PresentationList from './PresentationList';

export type View = 'main' | 'prd' | 'sample';

interface ViewManagerProps {
    activeView: View;
    setActiveView: (view: View) => void;
    presentations: PresentationProject[];
    currentPresentation: PresentationProject | null;
    actions: {
        createPresentation: (title?: string) => void;
        deletePresentation: (id: string) => void;
        updatePresentation: (id: string, updates: Partial<PresentationProject>) => void;
        addCheckpoint: (id: string, action: string, state: any) => void;
        rollbackToCheckpoint: (id: string, checkpointIndex: number) => void;
        selectPresentation: (id: string) => void;
        clearCurrentPresentation: () => void;
    };
}

const ViewManager: React.FC<ViewManagerProps> = ({ activeView, setActiveView, presentations, currentPresentation, actions }) => {
    switch (activeView) {
        case 'prd':
            return <PRDViewer onBack={() => setActiveView('main')} />;
        case 'sample':
            return <SamplePresentationViewer onBack={() => setActiveView('main')} />;
        case 'main':
        default:
            return currentPresentation ? (
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
            );
    }
};

export default ViewManager;