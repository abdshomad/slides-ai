import { AppState } from '../../types/index';

export interface ActionContext {
    currentState: AppState;
    createCheckpoint: (action: string, state: AppState) => void;
}
