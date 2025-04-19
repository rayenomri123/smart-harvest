import React, {useState}  from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartComponent = ({ title, xData, seriesData }) => {
  const [dayValue, setDayValue] = useState(0);
  const [monthValue, setMonthValue] = useState(0);
  return (
    <div className="chart-container">
      <h3>{title} : {dayValue}/{monthValue}</h3>
      <LineChart
        xAxis={[
          {
            data: xData,
            scaleType: 'time',
            valueFormatter: (value) => {
              const date = new Date(value);
              // Format to DD/YYYY/MM HH:mm:ss in UTC
              const day = String(date.getUTCDate()).padStart(2, '0');
              setDayValue(day);
              const month = String(date.getUTCMonth() + 1).padStart(2, '0');
              setMonthValue(month);
              const year = date.getUTCFullYear();
              const hours = String((date.getUTCHours() + 1) % 24).padStart(2, '0');
              const minutes = String(date.getUTCMinutes()).padStart(2, '0');
              const seconds = String(date.getUTCSeconds()).padStart(2, '0');
              return `${hours}:${minutes}`;
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
