import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    mobileNo: '',
    email:'',
    street: '',
    apartment: '',
    zip: '',
    city: '',
    country: '',
    newPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Fetch user details when the component mounts
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      })
      .then(data => {
        setUserData(data.user);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch user profile');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevUserData => ({
      ...prevUserData,
      [name]: value
    }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        setSuccessMessage('Profile updated successfully');
        setShowProfileModal(false); 
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrorMessage('Failed to update profile');
      });
  };

  const handleResetPassword = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ newPassword: userData.newPassword })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to reset password');
        }
        setSuccessMessage('Password reset successfully');
        setShowPasswordModal(false); 
      })
      .catch(error => {
        console.error('Error resetting password:', error);
        setErrorMessage('Failed to reset password');
      });
  };

  return (
    <Container>
      <h1 className="mt-5 text-center">Profile</h1>
      <div className="d-flex justify-content-center">
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
      </div>
      <Row className="mt-4">
        <Col sm={6} className="mx-auto">
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">Profile Details</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {userData.firstName} {userData.lastName}<br />
                <strong>Email:</strong> {userData.email}<br />
                <strong>Mobile No:</strong> {userData.mobileNo}<br />
                <strong>Address:</strong> {userData.street}, {userData.apartment}, {userData.zip} {userData.city}, {userData.country}
              </Card.Text>
              <div className="text-center">
                <Button variant="primary" className="mr-3" onClick={() => setShowProfileModal(true)}>Update Profile</Button>
                <Button variant="primary" onClick={() => setShowPasswordModal(true)}>Change Password</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProfile}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={userData.firstName || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={userData.lastName || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="mobileNo">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control type="text" name="mobileNo" value={userData.mobileNo || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="street">
              <Form.Label>Street</Form.Label>
              <Form.Control type="text" name="street" value={userData.street || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="apartment">
              <Form.Label>Apartment</Form.Label>
              <Form.Control type="text" name="apartment" value={userData.apartment || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="zip">
              <Form.Label>ZIP</Form.Label>
              <Form.Control type="text" name="zip" value={userData.zip || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" name="city" value={userData.city || ''} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control type="text" name="country" value={userData.country || ''} onChange={handleInputChange} />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">Update Profile</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" name="newPassword" value={userData.newPassword || ''} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleResetPassword}>Reset Password</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
