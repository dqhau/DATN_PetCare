import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, TwitterX } from 'react-bootstrap-icons';

const Footer = () => {
    return (
        <footer className="text-center text-lg-start text-white" style={{ backgroundColor: '#3a4da6', marginTop: '20px', paddingBottom: '20px' }}>
            <Container className="p-4">
                <Row className="my-4">
                    <Col lg={4} md={6} className="mb-4 mb-md-0" style={{ paddingRight: "20px", paddingLeft: "20px", textAlign: "left" }}>
                        <div>
                            <div style={{ fontSize: '35px', fontWeight: 'bold', textDecoration: 'underline' }}>
                                PETCARE
                            </div>
                            <p className="text-start mt-4">
                                PETCARE cung cấp các dịch vụ chăm sóc thú cưng chuyên nghiệp và đáng tin cậy, bao gồm spa, khách sạn, và dịch vụ tại nhà. Chúng tôi cam kết mang lại trải nghiệm tốt nhất cho thú cưng của bạn, với nhiều năm kinh nghiệm trong ngành.
                            </p>
                        </div>
                    </Col>

                    <Col lg={3} md={6} className="mb-4 mb-md-0" style={{ paddingRight: "20px", paddingLeft: "20px", textAlign: "left", paddingTop: "20px" }}>
                        <h5 className="text-uppercase mb-4" style={{ paddingRight: '50px' }}>Dịch Vụ</h5>
                        <ul className="list-unstyled" style={{ paddingLeft: 0 }}>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-brightness-high"></i> Spa thú cưng chuẩn 5 sao
                                </Link>
                            </li>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-brightness-high"></i> Dịch vụ tắm thú cưng tại nhà
                                </Link>
                            </li>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-brightness-high"></i> Dịch vụ cắt tỉa lông tại nhà
                                </Link>
                            </li>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-brightness-high"></i> Cung cấp sản phẩm, phụ kiện
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={3} md={6} className="mb-4 mb-md-0" style={{ paddingRight: "20px", paddingLeft: "20px", textAlign: "left", paddingTop: "20px" }}>
                        <h5 className="text-uppercase mb-4" style={{ paddingRight: '50px' }}>TRUY CẬP</h5>
                        <ul className="list-unstyled" style={{ paddingLeft: 0 }}>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-house"></i> Trang chủ
                                </Link>
                            </li>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-house"></i> Giới thiệu về PETCARE
                                </Link>
                            </li>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <Link to="#!" className="text-white d-flex align-items-center">
                                    <i className="bi bi-house"></i> Chia sẻ kinh nghiệm và kiến thức
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={2} md={6} className="mb-4 mb-md-0" style={{ paddingRight: "20px", paddingLeft: "20px", textAlign: "left", paddingTop: "20px" }}>
                        <h5 className="text-uppercase mb-4" style={{ paddingRight: '110px' }}>Contact</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-map-marker-alt pe-2"></i>
                                    <div>Cửa hàng trên toàn quốc</div>
                                </div>
                            </li>
                            <li className="mb-2" style={{ listStyle: 'none' }}>
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-phone pe-2"></i>
                                    <div>+84123456789</div>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <ul className="list-inline d-flex justify-content-start">
                                        <li className="list-inline-item me-3">
                                            <Link to="#!"><Facebook size={24} style={{ color: 'white' }} /></Link>
                                        </li>
                                        <li className="list-inline-item me-3">
                                            <Link to="#!"><TwitterX size={24} style={{ color: 'white' }} /></Link>
                                        </li>
                                        <li className="list-inline-item">
                                            <Link to="#!"><Instagram size={24} style={{ color: 'white' }} /></Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>

            <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)', marginBottom: '-20px' }}>
                © 2025 Copyright:
                <a className="text-white" href="https://mdbootstrap.com/">PetCare</a>
            </div>
        </footer>
    );
};

export default Footer;
