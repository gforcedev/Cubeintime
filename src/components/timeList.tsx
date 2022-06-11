import { trpc } from '@/utils/trpc';
import { Time } from '@prisma/client';

import milliDisplay from '@/utils/milliDisplay';

const buttonStyles = 'bg-purple-700 rounded-full mx-1 p-2 text-center';

const TimeList = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  return (
    <div className="flex justify-center pt-20">
      <div className="w-1/3 m-12 h-64 overflow-scroll">
        {times &&
          times.map((t: Time) => {
            return (
              <div
                className="pt-3 pb-3 bg-purple-600 p-4 m-2 rounded group relative"
                key={t.id}
              >
                <div className="text-center w-full group-hover:-translate-x-[40%] transition-all">
                  {milliDisplay(t.time)}
                </div>

                {/* This won't work for mobile users */}
                <div className="absolute pt-1 inset-0 opacity-0 text-center block group-hover:visible group-hover:opacity-100 transition-opacity">
                  <button className={buttonStyles}>Good</button>
                  <button className={buttonStyles}>+2</button>
                  <button className={buttonStyles}>DNF</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TimeList;
