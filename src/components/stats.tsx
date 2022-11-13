import milliDisplay from '@/utils/milliDisplay';
import { trpc } from '@/utils/trpc';
import { Time } from '@prisma/client';

const Stats = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  return times ? (
    <div className="mb-10 flex w-full">
      {[5, 12, 50]
        .map((n) => ({ count: n, average: average(times, n) }))
        .map((a) => (
          <div className="grow px-48 text-center" key={a.count}>
            {`Ao${a.count}: ${a.average ? milliDisplay(a.average) : 'N/A'}`}
          </div>
        ))}
    </div>
  ) : (
    <></>
  );
};

function average(times: Time[], count: number): number | null {
  if (count > times.length || count < 3) {
    return null;
  }

  let avg = 0;
  let best: Time = { time: Infinity, penalty: null } as Time;
  let worst: Time = { time: -Infinity, penalty: null } as Time;

  for (let i = 0; i < count; i++) {
    const current = { ...times[i] } as Time;

    if (current?.penalty === 'PLUSTWO') {
      current.time += 2000;
    }

    if (worst?.penalty === 'DNF' && current?.penalty === 'DNF') {
      return null;
    }

    avg += current.time;

    if (current?.penalty === 'DNF') {
      worst = current;
    }

    if (current.time > worst.time && worst.penalty !== 'DNF') {
      worst = current;
      continue;
    }

    if (current.time < best.time && current.penalty !== 'DNF') {
      best = current;
    }
  }

  return (avg - best.time - worst.time) / (count - 2);
}

export default Stats;
