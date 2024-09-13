import { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

export default function AddToCart({ productId }) {
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProductDetails(data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (showModal && productId) {
            fetchProductDetails();
        }
    }, [showModal, productId]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const addToCart = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Something went wrong');
            }

            // Handle successful addition to cart
            // For example, show a success message or update the cart in state

            handleClose();
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle error, e.g., show an error message
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add to Cart
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add to Cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productDetails ? (
                        <>
                            <p>{productDetails.name}</p>
                            <p>{productDetails.description}</p>
                            <p>Price: Php.{productDetails.price}</p>
                            <p>In Stock: {productDetails.countInStock}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <p>Quantity:</p>
                    <input type="number" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addToCart}>
                        Add to Cart
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
