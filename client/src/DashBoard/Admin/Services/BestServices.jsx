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
} from "@mui/material";
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

const BestServices = () => {
  function formatCurrency(number) {
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        currency: "VND",
      });
    }
  }

  return (
    <Card
      elevation={3}
      sx={{ pt: "20px", mb: 3, ml: 6 }}
      style={{ width: "75vw" }}
    >
      <CardHeader>
        <Title>Top services</Title>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <TableHead>
            <TableRow>
              <TableCell sx={{ px: 3 }} colSpan={4}>
                Name Service
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Revenue
              </TableCell>
              <TableCell sx={{ px: 0 }} colSpan={2}>
                Service done
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody></TableBody>
        </ProductTable>
      </Box>
    </Card>
  );
};

export default BestServices;
