import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Card,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Paragraph } from "../Chart/Typography";
const CardHeader = styled(Box)(() => ({
  display: "flex",
  paddingLeft: "24px",
  paddingRight: "24px",
  marginBottom: "12px",
  alignItems: "center",
  justifyContent: "space-between",
}));

const Title = styled("span")(() => ({
  fontSize: "1rem",
  fontWeight: "500",
  textTransform: "capitalize",
}));

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  whiteSpace: "pre",
  "& small": {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
  },
  "& td": { borderBottom: "none" },
  "& td:first-of-type": { paddingLeft: "16px !important" },
}));

const Small = styled("small")(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: "#fff",
  padding: "2px 8px",
  borderRadius: "4px",
  overflow: "hidden",
  background: bgcolor,
  boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)",
}));

const TopSellingTable = () => {
  const [top3, setTop3] = useState([]);
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;
  useEffect(() => {
    fetch("http://localhost:9999/payment/top-products")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setTop3(data);
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
    <Card elevation={3} sx={{ pt: "20px", mb: 3 }} style={{ width: "75vw" }}>
      <CardHeader>
        <Title>Sản phẩm bán chạy </Title>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ px: 3 }} colSpan={4}>
                Tên sản phẩm
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Doanh thu
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Số lượng đã bán
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={1}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {top3.length === 0 ? (
              <p>Không có sản phẩm nào.</p>
            ) : (
              Array.isArray(top3) &&
              top3.map((product, index) => (
                <TableRow key={index} hover>
                  <TableCell
                    colSpan={4}
                    align="left"
                    sx={{ px: 0, textTransform: "capitalize" }}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar src={product.image[0]} />
                      <Paragraph sx={{ m: 0, ml: 4 }}>{product.name}</Paragraph>
                    </Box>
                  </TableCell>

                  <TableCell
                    align="left"
                    colSpan={2}
                    sx={{ px: 0, textTransform: "capitalize" }}
                  >
                    {formatCurrency(product.totalPrice) + "  ₫"}
                  </TableCell>

                  <TableCell
                    sx={{ px: 0 }}
                    style={{ paddingLeft: "40px" }}
                    colSpan={2}
                  >
                    {product.totalQuantity}
                  </TableCell>

                  <TableCell sx={{ px: 0 }} colSpan={1}>
                    <IconButton>
                      <EditIcon color="primary">edit</EditIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
};

const productList = [
  {
    imgUrl:
      "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/4eb226710c1d4baab6256b741b7d0be7_9366/gi%C3%A0y-ultraboost-light.jpg",
    name: "Ultraboost Light",
    price: 100,
    available: 15,
  },
  {
    imgUrl:
      "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/67e3732b3fee450092aae2724526d569_9366/gi%C3%A0y-superstar-slip-on.jpg",
    name: "Superstar Slip-On",
    price: 1500,
    available: 30,
  },
  {
    imgUrl:
      "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/4e5f3f5011d04322a1914a8aa7fd670d_9366/gi%C3%A0y-superstar.jpg",
    name: "Superstar",
    price: 1900,
    available: 35,
  },
  {
    imgUrl:
      "https://assets.adidas.com/images/w_766,h_766,f_auto,q_auto,fl_lossy,c_fill,g_auto/6bf90d60370e41df970a2a8b920aad5f_9366/stan-smith-pf-w.jpg",
    name: "Stan Smith PF W",
    price: 100,
    available: 0,
  },
  {
    imgUrl:
      "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/d8845335f0fd4b29928017b151b51fa4_9366/Giay_Superstar_XLG_nau_IF3701_04_standard.jpg",
    name: "TRAINER TRAE YOUNG 3 LOW",
    price: 1190,
    available: 5,
  },
];

export default TopSellingTable;
