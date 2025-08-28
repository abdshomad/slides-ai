import { LoadingStep } from './loadingSteps';

type ProgressCallback = (stepIndex: number, subStepIndex: number) => void;

export class ProgressSimulator {
    private intervalId: ReturnType<typeof setInterval> | null = null;
    private currentProgress = 0;
    private totalTicks = 0;

    constructor(
        private steps: LoadingStep[],
        private onProgress: ProgressCallback,
        private tickDuration: number = 1000
    ) {
        this.totalTicks = steps.reduce((acc, step) => acc + step.subSteps.length, 0);
    }

    start() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            this.currentProgress++;
            if (this.currentProgress > this.totalTicks) {
                this.stop();
                return;
            }

            let stepIndex = 0, subStepIndex = 0, progressCount = 0;
            for (let i = 0; i < this.steps.length; i++) {
                const step = this.steps[i];
                const nextProgressCount = progressCount + step.subSteps.length;
                if (this.currentProgress > nextProgressCount) {
                    progressCount = nextProgressCount;
                } else {
                    stepIndex = i;
                    subStepIndex = this.currentProgress - 1 - progressCount;
                    break;
                }
            }
            this.onProgress(stepIndex, subStepIndex);
        }, this.tickDuration);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
