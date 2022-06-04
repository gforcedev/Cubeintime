import { trpc } from '@/utils/trpc';
import { Time } from '@prisma/client';

import milliDisplay from '@/utils/milliDisplay';

const TimeList = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  return (
    times &&
    times.map((t: Time) => {
      return (
        <div className="pt-2 bg-purple-600" key={t.id}>
          {milliDisplay(t.time)}
        </div>
      );
    })
  );
};

export default TimeList;
