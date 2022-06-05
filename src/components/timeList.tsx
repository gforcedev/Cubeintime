import { trpc } from '@/utils/trpc';
import { Time } from '@prisma/client';

import milliDisplay from '@/utils/milliDisplay';

const TimeList = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  return (
    <div className="flex justify-center pt-20">
      <div className="w-1/3 text-center m-12 h-64 overflow-scroll">
        {times &&
          times.map((t: Time) => {
            return (
              <div
                className="pt-3 pb-3 bg-purple-600 p-2 m-2 rounded"
                key={t.id}
              >
                {milliDisplay(t.time)}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TimeList;
