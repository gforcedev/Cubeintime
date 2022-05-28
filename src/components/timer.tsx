import { Modes } from '@/utils/timerTypes';

const modeColors = {
  [Modes.ready]: 'text-green-600',
  [Modes.running]: '',
  [Modes.stopping]: 'text-red-600',
  [Modes.stopped]: '',
};

const TimerText: React.FC<{ currentTime: number; currentMode: Modes }> = ({
  currentTime,
  currentMode,
}) => {
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

// TODO: 04:21.08
const milliDisplay = (s: number): string => {
  const ms = s % 1000;
  s = (s - ms) / 1000;
  const secs = s % 60;
  s = (s - secs) / 60;
  const mins = s % 60;
  const hrs = (s - mins) / 60;

  let timestring = [];

  if (hrs > 0) timestring.push(pad(hrs));
  if (mins > 0) timestring.push(pad(mins));
  timestring.push(`${mins > 0 ? pad(secs) : secs}.${pad(Math.floor(ms / 10))}`);

  return timestring.join(':');
};

const pad = (n: number): string => {
  const nString = n.toString();
  const lastTwo = nString.substring(0, 2);
  return `00${lastTwo}`.slice(-2);
};

export default TimerText;
