import TimerText from '@/components/timer';
import TimeList from '@/components/timeList';
import { signIn, signOut } from 'next-auth/react';
import { Modes } from '@/utils/timerTypes';
import { trpc } from '@/utils/trpc';
import type { NextPage } from 'next';
import { memo, useEffect, useState } from 'react';
import { randomScrambleForEvent } from 'cubing/scramble';
import { useQuery, useQueryClient } from 'react-query';
import Link from 'next/link';
import Stats from '@/components/stats';

const MemoizedTimerText = memo(TimerText);

const Home: NextPage = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentMode, setCurrentMode] = useState(Modes.stopped);
  const currentScramble = useQuery('scramble', () => {
    return randomScrambleForEvent('333');
  });
  const scrambleData = currentScramble.data;

  const queryClient = useQueryClient();
  const trpcQueryClient = trpc.useContext();
  const addTimeMutation = trpc.useMutation('addTime', {
    onSuccess: () => {
      trpcQueryClient.invalidateQueries('getUserTimes');
      queryClient.invalidateQueries('scramble');
    },
  });

  const sessionQuery = trpc.useQuery(['next-auth.getSession']);
  const session = sessionQuery.data;

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
            if (scrambleData) {
              addTimeMutation.mutate({
                time: currentTime,
                scramble: scrambleData?.toString(),
              });
            }
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
  }, [currentMode, addTimeMutation, currentTime, scrambleData]);

  return (
    <>
      <div className="bg-red-700">
        {' '}
        {session ? (
          <>
            Signed in as {session?.user?.email} <br />
          </>
        ) : (
          <>
            Not signed in <br />
          </>
        )}{' '}
        <button
          className="btn"
          onClick={
            session
              ? () => {
                  signOut();
                }
              : () => {
                  signIn();
                }
          }
        >
          {session ? 'Sign Out' : 'Sign In'}
        </button>
      </div>
      <div className="pt-4 text-xl text-center">Cubeintime</div>
      <div className="pt-4 text-l text-center">
        {scrambleData ? scrambleData.toString() : 'generating scramble...'}
      </div>

      <div className="flex justify-center pt-4">
        <MemoizedTimerText
          currentTime={currentTime}
          currentMode={currentMode}
          setCurrentTime={setCurrentTime}
        ></MemoizedTimerText>
      </div>
      <div className="pt-20"></div>
      <Stats />
      <TimeList />
      <div className="w-full text-xl text-center pb-2">
        <a href="https://github.com/gforcedev/Cubeintime/blob/main/PRIVACY.md">
          Privacy
        </a>
      </div>
    </>
  );
};

export default Home;
