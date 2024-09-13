import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

import '../App.css';

const HomePage = () => {
  
  const reasons = [
    'Wide selection of high-quality products',
    'Competitive prices',
    'Excellent customer service',
    'Fast shipping',
    'Secure payment options',
    'Hassle-free returns'
  ];

  const [randomReason, setRandomReason] = useState('');


  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * reasons.length);
      setRandomReason(reasons[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, [reasons]);

  return (
    <div className="home-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="welcome-banner text-center mb-5">
              <h1>Welcome to Our E-commerce Store</h1>
              <p>Discover amazing products and shop with ease!</p>
            </div>
            <div className="about-us">
              <h2 className="text-center mb-4">About Us</h2>
              <p>
                Welcome to our e-commerce store! We are dedicated to providing you with the best online shopping experience. Our mission is to offer a wide range of high-quality products at competitive prices, coupled with excellent customer service.
              </p>
              <p>
                At our store, we carefully curate our product selection to ensure that you find exactly what you need. Whether you're looking for electronics, fashion, home goods, or anything in between, we've got you covered.
              </p>
              <p>
                Our team is committed to making your shopping experience seamless and enjoyable. We strive to provide fast shipping, secure payments, and hassle-free returns.
              </p>
              <h3 className="mt-5">Why Shop With Us?</h3>
              <ul className="reasons-list">
                <li className="reason-item slide-in">{randomReason}</li>
              </ul>
              <p>
                Thank you for choosing us as your trusted online retailer. We look forward to serving you!
              </p>
            </div>
            <div className="buy-now-button text-center mt-5">
              <Link to="/products">
                <Button variant="primary">Shop Now</Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
