import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { PersonWorkspace } from "react-bootstrap-icons";

const TotalServices = () => {

  const [totalServicesBooked, setTotalServicesBooked] = useState(0);

  useEffect(() => {
    fetch("http://localhost:9999/booking/total-services")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setTotalServicesBooked(data);
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
            <h5 className="text-muted">Tổng số dịch vụ đã đặt</h5>
            <h2 className="mb-0">
              {" "}
              {formatCurrency(totalServicesBooked.totalservicesBooked)}
            </h2>
          </div>
          <div className="float-right icon-circle-medium icon-box-lg bg-info-light mt-1">
          <PersonWorkspace style={{ color: "green", fontSize: "27px" }} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TotalServices;
