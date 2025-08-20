'use client';

import { ResponsiveLine } from '@nivo/line';

export default function BloodPressureChart({ data }: { data: BPDataType[] }) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 40, right: 40, bottom: 60, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', stacked: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        legend: 'Date',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        legend: 'Blood Pressure (mmHg)',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      colors={{ scheme: 'set1' }}
      lineWidth={3}
      pointSize={8}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      useMesh={true}
      enableArea={false}
    />
  );
}

type BPDataType = {
  id: string,
  color?: string,
  data: EntryType[]
};

type EntryType = {
  x: string,
  y: number
};
