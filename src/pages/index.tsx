import TimerText from '@/components/timer';
import { Modes } from '@/utils/timerTypes';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentMode, setCurrentMode] = useState(Modes.stopped);
  const [lastTick, setLastTick] = useState(Date.now());

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key == ' ') {
        switch (currentMode) {
          case Modes.stopped: {
            setCurrentMode(Modes.ready);
            setCurrentTime(0);
            break;
          }
          case Modes.running: {
            setCurrentMode(Modes.stopping);
            break;
          }
        }
      }
    };

    const handleKeyup = (e: KeyboardEvent) => {
      if (e.key == ' ') {
        switch (currentMode) {
          case Modes.ready: {
            setCurrentMode(Modes.running);
            break;
          }
          case Modes.stopping: {
            setCurrentMode(Modes.stopped);
            break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
    };
  }, [currentTime, currentMode, lastTick]);

  useEffect(() => {
    setTimeout(() => {
      const rightNow = Date.now();
      if (currentMode === Modes.running) {
        setCurrentTime(currentTime + (rightNow - lastTick));
      }
      setLastTick(rightNow);
    }, 10);
  });

  return (
    <>
      <div className="pt-4 text-xl text-center">Cubeintime</div>

      <div className="flex justify-center pt-4">
        <TimerText
          currentTime={currentTime}
          currentMode={currentMode}
        ></TimerText>
      </div>
    </>
  );
};

export default Home;
