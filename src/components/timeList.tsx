import { trpc } from '@/utils/trpc';
import { Time } from '@prisma/client';

import milliDisplay from '@/utils/milliDisplay';

const buttonStyles = 'bg-purple-700 rounded-full mx-1 p-2 text-center';

const TimeList = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  const trpcQueryClient = trpc.useContext();

  const deleteTimeMutation = trpc.useMutation(['deleteTime'], {
    onSuccess: () => {
      trpcQueryClient.invalidateQueries('getUserTimes');
    },
  });
  const penaltyTimeMutation = trpc.useMutation(['penaltyTime'], {
    onSuccess: () => {
      trpcQueryClient.invalidateQueries('getUserTimes');
    },
  });

  return (
    <div className="flex justify-center">
      <div className="w-1/3 m-12 mt-0 h-64 overflow-scroll">
        {times &&
          times.map((t: Time) => {
            return (
              <div
                className="pt-3 pb-3 bg-purple-600 p-4 m-2 rounded group relative overflow-x-hidden"
                key={t.id}
              >
                <div
                  className={`text-center w-full group-hover:-translate-x-[40%] transition-all ${
                    t.penalty === 'DNF' ? 'line-through' : ''
                  }`}
                >
                  {milliDisplay(t.time + (t.penalty === 'PLUSTWO' ? 2000 : 0))}
                  {t.penalty === 'PLUSTWO' ? '+' : ''}
                </div>

                {/* This won't work for mobile users */}
                <div className="absolute pt-1 inset-0 opacity-0 text-center block group-hover:visible group-hover:opacity-100 transition-opacity">
                  <button
                    className={buttonStyles}
                    onClick={() =>
                      penaltyTimeMutation.mutate({ id: t.id, penalty: null })
                    }
                  >
                    Good
                  </button>
                  <button
                    className={buttonStyles}
                    onClick={() =>
                      penaltyTimeMutation.mutate({
                        id: t.id,
                        penalty: 'PLUSTWO',
                      })
                    }
                  >
                    +2
                  </button>
                  <button
                    className={buttonStyles}
                    onClick={() =>
                      penaltyTimeMutation.mutate({ id: t.id, penalty: 'DNF' })
                    }
                  >
                    DNF
                  </button>
                  <button
                    className={buttonStyles}
                    onClick={() => deleteTimeMutation.mutate({ id: t.id })}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TimeList;
