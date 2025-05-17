import React, { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { SuitHeart } from "react-bootstrap-icons";
import images from "../assets/images/3_dogs.png";
import dogImage1 from "../assets/images/005-salon.png";
import dogImage2 from "../assets/images/008-care.png";
import dogImage3 from "../assets/images/009-shower-e1573897060648.png";
import { Link } from "react-router-dom";

const Service_Item = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <Row className="container" style={{ marginTop: "100px" }}>
      <Col md={5}>
        <div className="text-center">
          <p>PetCare</p>
          <h2>DỊCH VỤ</h2>
          <h3>HÀNG ĐẦU</h3>
        </div>
        <div>
          <img src={images} alt="3 dogs" />
        </div>
      </Col>
      <Col md={7}>
        <div className="d-flex">
          <div>
            <Card
              style={{ width: "18rem", height: "28rem", marginRight: "10px" }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Img
                variant="top"
                src={dogImage1}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  alignItems: "center",
                }}
              />
              <Card.Body>
                <Card.Title>GROOMING</Card.Title>
                <Card.Text>
                  Chúng tôi biết cách làm thế nào để thú cưng của bạn trở nên
                  đẳng cấp và cá tính hơn. Với dịch vụ cắt tỉa lông thú cưng
                  chúng tôi sẽ giúp các bé trở thành phiên bản hoàn hảo nhất...
                </Card.Text>
                <Link to={"/grooming"}>
                  <Button variant="secondary">Xem Thêm</Button>
                </Link>
                {hoveredCard === 1 && (
                  <div className="heart-icon">
                    <SuitHeart />
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
          <div>
            <Card
              style={{ width: "18rem", height: "28rem", marginRight: "10px" }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Img
                variant="top"
                src={dogImage2}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  alignItems: "center",
                }}
              />
              <Card.Body>
                <Card.Title>SHOP</Card.Title>
                <Card.Text>
                  Cùng với hơn 3.000 khách hàng đã luôn tin tưởng, đồng hành,
                  chúng tôi luôn đặt ra những mục tiêu và thử thách mới. PetCare
                  cung cấp các sản phẩm, phụ kiện rất đa dạng...
                </Card.Text>
                <Link to={"/listproduct"}>
                  <Button variant="secondary">Xem Thêm</Button>
                </Link>
                {hoveredCard === 2 && (
                  <div className="heart-icon">
                    <SuitHeart />
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
          <div>
            <Card
              style={{ width: "18rem", height: "28rem", marginRight: "10px" }}
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card.Img
                variant="top"
                src={dogImage3}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  alignItems: "center",
                }}
              />
              <Card.Body>
                <Card.Title>HOTEL</Card.Title>
                <Card.Text>
                  Mọi hành động ở PETCARE đều bắt đầu từ sứ mệnh Trao Gửi
                  Yêu Thương. Mọi thú cưng mới khi đến với chúng tôi đều được
                  quan tâm đặc biệt bởi đội ngũ Nhân viên ...
                </Card.Text>
                <Button variant="secondary">Xem Thêm</Button>
                {hoveredCard === 3 && (
                  <div className="heart-icon">
                    <SuitHeart />
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Service_Item;
