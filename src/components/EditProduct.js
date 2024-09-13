import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

export default function EditProduct({ product, fetchData }){

	// state for courseId for the fetch url
	const [productId, setProductId] = useState("");


	//Forms state

	const[name, setName] = useState("");
	const[description, setDescription] = useState("");
	const[price, setPrice] = useState(0);
	const[countInStock, setCountInStock] = useState(0);


	//Modal state

	const [showEdit, setShowEdit] = useState(false);

	const openEdit = (productId) => {

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,{
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
			.then(res => res.json())
			.then(data => {

				setProductId(data.product._id);
				setName(data.product.name);
				setDescription(data.product.description);
				setPrice(data.product.price);
				setCountInStock(data.product.countInStock);
			})

			setShowEdit(true);
	}

	const closeEdit = () =>{

		setShowEdit(false);
		setProductId("");
		setName("");
		setDescription("");
		setPrice(0);
		setCountInStock(0);


	}

	const editProduct = (e, productId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${ productId }`, {

			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			},
			body: JSON.stringify({

				name: name,
				description: description,
				price: price,
				countInStock: countInStock
			})
		})
		.then(res => res.json())
		.then(data =>{

			console.log(data);

			if(data.message === "Product updated successfully"){
				Swal.fire({
				  title: "Success!",
				  text: "Product successfully  updated.",
				  icon: "success"
				});

				closeEdit();
				fetchData();

			} else {
				Swal.fire({
				  title: "Error!",
				  text: "Please try again.",
				  icon: "error"
				});

				closeEdit();				
			}
		})

	}


	return (

		<>
			<Button variant="primary" size="m" onClick={() => openEdit(product)}> Update </Button>

			{/*Edit Course Modal*/}
			<Modal show={showEdit} onHide={closeEdit}>

				<Form onSubmit={e => editProduct(e, productId)}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Product</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group controlId="productName">
						    <Form.Label>Name:</Form.Label>
						    <Form.Control type="text" placeholder="Enter Name" required value={name} onChange={e => {setName(e.target.value)}}/>
						</Form.Group>
						<Form.Group controlId="productDescription">
						    <Form.Label>Description:</Form.Label>
						    <Form.Control type="text" placeholder="Enter Description" required value={description} onChange={e => {setDescription(e.target.value)}}/>
						</Form.Group>
						<Form.Group controlId="productPrice">
						    <Form.Label>Price:</Form.Label>
						    <Form.Control type="number" placeholder="Enter Price" required value={price} onChange={e => {setPrice(e.target.value)}}/>
						</Form.Group>
						<Form.Group controlId="productCountInStock">
						    <Form.Label>Count In Stock:</Form.Label>
						    <Form.Control type="number" placeholder="Enter Count In Stock" required value={countInStock} onChange={e => {setCountInStock(e.target.value)}}/>
						</Form.Group>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={closeEdit}>Close</Button>
						<Button variant="success" type="submit">Submit</Button>
					</Modal.Footer>
				</Form>				

			</Modal>

		</>



		)
}