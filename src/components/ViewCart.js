import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Table } from "react-bootstrap";
import Swal from 'sweetalert2';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
};

const ViewCart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editableItem, setEditableItem] = useState(null);
    const [editedQuantity, setEditedQuantity] = useState({});
    const [selectAll, setSelectAll] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart data');
                }

                const data = await response.json();
                setCart(data.cart);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart data:', error.message);
                setError('Cart is empty. Please Add Item to cart.');
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/${productId}/removeFromCart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove product from cart');
            }

            const data = await response.json();
            setCart(data.cart);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product removed from cart successfully!'
            });
        } catch (error) {
            console.error('Error removing product from cart:', error.message);
            setError('Failed to remove product from cart. Please try again later.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to remove product from cart. Please try again later.'
            });
        }
    };

    const proceedToCheckout = async () => {
        try {
            console.log("Selected Products:", selectedItems);

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkoutSelected`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ selectedItems })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.unavailableProducts && errorData.unavailableProducts.length > 0) {
                    const unavailableProductNames = errorData.unavailableProducts.map(product => product.name).join(', ');
                    throw new Error(`Failed to checkout. The following products are not available in stock: ${unavailableProductNames}`);
                } else {
                    throw new Error(errorData.message || 'Failed to checkout selected items');
                }
            }

            const cartResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!cartResponse.ok) {
                throw new Error('Failed to fetch updated cart data');
            }

            const cartData = await cartResponse.json();
            setCart(cartData.cart);
            setSelectedItems([]); 
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Proceeded to checkout successfully!'
            });
        } catch (error) {
            console.error('Error proceeding to checkout:', error.message);
            setError('Failed to proceed to checkout . Please try again later.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });

        }
    };



    const clearCart = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clearCart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to clear cart');
            }

            const data = await response.json();
            setCart(data.cart);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Cart cleared successfully!'
            });
        } catch (error) {
            console.error('Error clearing cart:', error.message);
            setError('Failed to clear cart. Please try again later.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to clear cart. Please try again later.'
            });
        }
    };

    const fetchUserOrders = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user orders');
            }

            const data = await response.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching user orders:', error.message);
            setError('Failed to fetch user orders. Please try again later.');
        }
    };

    const handleViewOrderHistory = () => {
        fetchUserOrders();
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        selectedItems.forEach(item => {
            const cartItem = cart.cartItems.find(cartItem => cartItem.productId._id === item.productId);
            if (cartItem) {
                totalPrice += cartItem.subtotal;
            }
        });
        return totalPrice;
    };

    const renderTotalPrice = () => {
        const totalPrice = calculateTotalPrice();
        return <p>Total Price: {totalPrice}</p>;
    };

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedItems(cart.cartItems.map(item => ({ productId: item.productId._id, quantity: item.quantity })));
        } else {
            setSelectedItems([]);
        }
    };

    const toggleSelectItem = (productId, quantity) => {
        const updatedSelectedItems = selectedItems.some(item => item.productId === productId)
            ? selectedItems.filter(item => item.productId !== productId)
            : [...selectedItems, { productId, quantity }];
        setSelectedItems(updatedSelectedItems);
    };

    const toggleEditQuantity = (productId) => {
        setEditableItem(productId === editableItem ? null : productId);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setEditedQuantity({ ...editedQuantity, [productId]: newQuantity });
    };

    const saveChanges = async () => {
        try {
            await Promise.all(Object.entries(editedQuantity).map(([productId, quantity]) => updateQuantity(productId, quantity)));
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch updated cart data');
            }

            const data = await response.json();
            setCart(data.cart);
            setEditedQuantity({}); 
            setEditableItem(null); 
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Changes saved successfully!'
            });
        } catch (error) {
            console.error('Error saving changes and fetching updated cart data:', error.message);
            setError('Failed to save changes. Please try again later.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save changes. Please try again later.'
            });
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/updateQuantity`, {
                method: 'PUT',
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
                throw new Error('Failed to update product quantity in cart');
            }

            const data = await response.json();
            setCart(data.cart);
        } catch (error) {
            console.error('Error updating product quantity in cart:', error.message);
            setError('Failed to update product quantity in cart. Please try again later.');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update product quantity in cart. Please try again later.'
            });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) {
        Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: error,
            footer: '<Link to="/products">Click here to shop!</Link>'
        });
        return null;
    }

    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'Your cart is empty!',
            footer: '<Link to="/products">Click here to shop!</Link>'
        });
        return null;
    }

    return (
        <>
            <Container>
                <h2>Your Shopping Cart</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>#</th>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {cart.cartItems.map((item, index) => (
                        <tr key={`${item.productId._id}_${index}`}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.some(selectedItem => selectedItem.productId === item.productId._id)}
                                    onChange={() => toggleSelectItem(item.productId._id, item.quantity)}
                                />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item.productId.name}</td>
                            <td>{item.productId.price}</td>
                            <td>
                                {editableItem === item.productId._id ? (
                                    <input
                                        type="number"
                                        min="1"
                                        value={editedQuantity[item.productId._id] || item.quantity}
                                        onChange={(e) => handleQuantityChange(item.productId._id, parseInt(e.target.value))}
                                    />
                                ) : (
                                    <span>{item.quantity}</span>
                                )}
                            </td>
                            <td>{item.subtotal}</td>
                            <td>
                                {editableItem === item.productId._id ? (
                                    <Button variant="primary" onClick={saveChanges}>
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button variant="outline-primary" onClick={() => toggleEditQuantity(item.productId._id)}>
                                        Edit Quantity
                                    </Button>
                                )}
                                <Button variant="danger" onClick={() => removeFromCart(item.productId._id)}>
                                    Remove
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {renderTotalPrice()}
                    <Button variant="primary" onClick={proceedToCheckout}>
                        Proceed to Checkout
                    </Button>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Button variant="danger" onClick={clearCart} style={{ marginRight: '10px' }}>
                        Clear Cart
                    </Button>
                    <Link to="/products">
                        <Button variant="secondary">Continue Shopping</Button>
                    </Link>
                </div>
            </Container>
            
            <Container>
                <Button variant="primary" onClick={handleViewOrderHistory}>
                    My Order History
                </Button>
                {orders.length > 0 && (
                    <div>
                        <h2>My Orders</h2>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Total Price</th>
                                    <th>Ordered Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders
                                    .slice()
                                    .sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn))
                                    .map(order =>
                                        order.productsOrdered.map((productOrdered, index) => (
                                            <tr key={`${order._id}_${index}`}>
                                                <td>{order._id}</td>
                                                <td>{productOrdered.product.name}</td>
                                                <td>{productOrdered.quantity}</td>
                                                <td>{order.status}</td>
                                                <td>{order.totalPrice}</td>
                                                <td>{formatDate(order.orderedOn)}</td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Container>
        </>
    );
};

export default ViewCart;
