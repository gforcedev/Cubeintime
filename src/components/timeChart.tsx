import { trpc } from '@/utils/trpc';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const TimeChart = () => {
  const timesQuery = trpc.useQuery(['getUserTimes']);
  const times = timesQuery.data;

  const barChartTimesMap =
    times
      ?.map((t) => {
        return (t.time - (t.time % 1000)) / 1000;
      })
      .reduce((freqs, time) => {
        let currentFreq = freqs.get(time);
        freqs.set(time, (currentFreq ?? 0) + 1);
        return freqs;
      }, new Map<number, number>()) ?? new Map<number, number>();

  const barChartTimes = [...barChartTimesMap]
    .map(([time, freq]) => ({
      time,
      freq,
    }))
    .sort((a, b) => a.time - b.time);

  return times ? (
    <div className="flex w-[50%] flex-col text-center">
      <ResponsiveContainer width="95%" height={300}>
        <BarChart data={barChartTimes}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="freq" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  ) : (
    <></>
  );
};

export default TimeChart;
