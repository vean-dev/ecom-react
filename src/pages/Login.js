import { useContext, useEffect, useState } from 'react';
import { Form, Button, Card, CardBody, Container } from 'react-bootstrap';
import { Navigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UserContext from "../UserContext";

export default function Login() {

    const { user, setUser } = useContext(UserContext);

	console.log(user);


	const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);

	function authenticate(e) {

        e.preventDefault();
		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`,{

		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({

			email: email,
			password: password

		})
	})
	.then(res => res.json())
	.then(data => {

		

		if (typeof data.access !== "undefined"){

			localStorage.setItem("token", data.access);

			retrieveUserDetails(data.access);

			Swal.fire({
			  title: "Login successful!",
			  text: "Welcome to EBenta!",
			  icon: "success"
			});
		
		} else if (data.error === "No Email Found") {

			Swal.fire({
			  title: "No email found!",
			  text: "Please register first.",
			  icon: "error"
			});

		} else {

			Swal.fire({
			  title: "Authentication failed.",
			  text: "Check your login credentials",
			  icon: "error"
			});
		}
	})
	setEmail('');
	setPassword('');
    }

    const retrieveUserDetails = (token) => {

    
    	fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
    		headers: {
    			Authorization: `Bearer ${token}`
    		}
    	})
    	.then(res => res.json())
    	.then(data => {

    		console.log("User data:",data);

    		setUser({
    			id: data.user._id,
    			isAdmin: data.user.isAdmin
    		});

    	})

    }

	useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);



    return (

    	<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
    	    {(user.id !== null) ? (
    	        <Navigate to="/products" />
    	    ) : (
    	        <Card className="border-dark" style={{ maxWidth: '400px' }}>
    	            <CardBody>
    	                <Form onSubmit={(e) => authenticate(e)}>
    	                    <h1 className="my-5 text-center" style={{ color: '' }}>Login into your account</h1>
    	                    <Form.Group controlId="userEmail">
    	                        <Form.Label>Email Address</Form.Label>
    	                        <Form.Control
    	                            type="email"
    	                            value={email}
    	                            onChange={(e) => setEmail(e.target.value)}
    	                            required
    	                        />
    	                    </Form.Group>

    	                    <Form.Group controlId="password">
    	                        <Form.Label>Password</Form.Label>
    	                        <Form.Control
    	                            type="password"
    	                            value={password}
    	                            onChange={(e) => setPassword(e.target.value)}
    	                            required
    	                        />
    	                    </Form.Group>

    	                    {isActive ?
    	                        <Button variant="primary" type="submit" id="submitBtn">
    	                            Submit
    	                        </Button>
    	                        :
    	                        <Button variant="danger" type="submit" id="submitBtn" disabled>
    	                            Submit
    	                        </Button>
    	                    }
    	                </Form>
    	                <p className="mt-3 text-center">
    	                    Don't have an account yet? <Link to="/register">Click here to register</Link>
    	                </p>
    	            </CardBody>
    	        </Card>
    	    )}
    	</Container>

        
    );
}
