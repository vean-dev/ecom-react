import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ProductDetailPage() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProduct(productId);
    }, [productId]);

    const fetchProduct = async (productId) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            const data = await response.json();
            setProduct(data.product);
        } catch (error) {
            console.error('Error fetching product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch product. Please try again later.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/addToCart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: quantity,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Cart',
                    text: 'Product successfully added to cart.',
                    confirmButtonText: 'OK'
                });
                setQuantity(1);
            } else {
                throw new Error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Item out of stock.',
                text: 'Failed to add item.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ productId: productId, quantity: quantity }),
            });

            if (response.ok) {
                fetchProduct(productId);
                Swal.fire({
                    icon: 'success',
                    title: 'Checked Out',
                    text: 'Product successfully checked out.',
                    confirmButtonText: 'OK'
                });
                
                setQuantity(1);
            } else {
                throw new Error('Failed to check out product');
            }
        } catch (error) {
            console.error('Error checking out product:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Item out of stock.',
                text: 'Failed to checkout.',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <img src="https://placehold.co/400" alt="Product" className="img-fluid" />
                </div>
                <div className="col-md-6">
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Price: Php. {product.price}</p>
                    <p>In Stock: {product.countInStock}</p>
                    <div className="mb-3">
                        <label htmlFor="quantity" className="form-label">Quantity:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                    </div>
                    <Button variant="outline-primary" onClick={addToCart} disabled={loading || product.countInStock === 0}>Add to Cart</Button>
                    <Button variant="outline-success" onClick={handleCheckout} className="ms-2" disabled={loading || product.countInStock === 0}>Checkout</Button>
                </div>
            </div>
        </div>
    );
}
