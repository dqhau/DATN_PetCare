import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import StatCards from "./Chart/StartCard";
import TopSellingTable from "./Chart/TopSellingTable";
import StatCards2 from "./Chart/StatCards2";
import { Card, Grid, styled, useTheme, Typography } from "@mui/material";
import BookingStatsChart from "./Chart/BookingStatsChart";
import ServiceStatsChart from "./Chart/ServiceStatsChart";
import MonthlyBookingChart from "./Chart/MonthlyBookingChart";
import axios from "axios";

const TotalDashBoard = () => {
  const { palette } = useTheme();
  const Title = styled("span")(() => ({
    fontSize: "1rem",
    fontWeight: "500",
    marginRight: ".5rem",
    textTransform: "capitalize",
  }));
  const SubTitle = styled("span")(({ theme }) => ({
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  }));
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 0,
    bookingsByStatus: {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0
    },
    totalUsers: 0,
    totalServices: 0
  });
  
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log('Fetching dashboard stats...');
        const response = await axios.get('http://localhost:9999/statistics/dashboard');
        console.log('Dashboard stats response:', response.data);
        setDashboardStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchDashboardStats();
  }, []);
  
  return (
    <Container fluid>
      <Row style={{ marginLeft: "30px", width: "100%", marginTop: "30px" }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Thống kê tổng quan
        </Typography>
        
        <StatCards />
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <BookingStatsChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ServiceStatsChart />
          </Grid>
        </Grid>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <MonthlyBookingChart />
          </Grid>
        </Grid>
        
        <TopSellingTable />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatCards2 />
          </Grid>
        </Grid>
      </Row>
    </Container>
  );
};

export default TotalDashBoard;
