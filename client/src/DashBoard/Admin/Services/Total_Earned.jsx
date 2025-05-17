import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Coin } from "react-bootstrap-icons";

const Total_Earned = () => {
  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    fetch("http://localhost:9999/booking/revenue-services")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setTotalServices(data);
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
    <Container fluid>
      <div className="carda">
        <div className="card-body">
          <div className="d-inline-block">
            <h5 className="text-muted">Tổng số tiền kiếm được</h5>
            <h2 className="mb-0">
              {" "}
              {formatCurrency(totalServices.totalAmount) + " ₫"}
            </h2>
          </div>
          <div className="float-right icon-circle-medium icon-box-lg bg-brand-light mt-1">
            <Coin style={{ color: "green", fontSize: "27px" }} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Total_Earned;
