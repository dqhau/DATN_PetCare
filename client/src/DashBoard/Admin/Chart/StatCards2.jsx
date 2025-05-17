import Moving from "@mui/icons-material/Moving";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Card,
  Fab,
  Grid,
  Icon,
  lighten,
  styled,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
const ContentBox = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
}));

const FabIcon = styled(Fab)(() => ({
  width: "44px !important",
  height: "44px !important",
  boxShadow: "none !important",
}));

const H3 = styled("h3")(({ textcolor }) => ({
  margin: 0,
  color: textcolor,
  fontWeight: "500",
  marginLeft: "12px",
}));

const H1 = styled("h1")(({ theme }) => ({
  margin: 0,
  flexGrow: 1,
  color: theme.palette.text.secondary,
}));

const Span = styled("span")(({ textcolor }) => ({
  fontSize: "13px",
  color: textcolor,
  marginLeft: "4px",
}));

const IconBox = styled("div")(() => ({
  width: 16,
  height: 16,
  color: "#fff",
  display: "flex",
  overflow: "hidden",
  borderRadius: "300px ",
  justifyContent: "center",
  "& .icon": { fontSize: "14px" },
}));

const StatCards2 = () => {
  const { palette } = useTheme();
  const [totalOrder, setTotalOrder] = useState(0);
  const textError = palette.error.main;
  const bgError = lighten(palette.error.main, 0.85);

  useEffect(() => {
    fetch("http://localhost:9999/payment/calculate-total-amount")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setTotalOrder(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        currency: "VND",
      });
    }
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {/* <Grid item xs={12} md={6}>
        <Card elevation={3} sx={{ p: 2 }}>
          <ContentBox>
            <FabIcon
              size="medium"
              sx={{ background: "rgba(9, 182, 109, 0.15)" }}
            >
              <Moving sx={{ color: "#08ad6c" }} />
            </FabIcon>
            <H3 textcolor={"#08ad6c"}>Active Users</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>10.8k</H1>
            <IconBox sx={{ background: "rgba(9, 182, 109, 0.15)" }}>
              <Icon className="icon">expand_less</Icon>
            </IconBox>
            <Span textcolor={"#08ad6c"}>(+21%)</Span>
          </ContentBox>
        </Card>
      </Grid> */}

      <Grid item xs={12} md={12}>
        <Card elevation={3} sx={{ p: 2 }} style={{ height: "336px" }}>
          <ContentBox>
            <FabIcon
              size="medium"
              sx={{ background: bgError, overflow: "hidden" }}
            >
              <StarBorderIcon sx={{ color: textError }}>
                star_outline
              </StarBorderIcon>
            </FabIcon>
            <H3 textcolor={textError}>Tổng doanh thu</H3>
          </ContentBox>

          <ContentBox sx={{ pt: 2 }}>
            <H1>{formatCurrency(totalOrder.totalAmount) + " ₫"}</H1>
            <IconBox sx={{ background: bgError }}>
              <Icon className="icon">expand_less</Icon>
            </IconBox>
            <Span textcolor={textError}>(+21%)</Span>
          </ContentBox>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatCards2;
