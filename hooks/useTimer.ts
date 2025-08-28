import { useState, useRef, useCallback, useEffect } from 'react';

const useTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const startTimer = useCallback(() => {
        if (intervalRef.current !== null) return;
        const startTime = Date.now();
        intervalRef.current = window.setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const resetTimer = useCallback(() => {
        stopTimer();
        setElapsedTime(0);
    }, [stopTimer]);

    useEffect(() => {
        // Cleanup on unmount
        return () => stopTimer();
    }, [stopTimer]);

    return { elapsedTime, startTimer, stopTimer, resetTimer };
};

export default useTimer;
