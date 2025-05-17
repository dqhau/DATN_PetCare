import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';

const TotalBreed = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9999/booking/pet-breeds');
      const { maleCount, femaleCount } = response.data;
      setMaleCount(maleCount);
      setFemaleCount(femaleCount);
    } catch (error) {
      console.error('Error fetching pet breeds data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const data = {
      labels: ['Đực', 'Cái'],
      datasets: [
        {
          data: [maleCount, femaleCount],
          backgroundColor: ['#42A5F5', '#66BB6A'], // Màu sắc cho các cột
          hoverBackgroundColor: ['#64B5F6', '#81C784'], // Màu sắc khi hover
        },
      ],
    };

    setChartData(data);
  }, [maleCount, femaleCount]);

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
    <div>
      <h3>Thống kê theo giống</h3>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
};

export default TotalBreed;