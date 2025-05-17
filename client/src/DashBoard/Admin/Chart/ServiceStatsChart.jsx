import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';

const ServiceStatsChart = () => {
  const [serviceStats, setServiceStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Màu sắc cho các dịch vụ
  const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching service stats...');
        const response = await axios.get('http://localhost:9999/statistics/services/top');
        console.log('Service stats API response:', response.data);
        
        // Chuyển đổi dữ liệu để phù hợp với Recharts
        const formattedData = response.data.map(item => ({
          name: item.service_name,
          value: item.count
        }));
        
        console.log('Formatted service data:', formattedData);
        setServiceStats(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service stats:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Component hiển thị nhãn trên biểu đồ
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card elevation={3} sx={{ p: 2, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dịch vụ được đặt nhiều nhất
        </Typography>
        {loading ? (
          <Typography>Đang tải dữ liệu...</Typography>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={serviceStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceStatsChart;
