import React, { useContext, useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import ArchiveProduct from './ArchiveProduct';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function AdminView({ productsData, fetchData }) {
    const [orders, setOrders] = useState([]);
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [updateStatusModalShow, setUpdateStatusModalShow] = useState(false);
    const [userId, setUserId] = useState('');
    const [filter, setFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');

    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user,fetchData]);

    const fetchOrders = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return res.json();
            })
            .then(data => {
                setOrders(data.orders || []);
            })
            .catch(error => {
                console.error("Error fetching orders:", error);
                setOrders([]);
            });
    };

    const openAddProductModal = () => setShowAddProductModal(true);
    const closeAddProductModal = () => setShowAddProductModal(false);

    const closeOrdersModal = () => setShowOrdersModal(false);

    const updateOrderStatus = (orderId, status) => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/orderUpdateStatus`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ id: orderId, status })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to update order status');
                }
                return res.json();
            })
            .then(data => {
                console.log(data);
                const updatedOrders = orders.map(order => {
                    if (order._id === orderId) {
                        return { ...order, status };
                    }
                    return order;
                });
                setOrders(updatedOrders);
            })
            .catch(error => {
                console.error("Error updating order status:", error);
            });
    };

    const handleUpdateStatus = (orderId) => {
        setSelectedOrderId(orderId);
        setUpdateStatusModalShow(true);
    };

    const handleCloseUpdateStatus = () => {
        setSelectedOrderId(null);
        setUpdateStatusModalShow(false);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleStockFilterChange = (e) => {
        setStockFilter(e.target.value);
    };

    const updateUserAsAdmin = () => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/set-as-admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ userId })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update user as admin');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: data.message
            });
        })
        .catch(error => {
            console.error("Error updating user as admin:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update user as admin'
            });
        });
    };

    return (
        <>
            <h1 className="text-center my-4">Admin Dashboard</h1>
            <div className="text-center my-2">
                <Button variant="primary" onClick={openAddProductModal}>Add Product</Button>
                <Button variant="primary" onClick={() => { fetchOrders(); setShowOrdersModal(true); }}>Show User Orders</Button>
            </div>
            <Form>
                <Form.Group>
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={updateUserAsAdmin}>Update User</Button>
            </Form>

            <Form>
                <Form.Group>
                    <Form.Label>Filter by Availability:</Form.Label>
                    <Form.Control as="select" value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </Form.Control>
                </Form.Group>
            </Form>

            <Form>
                <Form.Group>
                    <Form.Label>Filter by In Stock:</Form.Label>
                    <Form.Control as="select" value={stockFilter} onChange={handleStockFilterChange}>
                        <option value="all">All</option>
                        <option value="instock">In Stock</option>
                        <option value="outofstock">Out of Stock</option>
                    </Form.Control>
                </Form.Group>
            </Form>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr className="text-center">
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>In Stock</th>
                        <th>Availability</th>
                        <th colSpan="2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {productsData
                        .filter(product => {
                            if (filter === 'all') return true;
                            if (filter === 'available') return product.isActive;
                            if (filter === 'unavailable') return !product.isActive;
                            return false;
                        })
                        .filter(product => {
                            if (stockFilter === 'all') return true;
                            if (stockFilter === 'instock') return product.countInStock > 0;
                            if (stockFilter === 'outofstock') return product.countInStock === 0;
                            return false;
                        })
                        .map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>{product.countInStock}</td>
                                <td className={product.isActive ? "text-success" : "text-danger"}>
                                    {product.isActive ? "Available" : "Unavailable"}
                                </td>
                                <td><EditProduct product={product._id} fetchData={fetchData} /></td>
                                <td><ArchiveProduct productId={product._id} isActive={product.isActive} fetchData={fetchData} /></td>
                            </tr>
                        ))}
                </tbody>
            </Table>
            <Modal show={showAddProductModal} onHide={closeAddProductModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddProduct handleAddProduct={fetchData} closeAddProductModal={closeAddProductModal} />
                </Modal.Body>
            </Modal>
            <Modal show={showOrdersModal} onHide={closeOrdersModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Orders</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr className="text-center">
                                <th>Order ID</th>
                                <th>User ID</th>
                                <th>Ordered Products</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Ordered On</th>
                                <th>Update Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.userId}</td>
                                    <td>
                                        <ul>
                                            {order.productsOrdered.map(productOrdered => (
                                                <li key={productOrdered.product._id}>{productOrdered.product.name}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.status}</td>
                                    <td>{order.orderedOn}</td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleUpdateStatus(order._id)}>Update Status</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <Modal show={updateStatusModalShow} onHide={handleCloseUpdateStatus}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Order Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="primary" onClick={() => updateOrderStatus(selectedOrderId, "Shipped")}>Mark as Shipped</Button>
                    <Button variant="danger" onClick={() => updateOrderStatus(selectedOrderId, "Cancelled")}>Cancel Order</Button>
                </Modal.Body>
            </Modal>
        </>
    );
}