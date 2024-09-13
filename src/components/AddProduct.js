import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function AddProduct({ handleAddProduct }) {
    const { user } = useContext(UserContext);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [countInStock, setCountInStock] = useState("");

    function createProduct(e) {
        e.preventDefault();
        let token = localStorage.getItem('token');

        fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
                countInStock: countInStock
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if(data.error === "Product already exist") {
                Swal.fire({
                    icon: "error",
                    title: "Product already exists.",
                    text: data.message
                });
            } else if (data.error === "failed to save the Product") {
                Swal.fire({
                    icon: "error",
                    title: "Unsuccessful Product Creation",
                    text: data.message
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "Product Added"
                });
                // Call the handleAddProduct function passed as prop
                handleAddProduct();
            }
        })
        .catch(error => {
            console.error("Error adding product:", error);
        });

        setName("");
        setDescription("");
        setPrice("");
        setCountInStock("");
    }

    return (
        (user.isAdmin === true) ?
            <>
                <h1 className="my-5 text-center">Add Product</h1>
                <Form onSubmit={e => createProduct(e)}>
                    <Form.Group>
                        <Form.Label>Name:</Form.Label>
                        <Form.Control type="text" required value={name} onChange={e => setName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control type="text" required value={description} onChange={e => setDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price:</Form.Label>
                        <Form.Control type="number" required value={price} onChange={e => setPrice(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Count In Stock:</Form.Label>
                        <Form.Control type="number" required value={countInStock} onChange={e => setCountInStock(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="my-5">Submit</Button>
                </Form>
            </>
            :
            <Navigate to="/products" />
    );
}
