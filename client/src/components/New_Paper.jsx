import React from "react";
import "../style/sup.css";
import { Card } from "primereact/card";
import images from "../assets/images/Hỗ-trợ-247.png";
const SupportSection = () => {
  return (
    <div className="support-section">
      <div className="support-header d-flex">
        <h2>
          Hỗ trợ <span className="highlight">24/7</span>
        </h2>
        <div className="clock-icon">
          <img src={images} style={{ height: "200px" }}></img>
          <i className="fas fa-clock"></i>
        </div>
      </div>

      <div className="articles-section">
        <h3>Bài Viết Mới</h3>
        <Card>
          <h4>Triệu Chứng Bệnh Dại Ở Mèo</h4>
          <a href="#">XEM THÊM »</a>
        </Card>
        <br></br>
        <Card>
          <h4>Tắm Thú Cưng Tại Nhà Cầu Giấy - Hà Nội</h4>
          <a href="#">XEM THÊM »</a>
        </Card>
      </div>
    </div>
  );
};

export default SupportSection;
