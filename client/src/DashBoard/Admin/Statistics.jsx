import React, { useState, useEffect } from "react";
import { Container, Row, Card } from "react-bootstrap";
import { Typography, Grid } from "@mui/material";
import axios from "axios";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistics = () => {
  const [loading, setLoading] = useState(true);
  const [basicStats, setBasicStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    totalBookings: 0,
    totalServices: 0
  });
  const [userStats, setUserStats] = useState({ year: new Date().getFullYear(), data: Array(12).fill(0) });
  const [petStats, setPetStats] = useState({ year: new Date().getFullYear(), data: Array(12).fill(0) });
  const [bookingStats, setBookingStats] = useState({ year: new Date().getFullYear(), data: Array(12).fill(0) });
  const [topServices, setTopServices] = useState([]);
  const [currentYear] = useState(new Date().getFullYear());

  // Màu sắc cho biểu đồ
  const COLORS = {
    users: "#0088FE",
    pets: "#00C49F",
    bookings: "#FFBB28",
    services: "#FF8042"
  };

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        console.log('Fetching all statistics...');
        setLoading(true);
        
        // Lấy thống kê cơ bản
        const basicResponse = await axios.get('http://localhost:9999/statistics/basic');
        console.log('Basic stats response:', basicResponse.data);
        setBasicStats(basicResponse.data);
        
        // Lấy thống kê người dùng theo tháng
        const userResponse = await axios.get('http://localhost:9999/statistics/users/by-month');
        console.log('User stats response:', userResponse.data);
        setUserStats(userResponse.data);
        
        // Lấy thống kê thú cưng theo tháng
        const petResponse = await axios.get('http://localhost:9999/statistics/pets/by-month');
        console.log('Pet stats response:', petResponse.data);
        setPetStats(petResponse.data);
        
        // Lấy thống kê đặt lịch theo tháng
        const bookingResponse = await axios.get('http://localhost:9999/statistics/bookings/by-month');
        console.log('Booking stats response:', bookingResponse.data);
        setBookingStats(bookingResponse.data);
        
        // Lấy thống kê dịch vụ phổ biến
        const servicesResponse = await axios.get('http://localhost:9999/statistics/services/top');
        console.log('Top services response:', servicesResponse.data);
        setTopServices(servicesResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  // Chuyển đổi dữ liệu thống kê theo tháng thành định dạng cho biểu đồ
  const getMonthlyChartData = (data) => {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    return data.map((count, index) => ({
      name: monthNames[index],
      count: count
    }));
  };

  return (
    <Container fluid>
      <Row style={{ marginLeft: "30px", width: "100%", marginTop: "30px" }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Thống kê
        </Typography>

        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <>
            {/* Thống kê tổng quan */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card className="text-center p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Tổng người dùng</Card.Title>
                  <Card.Body>
                    <h2>{basicStats.totalUsers}</h2>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card className="text-center p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Tổng thú cưng</Card.Title>
                  <Card.Body>
                    <h2>{basicStats.totalPets}</h2>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card className="text-center p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Tổng đặt lịch</Card.Title>
                  <Card.Body>
                    <h2>{basicStats.totalBookings}</h2>
                  </Card.Body>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card className="text-center p-3 mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Tổng dịch vụ</Card.Title>
                  <Card.Body>
                    <h2>{basicStats.totalServices}</h2>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid>

            {/* Biểu đồ người dùng và thú cưng theo tháng */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Card className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Người dùng và thú cưng mới theo tháng năm {currentYear}</Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          allowDuplicatedCategory={false} 
                          data={getMonthlyChartData(userStats.data)} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          dataKey="count" 
                          data={getMonthlyChartData(userStats.data)} 
                          name="Người dùng mới" 
                          stroke={COLORS.users} 
                          strokeWidth={2} 
                        />
                        <Line 
                          dataKey="count" 
                          data={getMonthlyChartData(petStats.data)} 
                          name="Thú cưng mới" 
                          stroke={COLORS.pets} 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid>

            {/* Biểu đồ đặt lịch theo tháng */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <Card className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Đặt lịch theo tháng năm {currentYear}</Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={getMonthlyChartData(bookingStats.data)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Số lượng đặt lịch" fill={COLORS.bookings} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid>

            {/* Biểu đồ dịch vụ phổ biến */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
                  <Card.Title>Dịch vụ được đặt nhiều nhất</Card.Title>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={topServices}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="service_name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Số lượng đặt" fill={COLORS.services} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Row>
    </Container>
  );
};

export default Statistics;
