import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartComponent = ({ title, xData, seriesData }) => {
  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <LineChart
        xAxis={[{ data: xData }]}
        series={[{ data: seriesData }]}
        width={500}
        height={300}
      />
    </div>
  )
}

export default LineChartComponent