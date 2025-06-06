
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface RainfallData {
  labels: string[];
  data: number[];
}

const HistoricalRainfallChart: React.FC<{ rainfallData: RainfallData }> = ({ rainfallData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels: rainfallData.labels,
          datasets: [
            {
              label: 'Rainfall (mm)',
              data: rainfallData.data,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Historical Rainfall',
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, [rainfallData]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default HistoricalRainfallChart;
