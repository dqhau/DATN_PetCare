import React from "react";
import "../../../style/totalService.css";
import Total_Earned from "./Total_Earned";
import TotalServices from "./TotalServices";
import TotalBreed from "./TotalBreed";
import TotalByMonth from "./TotalByMonth";
import { Col, Container, Row } from "react-bootstrap";
const TotalServiceMana = () => {
  return (
    <div className="all">
      <div className="row rowa">
        <Container fluid>
          <Row style={{ marginLeft: "30px", width: "100%", marginTop: "30px" }}>
            
          </Row>
          <Row>
            <Col md={6}>
              <TotalServices />
            </Col>
            <Col md={6}>
              <Total_Earned />
            </Col>
          </Row>
        </Container>

        <div className="row w-100">
          <Container fluid>
            <Row>
              <Col md={6}>
                <TotalBreed />
              </Col>
              <Col md={6}>
                <TotalByMonth />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default TotalServiceMana;
