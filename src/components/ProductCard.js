import { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

export default function ProductCard({ productProp }) {
    const { _id, name, description, price, countInStock } = productProp;
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => {
        setShowModal(false);
        setError(null);
    }

    const handleShow = () => setShowModal(true);

    const addToCart = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: _id,
                    quantity: quantity,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Cart',
                    text: 'Product successfully added to cart.',
                    confirmButtonText: 'OK'
                });
                setQuantity(1);
                handleClose();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add',
                    text: data.error || 'Failed to add item to cart',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error adding item to cart:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to add item to cart. Please try again later.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId: _id, quantity: quantity }),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedCountInStock = countInStock - quantity;
                Swal.fire({
                    icon: 'success',
                    title: 'Checked Out',
                    text: 'Product successfully checked out.',
                    confirmButtonText: 'OK'
                });
                setQuantity(1);
                handleClose();
                productProp.countInStock = updatedCountInStock;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Checkout Failed',
                    text: data.error || 'Failed to check out product',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error checking out product:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to check out product. Please try again later.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <Card className="productCard" style={{ marginBottom: '20px', width: '100%', height: '100%', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
            <Card.Img variant="top" src="https://placehold.co/400" style={{ height: '100%', objectFit: 'objectFit' }} />
            <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{name}</Card.Title>
                <Card.Text style={{ marginBottom: '15px', fontSize: '1rem', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{description}</Card.Text>
                <Card.Text style={{ fontSize: '1.2rem', color: '#007bff' }}>Php. {price}</Card.Text>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', width: '100%' }}>
                    <Link to={`/products/${_id}`} style={{ textDecoration: 'none', width: '48%' }}>
                        <Button variant="outline-primary">View Details</Button>
                    </Link>
                    <Button variant="outline-dark" onClick={handleShow}>Quick View</Button>
                </div>
            </Card.Body>
        </Card>
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{name}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src="https://placehold.co/400" alt="Product" style={{ width: 'auto', maxHeight: '250px', marginBottom: '20px' }} />
                    <div style={{ width: '100%' }}>
                        <p>Name: {name}</p>
                        <p>Description: {description}</p>
                        <p>Price: Php.{price}</p>
                        <p>In Stock: {countInStock}</p>
                        <p>Quantity:
                            <input
                                type="number"
                                min="1"
                                max={countInStock}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                style={{ width: '50px', marginLeft: '5px' }}
                            />
                        </p>
                        <div style={{ display: 'flex', marginTop: '10px' }}>
                            <Button 
                                variant="outline-primary" 
                                onClick={addToCart} 
                                disabled={countInStock === 0 || loading} 
                                style={{ flex: '1', marginRight: '10px', color: '#007bff', borderColor: '#007bff' }}
                            >
                                Add to Cart
                            </Button>
                            <Button 
                                variant="outline-success" 
                                onClick={handleCheckout} 
                                disabled={countInStock === 0 || loading} 
                                style={{ flex: '1', color: '#28a745', borderColor: '#28a745' }}
                            >
                                Checkout
                            </Button>
                        </div>
                        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
