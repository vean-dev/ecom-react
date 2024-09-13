import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';

export default function AdminUserUpdatePage() {
    const [userId, setUserId] = useState('');

    const handleUserIdChange = (event) => {
        setUserId(event.target.value);
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
        .then(res => res.json())
        .then(data => {
            console.log(data);
            swal("Success", "User updated as admin successfully", "success");
            setUserId(''); // Reset userId input field
        })
        .catch(error => {
            console.error("Error updating user as admin:", error);
            swal("Error", "Failed to update user as admin. Please try again later.", "error");
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (userId) {
            updateUserAsAdmin();
        } else {
            swal("Error", "Please enter a user ID", "error");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Update User to Admin</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="userId">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter user ID"
                        value={userId}
                        onChange={handleUserIdChange}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update User as Admin
                </Button>
            </Form>
        </div>
    );
}