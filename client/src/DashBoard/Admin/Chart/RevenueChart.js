import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

const RevenueChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:9999/payment/monthly-revenue');
        const monthlyRevenue = response.data;

        const labels = monthlyRevenue.map(item => item.month);
        const data = monthlyRevenue.map(item => item.revenue);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Doanh Thu ',
              data,
              backgroundColor: '#42A5F5',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching monthly revenue data', error);
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
      <h3>Doanh Thu Theo Tháng</h3>
      <Chart type="line" data={chartData} options={options} />
    </div>
  );
};

export default RevenueChart;
