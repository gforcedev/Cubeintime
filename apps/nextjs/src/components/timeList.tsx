import { trpc } from '../utils/trpc';
import { Time } from '@prisma/client';

import milliDisplay from '../utils/milliDisplay';

const buttonStyles = 'bg-purple-700 rounded-full mx-1 p-2 text-center';

const TimeList = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  const trpcQueryClient = trpc.useContext();

  const deleteTimeMutation = trpc.useMutation('deleteTime', {
    onMutate: async ({ id }) => {
      // Cancel existing updates so that our optimistic update doesn't get overwritten
      await trpcQueryClient.cancelQuery(['getUserTimes']);

      // Check data exists to keep typescript happy
      let data = trpcQueryClient.getQueryData(['getUserTimes']);
      if (data) {
        trpcQueryClient.setQueryData(
          ['getUserTimes'],
          // Set id to -1 while deleting so it's rendered grayed-out
          data.map((t) => ({ ...t, id: t.id === id ? -1 : t.id }))
        );

        return { oldTimeList: data };
      }

      return null;
    },
    onError: (_, __, c) => {
      // Again, assert type of the context for typescript
      if (c) {
        let context = c as { oldTimeList: Time[] };
        trpcQueryClient.setQueryData(['getUserTimes'], context.oldTimeList);
      }
    },
    onSuccess: () => {
      trpcQueryClient.invalidateQuery(['getUserTimes']);
    },
  });

  const penaltyTimeMutation = trpc.useMutation('penaltyTime', {
    onMutate: async ({ id, penalty }) => {
      // Cancel existing updates so that our optimistic update doesn't get overwritten
      await trpcQueryClient.cancelQuery(['getUserTimes']);

      // Check data exists to keep typescript happy
      let data = trpcQueryClient.getQueryData(['getUserTimes']);
      if (data) {
        trpcQueryClient.setQueryData(
          ['getUserTimes'],
          data.map((t) => ({
            ...t,
            penalty: t.id === id ? penalty : t.penalty,
          }))
        );

        return { oldTimeList: data };
      }

      return null;
    },
    onError: (_, __, c) => {
      // Again, assert type of the context for typescript
      if (c) {
        let context = c as { oldTimeList: Time[] };
        trpcQueryClient.setQueryData(['getUserTimes'], context.oldTimeList);
      }
    },
    onSuccess: () => {
      trpcQueryClient.invalidateQuery(['getUserTimes']);
    },
  });

  return (
    <div className="flex justify-center">
      <div className="m-12 mt-0 h-64 w-1/3 overflow-scroll">
        {times &&
          times.map((t: Time) => {
            // For times which are being added or deleted, gray them out until
            // we get confirmation from the db that they were persisted
            if (t.id === -1)
              return (
                <div
                  className="group relative m-2 overflow-x-hidden rounded bg-gray-500 p-4 py-3"
                  key={t.id}
                >
                  <div
                    className={`w-full text-center transition-all group-hover:-translate-x-[40%] ${
                      t.penalty === 'DNF' ? 'line-through' : ''
                    }`}
                  >
                    {milliDisplay(
                      t.time + (t.penalty === 'PLUSTWO' ? 2000 : 0)
                    )}
                    {t.penalty === 'PLUSTWO' ? '+' : ''}
                  </div>
                </div>
              );
            return (
              <div
                className="group relative m-2 overflow-x-hidden rounded bg-purple-600 p-4 py-3"
                key={t.id}
              >
                <div
                  className={`w-full text-center transition-all group-hover:-translate-x-[40%] ${
                    t.penalty === 'DNF' ? 'line-through' : ''
                  }`}
                >
                  {milliDisplay(t.time + (t.penalty === 'PLUSTWO' ? 2000 : 0))}
                  {t.penalty === 'PLUSTWO' ? '+' : ''}
                </div>

                {/* This won't work for mobile users */}
                <div className="absolute inset-0 block pt-1 text-center opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
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
