import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const MonthlyBookingChart = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching monthly booking stats...');
        const response = await axios.get('http://localhost:9999/statistics/bookings/by-month');
        console.log('Monthly booking API response:', response.data);
        
        // Tên các tháng
        const monthNames = [
          'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
          'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        
        // Chuyển đổi dữ liệu để phù hợp với Recharts
        const formattedData = response.data.data.map((count, index) => ({
          name: monthNames[index],
          count: count
        }));
        
        console.log('Formatted monthly data:', formattedData);
        setBookingData(formattedData);
        setYear(response.data.year);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching monthly booking data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card elevation={3} sx={{ p: 2, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê đặt lịch theo tháng năm {year}
        </Typography>
        {loading ? (
          <Typography>Đang tải dữ liệu...</Typography>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={bookingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Số lượng đặt lịch" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyBookingChart;
