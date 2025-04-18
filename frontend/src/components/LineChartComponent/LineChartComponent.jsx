import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartComponent = ({ title, xData, seriesData }) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <LineChart
        xAxis={[
          {
            data: xData,
            scaleType: 'time',
            valueFormatter: (value) => {
              const date = new Date(value);
              // Format to DD/YYYY/MM HH:mm:ss in UTC
              const day = String(date.getUTCDate()).padStart(2, '0');
              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
              const year = date.getUTCFullYear();
              const hours = String((date.getUTCHours() + 1) % 24).padStart(2, '0');
              const minutes = String(date.getUTCMinutes()).padStart(2, '0');
              const seconds = String(date.getUTCSeconds()).padStart(2, '0');
              return `${day}/${month}  [${hours}:${minutes}:${seconds}]`;
            },
          },
        ]}
        series={[{ data: seriesData }]}
        width={500}
        height={300}
      />
    </div>
  );
};

export default LineChartComponent;