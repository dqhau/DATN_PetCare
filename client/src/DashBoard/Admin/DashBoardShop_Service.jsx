import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Coin, PersonWorkspace } from "react-bootstrap-icons";

const DashBoardShop_Service = () => {
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalServices, setTotalServices] = useState(0);

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
            <h5 className="text-muted">Doanh Thu Của Cửa Hàng</h5>
            <h2 className="mb-0">
              {formatCurrency(totalOrder.totalAmount) + " ₫"}
            </h2>
          </div>
          <div className="float-right icon-circle-medium icon-box-lg bg-info-light mt-1">
            <Coin style={{ color: "green", fontSize: "27px" }} />
          </div>
        </div>
      </div>
      <div className="carda">
        <div className="card-body">
          <div className="d-inline-block">
            <h5 className="text-muted">Doanh Thu Dịch Vụ</h5>
            <h2 className="mb-0">
              {formatCurrency(totalServices.totalAmount) + " ₫"}
            </h2>
          </div>
          <div className="float-right icon-circle-medium icon-box-lg bg-brand-light mt-1">
            <PersonWorkspace style={{ color: "green", fontSize: "27px" }} />
          </div>
        </div>
      </div>

      <div className="carda">
        <div className="card-body">
          <div className="d-inline-block">
            <h5 className="text-muted">Tổng</h5>
            <h2 className="mb-0">
              {formatCurrency(
                totalOrder.totalAmount + totalServices.totalAmount
              ) + " ₫"}
            </h2>
          </div>
          <div className="float-right icon-circle-medium icon-box-lg bg-info-light mt-1">
            <Coin style={{ color: "green", fontSize: "27px" }} />
          </div>

          <div className="float-right icon-circle-medium icon-box-lg bg-brand-light mt-1">
            <PersonWorkspace style={{ color: "green", fontSize: "27px" }} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DashBoardShop_Service;
