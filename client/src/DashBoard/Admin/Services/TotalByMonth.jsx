import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

const TotalByMonth = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9999/booking/revenue-by-service-type');
        const revenueByServiceType = response.data.revenueByServiceType;
        const labels = Object.keys(revenueByServiceType);
        const data = Object.values(revenueByServiceType);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Doanh Thu theo Loại Dịch Vụ',
              data,
              backgroundColor: ['#42A5F5', '#66BB6A', '#FFCA28', '#EF5350'], 
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching revenue by service type data', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <div style={{ height: '305px' }}>
      <h3>Doanh Thu Theo Loại Dịch Vụ</h3>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default TotalByMonth;