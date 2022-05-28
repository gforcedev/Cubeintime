import TimerText from '@/components/timer';
import { Modes } from '@/utils/timerTypes';
import type { NextPage } from 'next';
import { memo, useEffect, useState } from 'react';

const MemoizedTimerText = memo(TimerText);

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentMode, setCurrentMode] = useState(Modes.stopped);

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
  }, [currentMode]);

  return (
    <>
      <div className="pt-4 text-xl text-center">Cubeintime</div>

      <div className="flex justify-center pt-4">
        <MemoizedTimerText
          currentTime={currentTime}
          currentMode={currentMode}
          setCurrentTime={setCurrentTime}
        ></MemoizedTimerText>
      </div>
    </>
  );
};

export default Home;
