import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Box, Card, Grid, IconButton, styled, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Small } from "../Chart/Typography";
import axios from "axios";
const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main,
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const StatCards = () => {
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
  const [sumWeekSale, setSumWeekSale] = useState(0);
  const [totalOfProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate();
  
  const handleArrowClick = (index) => {
    console.log(index);
    navigate("/dashboard", { state: { selectedTab: index } });
  };
  
  // Lấy thống kê từ API mới
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log('Fetching dashboard stats in StatCards...');
        const response = await axios.get("http://localhost:9999/statistics/dashboard");
        console.log('Dashboard stats response in StatCards:', response.data);
        setDashboardStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchDashboardStats();
  }, []);

  function formatCurrency(number) {
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        currency: "VND",
      });
    }
    return "0";
  }

  useEffect(() => {
    fetch("http://localhost:9999/payment/calculate-total-amount-weekly")
      .then((resp) => resp.json())
      .then((data) => {
        setSumWeekSale(data.totalAmount);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  
  useEffect(() => {
    fetch("http://localhost:9999/payment/totalproducts")
      .then((resp) => resp.json())
      .then((data) => {
        setTotalProducts(data.totalProducts);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  
  const cardList = [
    {
      name: "Tổng đặt lịch",
      amount: `${dashboardStats.totalBookings} lịch hẹn`,
      icon: "pi pi-calendar",
      index: 0,
    },
    {
      name: "Tổng khách hàng",
      amount: `${dashboardStats.totalUsers} người dùng`,
      icon: "pi pi-user",
      index: 0,
    },
    {
      name: "Doanh thu trong tuần",
      amount: `${formatCurrency(sumWeekSale) + " ₫"} `,
      icon: "pi pi-money-bill",
      index: 0,
    },
    {
      name: "Tổng dịch vụ",
      amount: `${dashboardStats.totalServices} dịch vụ`,
      icon: "pi pi-shopping-cart",
      index: 1,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map((item, index) => (
        <Grid item xs={12} md={6} key={index}>
          <StyledCard elevation={6}>
            <ContentBox>
              <i className={item.icon} style={{ fontSize: "2.5rem" }}></i>
              <Box ml="12px">
                <Small>{item.name}</Small>
                <Heading>{item.amount}</Heading>
              </Box>
            </ContentBox>

            <Tooltip title="View Details" placement="top">
              <IconButton onClick={(e) => handleArrowClick(item.index)}>
                <ArrowRightAltIcon>arrow_right_alt</ArrowRightAltIcon>
              </IconButton>
            </Tooltip>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
