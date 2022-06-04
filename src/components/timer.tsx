import { Modes } from '@/utils/timerTypes';
import { useEffect, useState } from 'react';
import milliDisplay from '@/utils/milliDisplay';

const modeColors = {
  [Modes.ready]: 'text-green-600',
  [Modes.running]: '',
  [Modes.stopping]: 'text-red-600',
  [Modes.stopped]: '',
};

const TimerText: React.FC<{
  currentTime: number;
  currentMode: Modes;
  setCurrentTime: (n: number) => void;
}> = ({ currentTime, currentMode, setCurrentTime }) => {
  const [lastTick, setLastTick] = useState(Date.now());

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
    <div
      className={`
text-center text-4xl font-bold
${modeColors[currentMode]}
`}
    >
      {milliDisplay(currentTime)}
    </div>
  );
};

export default TimerText;
