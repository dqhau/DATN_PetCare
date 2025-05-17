import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const BookingStatsChart = () => {
  const [bookingStats, setBookingStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching booking stats...');
        
        const response = await axios.get('http://localhost:9999/statistics/bookings/by-status');
        
        console.log('Booking stats API response:', response.data);
        
        // Chuyển đổi dữ liệu để phù hợp với Recharts
        const formattedData = response.data.map(item => ({
          name: translateStatus(item._id),
          count: item.count,
          fill: getStatusColor(item._id)
        }));
        
        console.log('Formatted data for chart:', formattedData);
        setBookingStats(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking stats:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chuyển đổi tên trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch(status) {
      case 'Pending': return 'Đang chờ';
      case 'Processing': return 'Đang xử lý';
      case 'Completed': return 'Hoàn thành';
      case 'Cancel': return 'Đã hủy';
      default: return status;
    }
  };
  
  // Lấy màu sắc tương ứng với trạng thái
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#ffce56'; // Vàng
      case 'Processing': return '#36a2eb'; // Xanh dương
      case 'Completed': return '#4bc0c0'; // Xanh lá
      case 'Cancel': return '#ff6384'; // Đỏ
      default: return '#cccccc';
    }
  };

  return (
    <Card elevation={3} sx={{ p: 2, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Thống kê đặt lịch theo trạng thái
        </Typography>
        {loading ? (
          <Typography>Đang tải dữ liệu...</Typography>
        ) : (
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={bookingStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Số lượng đặt lịch" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingStatsChart;
